from rest_framework import serializers
from django.contrib.auth.models import User
from drf_spectacular.utils import extend_schema_serializer, OpenApiExample
from .models import Structure, StructureUser, Invitation
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .utils import send_invitation_email

class StructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Structure
        fields = [
            "id",
            "name",
            "image_url",
            "structure_type",
            "internal_reference_code",
            "status",
            "base_price",
            "occupancy",
            "rating",
            "total_units",
            "street_address",
            "zip_code",
            "country",
            "legal_entity_name",
            "tax_id_vat_number",
            "default_currency",
            "default_language",
            "time_zone",
            "default_check_in_time",
            "default_check_out_time",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            return Structure.objects.create(user=request.user, **validated_data)
        raise serializers.ValidationError("User context is missing.")


    def validate(self, attrs):
        """
        Check-in / Check-out validation.
        """
        return attrs

class StructureUserSerializer(serializers.ModelSerializer):
    """Serializer for structure-user relationships"""
    user_id = serializers.IntegerField(write_only=True)
    user = serializers.SerializerMethodField(read_only=True)
    structure_name = serializers.CharField(source='structure.name', read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = StructureUser
        fields = [
            'id',
            'user_id', 
            'user',
            'structure',
            'structure_name',
            'role',
            'created_at',
            'updated_at',
            'created_by_username'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'structure']

    def get_user(self, obj):
        """Return user details"""
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'email': obj.user.email,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            'full_name': f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
        }

    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        user = User.objects.get(id=user_id)
        request = self.context.get('request')
        
        return StructureUser.objects.create(
            user=user,
            created_by=request.user if request else None,
            **validated_data
        )

    def validate_user_id(self, value):
        """Validate that user exists"""
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        return value

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Create Structure User Request',
            value={
                "user_id": 2,
                "role": "Editor"
            }
        )
    ]
)
class CreateStructureUserSerializer(serializers.ModelSerializer):
    """Serializer for creating new structure-user relationship"""
    user_id = serializers.IntegerField()
    
    class Meta:
        model = StructureUser
        fields = ['user_id', 'role']

    def validate_user_id(self, value):
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        return value

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Add Existing User Request',
            value={
                "user_ids": [1, 2, 3],
                "role": "Viewer"
            }
        )
    ]
)
class AddExistingUsersSerializer(serializers.Serializer):
    """Serializer for adding multiple existing users to structure"""
    user_ids = serializers.ListField(
        child=serializers.IntegerField(),
        help_text="List of user IDs to add"
    )
    role = serializers.ChoiceField(
        choices=StructureUser.ROLE_CHOICES,
        default='Viewer'
    )

    def validate_user_ids(self, value):
        """Validate all user IDs exist"""
        existing_users = User.objects.filter(id__in=value).count()
        if existing_users != len(value):
            raise serializers.ValidationError("Some users not found")
        return value

class StructureUserListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing structure users"""
    user = serializers.SerializerMethodField()
    
    class Meta:
        model = StructureUser
        fields = ['id', 'user', 'role', 'created_at']
    
    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'email': obj.user.email,
            'full_name': f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
        }

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Send Invitation Request',
            value={
                "email": "newuser@example.com",
                "role": "Editor",
                "message": "Welcome to our team! Looking forward to working with you."
            }
        )
    ]
)
class SendInvitationSerializer(serializers.ModelSerializer):
    """Serializer for sending invitations"""
    
    class Meta:
        model = Invitation
        fields = ['email', 'role', 'message']
    
    def create(self, validated_data):
        request = self.context.get('request')
        structure_id = self.context.get('structure_id')
        
        # Get structure if provided
        structure = None
        if structure_id:
            try:
                structure = Structure.objects.get(id=structure_id)
            except Structure.DoesNotExist:
                raise serializers.ValidationError("Structure not found")
        
        # Create invitation
        invitation = Invitation.objects.create(
            structure=structure,
            invited_by=request.user,
            **validated_data
        )
        
        # Send email
        email_sent = send_invitation_email(invitation)
        if not email_sent:
            # Log warning but don't fail the invitation creation
            pass
        
        return invitation

class InvitationSerializer(serializers.ModelSerializer):
    """Full invitation serializer for responses"""
    invited_by_name = serializers.CharField(source='invited_by.username', read_only=True)
    structure_name = serializers.CharField(source='structure.name', read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    days_until_expiry = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Invitation
        fields = [
            'id', 'email', 'structure', 'structure_name', 'role', 'message',
            'status', 'invited_by_name', 'expires_at', 'accepted_at',
            'is_expired', 'days_until_expiry', 'created_at'
        ]
        read_only_fields = ['id', 'status', 'expires_at', 'accepted_at', 'created_at']

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Accept Invitation Request',
            value={
                "username": "johndoe",
                "first_name": "John",
                "last_name": "Doe",
                "password": "securePassword123",
                "confirm_password": "securePassword123"
            }
        )
    ]
)
class AcceptInvitationSerializer(serializers.Serializer):
    """Serializer for accepting invitations"""
    username = serializers.CharField(max_length=150)
    first_name = serializers.CharField(max_length=30, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    password = serializers.CharField(min_length=8, write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return attrs

class UserWithStructureSerializer(serializers.ModelSerializer):
    """Serializer to return users with their structure information"""
    structure_id = serializers.IntegerField(source='structure.id', read_only=True)
    structure_name = serializers.CharField(source='structure.name', read_only=True)
    user = serializers.SerializerMethodField()
    
    class Meta:
        model = StructureUser
        fields = [
            'id', 'structure_id', 'structure_name', 
            'user', 'role', 'created_at'
        ]
    
    def get_user(self, obj):
        """Return user information"""
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'email': obj.user.email,
            'full_name': f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username,
        }
