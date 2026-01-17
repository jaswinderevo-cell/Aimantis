# users/serializers.py - Enhanced with user roles
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone
from .models import LoginSession
import user_agents
import uuid
from rest_framework import serializers
from django.contrib.auth.models import User, Group
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate
from drf_spectacular.utils import extend_schema_serializer, extend_schema_field, OpenApiExample
from .models import UserProfile, LoginSession
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Login Request',
            value={
                "email": "user@example.com",
                "password": "your_password"
            }
        )
    ]
)

class EmailLoginSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        errors = {}

        if not email:
            errors["email"] = ["Email is required."]
        if not password:
            errors["password"] = ["Password is required."]

        if errors:
            raise serializers.ValidationError(errors)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"detail": "No account found with this email."}
            )

        user = authenticate(username=user.username, password=password)
        if not user:
            raise serializers.ValidationError({"detail": "Invalid email or password."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "This account is inactive."})

        # Store user for session tracking
        self.user = user

        refresh = self.get_token(user)
        
        # Track login session
        self.track_login_session(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "roles": [group.name for group in user.groups.all()],
            },
        }

    def track_login_session(self, user):
        """Track login session"""
        try:
            request = self.context.get('request')
            if not request:
                return

            # Get client information
            user_agent_string = request.META.get('HTTP_USER_AGENT', '')
            user_agent = user_agents.parse(user_agent_string)
            ip_address = self.get_client_ip(request)
            
            # Generate unique session key for JWT
            session_key = f"jwt_{user.id}_{timezone.now().timestamp()}_{uuid.uuid4().hex[:8]}"
            
            # Create login session
            LoginSession.objects.create(
                user=user,
                session_key=session_key,
                ip_address=ip_address,
                user_agent=user_agent_string,
                device_type=self.get_device_type(user_agent),
                browser=f"{user_agent.browser.family} {user_agent.browser.version_string}",
                operating_system=f"{user_agent.os.family} {user_agent.os.version_string}",
                location=self.get_location(ip_address),
                is_active=True
            )
        except Exception as e:
            # Don't fail login if session tracking fails
            print(f"Session tracking failed: {e}")

    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', 'Unknown')
        return ip

    def get_device_type(self, user_agent):
        """Determine device type"""
        if user_agent.is_mobile:
            return 'Mobile'
        elif user_agent.is_tablet:
            return 'Tablet'
        elif user_agent.is_pc:
            return 'Desktop'
        else:
            return 'Unknown'

    def get_location(self, ip_address):
        """Get approximate location"""
        if ip_address in ['127.0.0.1', 'localhost'] or ip_address.startswith('192.168.') or ip_address.startswith('10.'):
            return "Local Network"
        return "Unknown Location"

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Registration Request',
            value={
                "username": "johndoe",
                "password": "secure_password123",
                "email": "john@example.com"
            }
        )
    ]
)
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "password", "email"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            email=validated_data.get("email", ""),
        )
        
        # Automatically assign Admin role to new users
        admin_group, created = Group.objects.get_or_create(name='Admin')
        user.groups.add(admin_group)
        
        # Create user profile with SUPER ADMIN privileges for new signups
        UserProfile.objects.create(
            user=user,
            created_by=self.context['request'].user if self.context.get('request') and self.context['request'].user.is_authenticated else None,
            super_admin=True  # ALL NEW SIGNUPS ARE SUPER ADMINS
        )
        
        return user

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'User List Response',
            value={
                "id": 1,
                "username": "johndoe",
                "email": "john@example.com",
                "first_name": "John",
                "last_name": "Doe",
                "full_name": "John Doe",
                "date_joined": "2025-01-01T12:00:00Z",
                "is_active": True,
                "roles": [
                    {
                        "id": 1,
                        "name": "Property Manager"
                    }
                ]
            }
        )
    ]
)
class UserListSerializer(serializers.ModelSerializer):
    """Serializer for listing users with essential fields only"""
    full_name = serializers.SerializerMethodField()
    roles = serializers.SerializerMethodField()
    created_by = serializers.SerializerMethodField()
    is_super_admin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'full_name', 'date_joined', 'is_active', 'roles', 'created_by',
            'is_super_admin'
        ]

    @extend_schema_field(serializers.CharField())
    def get_full_name(self, obj) -> str:
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username
    
    @extend_schema_field(RoleSerializer(many=True))
    def get_roles(self, obj):
        return RoleSerializer(obj.groups.all(), many=True).data
    
    @extend_schema_field(serializers.CharField())
    def get_created_by(self, obj):
        try:
            profile = obj.profile
            if profile.created_by:
                return profile.created_by.username
        except UserProfile.DoesNotExist:
            pass
        return None
    
    @extend_schema_field(serializers.BooleanField())
    def get_is_super_admin(self, obj):
        """Check if user is super admin"""
        try:
            return obj.profile.super_admin
        except UserProfile.DoesNotExist:
            return False

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'User Detail Response',
            value={
                "id": 1,
                "username": "johndoe",
                "email": "john@example.com",
                "first_name": "John",
                "last_name": "Doe",
                "full_name": "John Doe",
                "date_joined": "2025-01-01T12:00:00Z",
                "last_login": "2025-01-15T10:30:00Z",
                "is_active": True,
                "is_staff": False,
                "roles": [
                    {
                        "id": 1,
                        "name": "Property Manager"
                    }
                ],
                "permissions": [
                    "properties.add_property",
                    "properties.change_property"
                ]
            }
        )
    ]
)

class UserDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for individual user data"""
    full_name = serializers.SerializerMethodField()
    roles = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()
    created_by = serializers.SerializerMethodField()
    created_users_count = serializers.SerializerMethodField()
    is_super_admin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'full_name', 'date_joined', 'last_login', 'is_active', 'is_staff',
            'roles', 'permissions', 'created_by', 'created_users_count',
            'is_super_admin'
        ]

    # ... (keep existing methods)

    @extend_schema_field(serializers.BooleanField())
    def get_is_super_admin(self, obj):
        """Check if user is super admin"""
        try:
            return obj.profile.super_admin
        except UserProfile.DoesNotExist:
            return False

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Update Profile Request',
            value={
                "first_name": "Jaylon",
                "last_name": "Dorwart",
                "phone_number": "+1 (555) 123-4567",
                "company": "Bliss Property Management",
                "job_title": "Property Manager",
                "image_url": "https://example.com/profile-images/jaylon.jpg",
                "company_logo_url": "https://example.com/logos/bliss-logo.png"
            }
        )
    ]
)
class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile information"""
    
    # User model fields
    first_name = serializers.CharField(
        max_length=30, 
        required=False, 
        allow_blank=True,
        help_text="User's first name"
    )
    last_name = serializers.CharField(
        max_length=150, 
        required=False, 
        allow_blank=True,
        help_text="User's last name"
    )
    email = serializers.EmailField(
        required=False,
        help_text="User's email address"
    )
    
    # UserProfile model fields
    phone_number = serializers.CharField(
        max_length=20, 
        required=False, 
        allow_blank=True,
        help_text="User's phone number"
    )
    company = serializers.CharField(
        max_length=255, 
        required=False, 
        allow_blank=True,
        help_text="Company name"
    )
    job_title = serializers.CharField(
        max_length=100, 
        required=False, 
        allow_blank=True,
        help_text="Job title/position"
    )
    image_url = serializers.URLField(
        max_length=500, 
        required=False, 
        allow_blank=True,
        help_text="Profile image URL"
    )
    company_logo_url = serializers.URLField(
        max_length=500, 
        required=False, 
        allow_blank=True,
        help_text="Company logo URL"
    )

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email',  # User model fields
            'phone_number', 'company', 'job_title', 'image_url', 'company_logo_url'  # Profile fields
        ]

    def validate_email(self, value):
        """Validate email uniqueness"""
        user = self.instance
        if User.objects.filter(email=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("This email is already in use by another user.")
        return value

    def update(self, instance, validated_data):
        """Update both User and UserProfile fields"""
        
        # Separate User fields from Profile fields
        user_fields = ['first_name', 'last_name', 'email']
        profile_fields = ['phone_number', 'company', 'job_title', 'image_url', 'company_logo_url']
        
        # Update User model fields
        for field in user_fields:
            if field in validated_data:
                setattr(instance, field, validated_data[field])
        instance.save()
        
        # Get or create UserProfile
        profile, created = UserProfile.objects.get_or_create(user=instance)
        
        # Update UserProfile fields
        for field in profile_fields:
            if field in validated_data:
                setattr(profile, field, validated_data[field])
        profile.save()
        
        return instance

class UserProfileDetailSerializer(serializers.ModelSerializer):
    """Serializer for displaying complete user profile information"""
    
    # User fields
    full_name = serializers.SerializerMethodField()
    
    # Profile fields with safe access
    phone_number = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField()
    job_title = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    company_logo_url = serializers.SerializerMethodField()
    super_admin = serializers.SerializerMethodField()
    created_by = serializers.SerializerMethodField()
    roles = serializers.SerializerMethodField()
    property_count = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [
            # User info
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'date_joined', 'last_login', 'is_active',
            
            # Profile info
            'phone_number', 'company', 'job_title', 'image_url', 'company_logo_url',
            'super_admin', 'created_by', 'roles','property_count'
        ]

    @extend_schema_field(serializers.CharField())
    def get_full_name(self, obj) -> str:
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username
    
    @extend_schema_field(serializers.CharField())
    def get_phone_number(self, obj):
        try:
            return obj.profile.phone_number or ""
        except UserProfile.DoesNotExist:
            return ""
    
    @extend_schema_field(serializers.CharField())
    def get_company(self, obj):
        try:
            return obj.profile.company or ""
        except UserProfile.DoesNotExist:
            return ""
    
    @extend_schema_field(serializers.CharField())
    def get_job_title(self, obj):
        try:
            return obj.profile.job_title or ""
        except UserProfile.DoesNotExist:
            return ""
    
    @extend_schema_field(serializers.URLField())
    def get_image_url(self, obj):
        try:
            return obj.profile.image_url or ""
        except UserProfile.DoesNotExist:
            return ""
    
    @extend_schema_field(serializers.URLField())
    def get_company_logo_url(self, obj):
        try:
            return obj.profile.company_logo_url or ""
        except UserProfile.DoesNotExist:
            return ""
    
    @extend_schema_field(serializers.BooleanField())
    def get_super_admin(self, obj):
        try:
            return obj.profile.super_admin
        except UserProfile.DoesNotExist:
            return False
    
    @extend_schema_field(serializers.CharField())
    def get_created_by(self, obj):
        try:
            profile = obj.profile
            if profile.created_by:
                return profile.created_by.username
        except UserProfile.DoesNotExist:
            pass
        return None
    
    @extend_schema_field(serializers.ListField(child=serializers.CharField()))
    def get_roles(self, obj):
        return [group.name for group in obj.groups.all()]
    
    @extend_schema_field(serializers.IntegerField())
    def get_property_count(self, obj):
        try:
            return obj.profile.property_count
        except UserProfile.DoesNotExist:
            return 0

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Change Password Request',
            value={
                "current_password": "oldpassword123",
                "new_password": "newSecurePassword456!",
                "confirm_password": "newSecurePassword456!"
            }
        )
    ]
)
class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing user password"""
    current_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate_current_password(self, value):
        """Validate current password"""
        user = self.context['request'].user
        if not authenticate(username=user.username, password=value):
            raise serializers.ValidationError("Current password is incorrect")
        return value

    def validate_new_password(self, value):
        """Validate new password using Django's password validators"""
        try:
            validate_password(value, self.context['request'].user)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def validate(self, attrs):
        """Cross-field validation"""
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("New passwords do not match")
        
        if attrs['current_password'] == attrs['new_password']:
            raise serializers.ValidationError("New password must be different from current password")
        
        return attrs

    def save(self):
        """Update user password"""
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Update 2FA Settings',
            value={
                "two_factor_enabled": True
            }
        )
    ]
)
class TwoFactorSettingsSerializer(serializers.ModelSerializer):
    """Serializer for 2FA settings"""
    
    class Meta:
        model = UserProfile
        fields = ['two_factor_enabled']

    def update(self, instance, validated_data):
        """Update 2FA setting"""
        instance.two_factor_enabled = validated_data.get('two_factor_enabled', instance.two_factor_enabled)
        instance.save()
        return instance

class LoginSessionSerializer(serializers.ModelSerializer):
    """Serializer for login sessions"""
    session_duration = serializers.SerializerMethodField()
    is_current_session = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = LoginSession
        fields = [
            'id', 'session_key', 'ip_address', 'user_agent', 'device_type',
            'browser', 'operating_system', 'location', 'is_active',
            'login_time', 'last_activity', 'logout_time', 'session_duration',
            'is_current_session'
        ]
        read_only_fields = ['id', 'session_key', 'login_time', 'last_activity']

    @extend_schema_field(serializers.CharField())
    def get_session_duration(self, obj):
        """Get formatted session duration"""
        if obj.logout_time and obj.login_time:
            duration = obj.logout_time - obj.login_time
            hours, remainder = divmod(duration.total_seconds(), 3600)
            minutes, seconds = divmod(remainder, 60)
            return f"{int(hours)}h {int(minutes)}m"
        return "Active"

class SecuritySettingsSerializer(serializers.Serializer):
    """Combined serializer for all security settings"""
    two_factor_enabled = serializers.BooleanField(required=False)
    password_last_changed = serializers.DateTimeField(read_only=True, source='user.last_login')
    active_sessions_count = serializers.SerializerMethodField()
    
    def get_active_sessions_count(self, obj):
        """Get count of active sessions"""
        return LoginSession.objects.filter(user=obj.user, is_active=True).count()

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Enhanced Registration Request',
            value={
                "first_name": "John",
                "last_name": "Doe",
                "email": "john.doe@example.com",
                "company": "Doe Properties LLC",
                "phone_number": "+1 (555) 123-4567",
                "property_count": 5,
                "password": "securePassword123!",
                "confirm_password": "securePassword123!"
            }
        )
    ]
)
class EnhancedRegisterSerializer(serializers.ModelSerializer):
    """Enhanced serializer for user registration with all required fields"""
    
    # User model fields
    first_name = serializers.CharField(
        max_length=30, 
        required=True,
        help_text="User's first name"
    )
    last_name = serializers.CharField(
        max_length=150, 
        required=True,
        help_text="User's last name"
    )
    email = serializers.EmailField(
        required=True,
        help_text="User's email address (will be used as username)"
    )
    password = serializers.CharField(
        write_only=True, 
        required=True,
        min_length=8,
        help_text="Password (minimum 8 characters)"
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        help_text="Confirm password"
    )
    
    # UserProfile fields
    company = serializers.CharField(
        max_length=255,
        required=True,
        allow_blank=False,
        help_text="Company name"
    )
    phone_number = serializers.CharField(
        max_length=20,
        required=True,
        allow_blank=False,
        help_text="Phone number"
    )
    property_count = serializers.IntegerField(
        required=True,
        min_value=0,
        max_value=10000,
        help_text="Number of properties managed"
    )

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email', 'password', 'confirm_password',
            'company', 'phone_number', 'property_count'
        ]

    def validate_email(self, value):
        """Validate email uniqueness"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()  # Store email in lowercase

    def validate_password(self, value):
        """Validate password using Django's password validators"""
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def validate_phone_number(self, value):
        """Basic phone number validation"""
        # Remove spaces and common formatting
        cleaned = value.replace(' ', '').replace('(', '').replace(')', '').replace('-', '').replace('+', '')
        if not cleaned.isdigit() or len(cleaned) < 10:
            raise serializers.ValidationError("Please enter a valid phone number.")
        return value

    def validate_company(self, value):
        """Validate company name"""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Company name must be at least 2 characters long.")
        return value.strip()

    def validate(self, attrs):
        """Cross-field validation"""
        # Check password confirmation
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match."
            })
        
        # Validate name fields
        if len(attrs['first_name'].strip()) < 1:
            raise serializers.ValidationError({
                "first_name": "First name is required."
            })
        
        if len(attrs['last_name'].strip()) < 1:
            raise serializers.ValidationError({
                "last_name": "Last name is required."
            })
        
        return attrs

    def create(self, validated_data):
        """Create user with profile"""
        # Remove fields that don't belong to User model
        profile_data = {
            'company': validated_data.pop('company'),
            'phone_number': validated_data.pop('phone_number'),
            'property_count': validated_data.pop('property_count'),
        }
        validated_data.pop('confirm_password')  # Remove confirm_password
        
        # Generate username from email (before @)
        username = validated_data['email'].split('@')[0]
        
        # Make username unique if it already exists
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        
        # Create user
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            first_name=validated_data['first_name'].strip(),
            last_name=validated_data['last_name'].strip(),
            password=validated_data['password']
        )
        
        # Assign Admin role
        admin_group, created = Group.objects.get_or_create(name='Admin')
        user.groups.add(admin_group)
        
        # Create user profile with super admin privileges and profile data
        UserProfile.objects.create(
            user=user,
            company=profile_data['company'],
            phone_number=profile_data['phone_number'],
            property_count=profile_data['property_count'],
            super_admin=True,  # All new signups are super admins
            created_by=None  # Self-registered users have no creator
        )
        
        return user

class SignupResponseSerializer(serializers.Serializer):
    """Serializer for signup response"""
    success = serializers.BooleanField()
    message = serializers.CharField()
    user = serializers.DictField()

    class UserDataSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        username = serializers.CharField()
        email = serializers.EmailField()
        first_name = serializers.CharField()
        last_name = serializers.CharField()
        full_name = serializers.CharField()
        company = serializers.CharField()
        phone_number = serializers.CharField()
        property_count = serializers.IntegerField()
        roles = serializers.ListField(child=serializers.CharField())

