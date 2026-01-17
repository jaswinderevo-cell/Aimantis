# guests/models.py - Add new fields but keep id_number
from django.db import models
# replace with: from django.contrib.postgres.fields import JSONField and use JSONField below.
JSON = models.JSONField

class Guest(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    DOCUMENT_TYPE_CHOICES = [
        ('passport', 'Passport'),
        ('id_card', 'ID Card'),
        ('drivers_license', 'Driver\'s License'),
    ]
    
    booking = models.ForeignKey(
        "bookings.Booking",
        on_delete=models.CASCADE,
        related_name="guests",
        null=True,
        blank=False
    )
    
    # Basic Information
    full_name = models.CharField(max_length=255)
    is_main_guest = models.BooleanField(default=False)
    
    # Contact Information
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # NEW: Birth Information (for check-in form)
    date_of_birth = models.DateField(blank=True, null=True)
    country_of_birth = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True, null=True)
    
    # NEW: Document Information (for check-in form)
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPE_CHOICES, blank=True, null=True)
    id_number = models.CharField(max_length=50, blank=True, null=True)  # KEEP THIS - old field
    document_issue_date = models.DateField(blank=True, null=True)  # NEW
    document_expiry_date = models.DateField(blank=True, null=True)  # NEW
    document_issuing_country = models.CharField(max_length=100, blank=True, null=True)  # NEW
    
    # Address & Identification
    nationality = models.CharField(max_length=100, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    zip_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    
    # Preferences & Notes
    language_preference = models.CharField(max_length=50, blank=True, null=True)
    special_requests = models.TextField(blank=True, null=True)
    guest_notes = models.TextField(blank=True, null=True)
    extra_data = models.JSONField(
        blank=True,
        null=True,
        default=dict,
        help_text="Store template-driven additional/custom fields for this guest (keyed by field slug)."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "guests"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} - {'Main' if self.is_main_guest else 'Additional'} Guest"
