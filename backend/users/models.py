from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='created_users',
        help_text="User who created this account"
    )
    super_admin = models.BooleanField(
        default=True,
        help_text="Super admin has full database access"
    )
    property_count = models.PositiveIntegerField(
        default=0,
        help_text="Number of properties managed by user"
    )
    phone_number = models.CharField(
        max_length=20, 
        blank=True, 
        null=True,
        help_text="User's phone number"
    )
    company = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        help_text="Company name"
    )
    job_title = models.CharField(
        max_length=100, 
        blank=True, 
        null=True,
        help_text="Job title/position"
    )
    image_url = models.URLField(
        max_length=500, 
        blank=True, 
        null=True,
        help_text="Profile image URL"
    )
    company_logo_url = models.URLField(
        max_length=500, 
        blank=True, 
        null=True,
        help_text="Company logo URL"
    )
    # NEW: 2FA Setting
    two_factor_enabled = models.BooleanField(
        default=False,
        help_text="Whether two-factor authentication is enabled"
    )
    
    # Existing timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        role = "Super Admin" if self.super_admin else "Admin"
        return f"{self.user.username} - {role}"

    class Meta:
        db_table = 'user_profiles'

class LoginSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_sessions')
    session_key = models.CharField(max_length=40, unique=True, help_text="Django session key")
    ip_address = models.GenericIPAddressField(help_text="IP address of login")
    user_agent = models.TextField(help_text="Browser/device user agent")
    device_type = models.CharField(max_length=50, blank=True, null=True, help_text="Device type (Mobile, Desktop, etc.)")
    browser = models.CharField(max_length=100, blank=True, null=True, help_text="Browser name")
    operating_system = models.CharField(max_length=100, blank=True, null=True, help_text="Operating system")
    location = models.CharField(max_length=200, blank=True, null=True, help_text="Approximate location")
    is_active = models.BooleanField(default=True, help_text="Whether session is still active")
    login_time = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    logout_time = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'login_sessions'
        ordering = ['-login_time']

    def __str__(self):
        return f"{self.user.username} - {self.device_type} - {self.login_time}"

    @property
    def session_duration(self):
        """Calculate session duration"""
        if self.logout_time:
            return self.logout_time - self.login_time
        return None

    @property
    def is_current_session(self):
        """Check if this is an active JWT session"""
        # For JWT, we consider sessions active if they're not explicitly logged out
        # and were created recently (within token expiry time)
        if not self.is_active or self.logout_time:
            return False
        
        # Consider session active if created within last 24 hours
        # You can adjust this based on your JWT token expiry
        cutoff = timezone.now() - timezone.timedelta(hours=24*30)  # 30 days
        return self.login_time > cutoff
