# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import logout
from users.serializers import (
    RegisterSerializer,
    UserSerializer,
    EmailLoginSerializer,
    EnhancedRegisterSerializer,
    SignupResponseSerializer,
    UserProfileDetailSerializer,
)
from django.contrib.auth.forms import PasswordResetForm
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import generics, status, permissions
from django.contrib.auth import login
from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiResponse
from ..models import LoginSession
import user_agents
import uuid
from django.db import transaction

@extend_schema(
    request=EnhancedRegisterSerializer,
    responses={201: UserSerializer},
    tags=["Authentication"],
    summary="Sign up new user",
)
class SignupView(generics.CreateAPIView):
    """Enhanced user registration with complete profile data"""
    serializer_class = EnhancedRegisterSerializer

    @extend_schema(
        tags=["Authentication"],
        summary="Create new user account",
        description="Register a new user with complete profile information including company details and property count.",
        request=EnhancedRegisterSerializer,
        responses={
            201: SignupResponseSerializer,
            400: OpenApiResponse(description="Validation errors"),
        },
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
            with transaction.atomic():  # Ensure atomic transaction
                if serializer.is_valid():
                    user = serializer.save()
                    
                    # Track signup session (similar to login)
                    self.track_signup_session(request, user)
                    
                    # Prepare response data
                    user_data = {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "full_name": f"{user.first_name} {user.last_name}".strip(),
                        "company": user.profile.company,
                        "phone_number": user.profile.phone_number,
                        "property_count": user.profile.property_count,
                        "roles": [group.name for group in user.groups.all()]
                    }
                    
                    return Response({
                        "success": True,
                        "message": "Account created successfully! You can now log in with your credentials.",
                        "user": user_data
                    }, status=status.HTTP_201_CREATED)
                else:
                    return Response({
                        "success": False,
                        "message": "Account creation failed",
                        "errors": serializer.errors
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
        except Exception as e:
            return Response({
                "success": False,
                "message": "Account creation failed due to server error",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def track_signup_session(self, request, user):
        """Track signup as initial session"""
        try:
            # Get client information
            user_agent_string = request.META.get('HTTP_USER_AGENT', '')
            user_agent = user_agents.parse(user_agent_string)
            ip_address = self.get_client_ip(request)
            
            # Generate session key for signup tracking
            session_key = f"signup_{user.id}_{timezone.now().timestamp()}_{uuid.uuid4().hex[:8]}"
            
            # Create initial session record
            LoginSession.objects.create(
                user=user,
                session_key=session_key,
                ip_address=ip_address,
                user_agent=user_agent_string,
                device_type=self.get_device_type(user_agent),
                browser=f"{user_agent.browser.family} {user_agent.browser.version_string}",
                operating_system=f"{user_agent.os.family} {user_agent.os.version_string}",
                location=self.get_location(ip_address),
                is_active=False,  # Signup session, not active login
            )
        except Exception as e:
            # Don't fail signup if session tracking fails
            print(f"Signup session tracking failed: {e}")

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
        if ip_address.startswith('192.168.') or ip_address.startswith('10.') or ip_address.startswith('127.'):
            return "Local Network"
        return "Unknown Location"

@extend_schema(
    tags=["auth"],
    summary="JWT login",
    description="Use username and password to get JWT access and refresh tokens",
    request={
        "application/json": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "string",
                    "example": "admin@aimantis.com",  # 👈 Example value
                },
                "password": {
                    "type": "string",
                    "example": "Admin@1927",  # 👈 Example value
                },
            },
            "required": ["email", "password"],
        }
    },
    responses={
        200: {
            "type": "object",
            "properties": {"refresh": {"type": "string"}, "access": {"type": "string"}},
        }
    },
)
class LoginView(TokenObtainPairView):
    """
    User login with email and password
    """
    serializer_class = EmailLoginSerializer

    @extend_schema(
        tags=["Authentication"],
        summary="User login",
        description="Login with email and password to get JWT tokens",
        responses={
            200: OpenApiResponse(description="Login successful"),
            400: OpenApiResponse(description="Invalid credentials"),
        },
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            
            # Get the authenticated user from serializer
            user = serializer.user if hasattr(serializer, 'user') else None
            if not user:
                # Try to get user from validated data
                email = serializer.validated_data.get('email') or request.data.get('email')
                if email:
                    from django.contrib.auth.models import User
                    try:
                        user = User.objects.get(email=email)
                    except User.DoesNotExist:
                        pass
            
            # Create JWT response
            response_data = serializer.validated_data

            # If we have a user, replace the minimal user object with a full profile
            if user:
                try:
                    full_user = UserProfileDetailSerializer(user, context={"request": request}).data
                    # ensure tokens remain
                    response_data["user"] = full_user
                except Exception:
                    # fallback to minimal user provided by the token serializer
                    pass

                # Track login session if user found
                self.track_login_session(request, user)

            return Response({
                "success": True,
                "message": "Login successful",
                "data": response_data,
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                "success": False,
                "message": "Were sorry, we couldn't log you in with those credentials. Please try again.",
                "errors": serializer.errors if hasattr(serializer, 'errors') else str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def track_login_session(self, request, user):
        """Track login session for JWT authentication"""
        try:
            # Get client information
            user_agent_string = request.META.get('HTTP_USER_AGENT', '')
            user_agent = user_agents.parse(user_agent_string)
            ip_address = self.get_client_ip(request)
            
            # Generate a unique session key for JWT (since Django session isn't used)
            session_key = f"jwt_{user.id}_{timezone.now().timestamp()}_{uuid.uuid4().hex[:8]}"
            
            # Create login session record
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
            print(f"Failed to track login session: {e}")

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
        # Implement geolocation service if needed
        # For now, return a placeholder
        if ip_address.startswith('192.168.') or ip_address.startswith('10.') or ip_address.startswith('127.'):
            return "Local Network"
        return "Unknown Location"

@extend_schema(
    tags=["auth"],
    summary="Logout user",
    request=None,
    responses={200: {"type": "object", "properties": {"message": {"type": "string"}}}},
)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Add this for JWT
    
    @extend_schema(
        tags=["Authentication"],
        summary="User logout",
        description="Logout user and invalidate session",
        responses={200: OpenApiResponse(description="Logout successful")},
    )
    def post(self, request):
        # Track logout in LoginSession if user is authenticated
        if hasattr(request, 'user') and request.user.is_authenticated:
            from ..models import LoginSession  # Import here to avoid circular imports
            
            # Mark latest active session as logged out
            LoginSession.objects.filter(
                user=request.user,
                is_active=True
            ).order_by('-login_time').update(
                is_active=False,
                logout_time=timezone.now()
            )
        
        # Your original logout code
        logout(request)
        return Response(
            {"message": "Logged out successfully"}, 
            status=status.HTTP_200_OK
        )


@extend_schema(
    tags=["Authentication"],
    summary="Forgot password",
    description="Send a password reset email to the user",
    request={
        "application/json": {
            "type": "object",
            "properties": {"email": {"type": "string"}},
            "required": ["email"],
        }
    },
    responses={
        200: {"type": "object", "properties": {"message": {"type": "string"}}},
        400: {"type": "object", "properties": {"error": {"type": "string"}}},
    },
)
class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Check if an account exists with the provided email
        if not User.objects.filter(email=email).exists():
            return Response(
                {"error": "No account found with this email"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Logic to send password reset email goes here
        # For example, using Django's PasswordResetForm:
        form = PasswordResetForm(data={"email": email})
        if form.is_valid():
            form.save(
                request=request,
                use_https=True,
                email_template_name="registration/password_reset_email.html",
                from_email=settings.DEFAULT_FROM_EMAIL,
            )
            return Response(
                {"message": "Password reset email sent successfully"},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"error": "Invalid email address"}, status=status.HTTP_400_BAD_REQUEST
        )
