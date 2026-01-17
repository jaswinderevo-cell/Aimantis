import uuid
from datetime import timedelta
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User

class Structure(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    
    # Structure owner (one-to-many)
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name="owned_structures",
        help_text="Owner of the structure"
    )
    
    # Basic Information
    name = models.CharField(max_length=255, help_text="Structure Name")
    structure_type = models.CharField(
        max_length=100, help_text="Internal property ID / type")
    internal_reference_code = models.CharField(
        max_length=100, help_text="Internal Reference Code", blank=True, null=True
    )
    image_url = models.URLField(max_length=500, blank=True, null=True)
    base_price = models.IntegerField(default=0, blank=True, null=True)
    occupancy = models.IntegerField(default=0, blank=True, null=True)
    rating = models.FloatField(default=0.0, blank=True, null=True)
    total_units = models.IntegerField(default=0, blank=True, null=True)
    status = models.CharField(max_length=8, choices=STATUS_CHOICES, blank=True, null=True, default='active')
    
    # Location Information
    street_address = models.CharField(max_length=255, blank=True, null=True)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, blank=True, null=True)
    
    # Legal & Administrative
    legal_entity_name = models.CharField(max_length=255, blank=True, null=True)
    tax_id_vat_number = models.CharField(max_length=100, blank=True, null=True)
    
    # Operational Settings
    default_currency = models.CharField(max_length=10, blank=True, null=True)
    default_language = models.CharField(max_length=50, blank=True, null=True)
    time_zone = models.CharField(max_length=50, blank=True, null=True)
    default_check_in_time = models.TimeField(blank=True, null=True)
    default_check_out_time = models.TimeField(blank=True, null=True)
    
    # FIXED: Many-to-Many with through_fields specified
    users = models.ManyToManyField(
        User,
        through='StructureUser',
        through_fields=('structure', 'user'),  # IMPORTANT: Specifies which FK to use
        related_name='accessible_structures',
        blank=True,
        help_text="Users who have access to this structure"
    )
    
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        db_table = "structures"

    def __str__(self):
        return self.name

class StructureUser(models.Model):
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Editor', 'Editor'), 
        ('Viewer', 'Viewer'),
    ]
    
    structure = models.ForeignKey(
        Structure, 
        on_delete=models.CASCADE, 
        related_name='structure_users'
    )
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='user_structures'
    )
    role = models.CharField(
        max_length=10, 
        choices=ROLE_CHOICES, 
        default='Viewer',
        help_text="User's role in this structure"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # This field is NOT part of the M2M relationship
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_structure_users',
        help_text="User who added this user to the structure"
    )

    class Meta:
        db_table = 'structure_users'
        unique_together = ['structure', 'user']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.structure.name} ({self.role})"

class Invitation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(help_text="Email address of the invitee")
    structure = models.ForeignKey(
        Structure,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='invitations',
        help_text="Structure to invite user to (optional)"
    )
    role = models.CharField(
        max_length=10,
        choices=StructureUser.ROLE_CHOICES,
        default='Viewer',
        help_text="Role to assign in structure"
    )
    message = models.TextField(
        blank=True,
        null=True,
        help_text="Personal message from inviter"
    )
    invited_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_invitations'
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending'
    )
    expires_at = models.DateTimeField()
    accepted_at = models.DateTimeField(null=True, blank=True)
    created_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='received_invitations',
        help_text="User created from this invitation"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'invitations'
        ordering = ['-created_at']

    def __str__(self):
        structure_name = self.structure.name if self.structure else "System"
        return f"Invitation to {self.email} for {structure_name}"

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at and self.status == 'pending'
    
    @property
    def days_until_expiry(self):
        if self.status != 'pending':
            return 0
        delta = self.expires_at - timezone.now()
        return max(0, delta.days)

    def expire(self):
        """Mark invitation as expired"""
        if self.status == 'pending':
            self.status = 'expired'
            self.save()

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(days=15)
        super().save(*args, **kwargs)

class ChannelSettings(models.Model):
    """Channel settings for a structure including availability and price settings"""
    
    BOOKING_TYPE_CHOICES = [
        ('relative', 'Relative'),
        ('absolute', 'Absolute'),
    ]
    
    structure = models.OneToOneField(
        Structure,
        on_delete=models.CASCADE,
        related_name='channel_settings',
        help_text="Structure these settings belong to"
    )
    
    # ===== AVAILABILITY SETTINGS =====
    
    # Default Settings
    default_booking_type = models.CharField(
        max_length=10,
        choices=BOOKING_TYPE_CHOICES,
        default='relative',
        help_text="Default booking type: Relative or Absolute"
    )
    default_booking_value = models.PositiveIntegerField(
        default=6,
        help_text="Default booking value (days for relative, specific value for absolute)"
    )
    default_booking_until_date = models.DateField(
        null=True,
        blank=True,
        help_text="Default booking until date (for absolute type)"
    )
    
    # Individual Accommodations (stored as JSON)
    individual_accommodations = models.JSONField(
        default=dict,
        blank=True,
        help_text="Property-specific booking settings override"
    )
    
    # ===== PRICE SETTINGS =====
    
    booking_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text="% increase from base price for Booking.com (0-100)"
    )
    airbnb_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text="% increase from base price for Airbnb (0-100)"
    )
    expedia_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text="% increase from base price for Expedia (0-100)"
    )
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_channel_settings'
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='updated_channel_settings'
    )

    class Meta:
        db_table = 'channel_settings'
        verbose_name = 'Channel Setting'
        verbose_name_plural = 'Channel Settings'

    def __str__(self):
        return f"Channel Settings for {self.structure.name}"

    def get_property_booking_settings(self, property_id):
        """Get booking settings for a specific property"""
        property_id_str = str(property_id)
        if property_id_str in self.individual_accommodations:
            return self.individual_accommodations[property_id_str]
        
        # Return default settings
        return {
            'booking_type': self.default_booking_type,
            'booking_value': self.default_booking_value,
            'booking_until_date': self.default_booking_until_date.isoformat() if self.default_booking_until_date else None
        }

    def set_property_booking_settings(self, property_id, booking_type, booking_value, booking_until_date=None):
        """Set booking settings for a specific property"""
        if not self.individual_accommodations:
            self.individual_accommodations = {}
        
        self.individual_accommodations[str(property_id)] = {
            'booking_type': booking_type,
            'booking_value': booking_value,
            'booking_until_date': booking_until_date.isoformat() if booking_until_date else None
        }
        self.save()



