from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.models import User, Group
from django.db.models import Q
from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from ..permissions import IsSuperAdminOrAdmin,IsSuperAdminOrOwnerOrCreatedBy, IsAdminRole, IsAdminOrOwnerOrCreatedBy
from ..models import UserProfile
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import logout
from django.contrib.sessions.models import Session
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from ..models import LoginSession, UserProfile
from ..serializers import (
    UserListSerializer, UserDetailSerializer, RoleSerializer,  UserProfileUpdateSerializer, UserProfileDetailSerializer,
    ChangePasswordSerializer, TwoFactorSettingsSerializer, 
    LoginSessionSerializer, SecuritySettingsSerializer
)

class UserPagination(PageNumberPagination):
    """Custom pagination for user listing"""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'success': True,
            'message': 'Users retrieved successfully',
            'count': self.page.paginator.count,
            'page_count': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })

class UserListView(generics.ListAPIView):
    """API View to get users (Super Admin = all users, Admin = hierarchical access)"""
    serializer_class = UserListSerializer
    pagination_class = UserPagination
    permission_classes = [IsSuperAdminOrAdmin]

    @extend_schema(
        operation_id='list_users',
        summary="Get All Users",
        description="Super Admins see all users, Admins see only accessible users (own + created).",
        parameters=[
            OpenApiParameter(
                name='is_active',
                type=OpenApiTypes.BOOL,
                location=OpenApiParameter.QUERY,
                description='Filter by active status (true/false)'
            ),
            OpenApiParameter(
                name='search',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Search in username, first name, last name, or email'
            ),
        ],
        responses={200: UserListSerializer(many=True)},
        tags=['User Management']
    )
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        """Return users based on user's privileges"""
        current_user = self.request.user
        
        # Check if user is Super Admin
        try:
            profile = current_user.profile
            if profile.super_admin:
                # SUPER ADMIN SEES ALL USERS
                queryset = User.objects.all().order_by('-date_joined')
            else:
                # Regular Admin - hierarchical access
                accessible_user_ids = [current_user.id]
                created_users = User.objects.filter(
                    profile__created_by=current_user
                ).values_list('id', flat=True)
                accessible_user_ids.extend(created_users)
                queryset = User.objects.filter(id__in=accessible_user_ids).order_by('-date_joined')
        except UserProfile.DoesNotExist:
            # Fallback to Admin role check
            if current_user.groups.filter(name='Admin').exists():
                accessible_user_ids = [current_user.id]
                created_users = User.objects.filter(
                    profile__created_by=current_user
                ).values_list('id', flat=True)
                accessible_user_ids.extend(created_users)
                queryset = User.objects.filter(id__in=accessible_user_ids).order_by('-date_joined')
            else:
                queryset = User.objects.none()
        
        # Apply filters
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')

        search = self.request.query_params.get('search', None)
        if search is not None:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search)
            )

        return queryset

class UserDetailView(generics.RetrieveAPIView):
    """API View to get individual user details"""
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [IsSuperAdminOrAdmin, IsSuperAdminOrOwnerOrCreatedBy]
    lookup_field = 'id'

    @extend_schema(
        operation_id='retrieve_user',
        summary="Get User Details",
        description="Retrieve user details. Super Admins can access any user, Admins have hierarchical access.",
        responses={200: UserDetailSerializer},
        tags=['User Management']
    )
    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response({
                'success': True,
                'message': 'User details retrieved successfully',
                'data': serializer.data
            })
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': 'User not found or access denied',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)

class ActiveUsersView(generics.ListAPIView):
    """API View to get only active users"""
    serializer_class = UserListSerializer
    pagination_class = UserPagination
    permission_classes = [IsSuperAdminOrAdmin]

    @extend_schema(
        operation_id='list_active_users',
        summary="Get Active Users Only",
        description="Get active users. Super Admins see all active users, Admins see accessible active users.",
        responses={200: UserListSerializer(many=True)},
        tags=['User Management']
    )
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        current_user = self.request.user
        
        # Check if user is Super Admin
        try:
            profile = current_user.profile
            if profile.super_admin:
                # SUPER ADMIN SEES ALL ACTIVE USERS
                queryset = User.objects.filter(is_active=True).order_by('-date_joined')
            else:
                # Regular Admin - hierarchical access to active users only
                accessible_user_ids = [current_user.id]
                created_users = User.objects.filter(
                    profile__created_by=current_user
                ).values_list('id', flat=True)
                accessible_user_ids.extend(created_users)
                queryset = User.objects.filter(
                    id__in=accessible_user_ids, 
                    is_active=True
                ).order_by('-date_joined')
        except UserProfile.DoesNotExist:
            # Fallback
            queryset = User.objects.filter(is_active=True).order_by('-date_joined')
            
        return queryset

class RoleListView(generics.ListAPIView):
    """API View to get all available roles"""
    queryset = Group.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        operation_id='list_roles',
        summary="Get All Roles",
        description="Retrieve a list of all available user roles/groups.",
        responses={
            200: RoleSerializer(many=True),
            401: OpenApiTypes.OBJECT,
        },
        tags=['User Management']
    )
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

class UserRoleUpdateView(generics.UpdateAPIView):
    """API View to update user roles"""
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    lookup_field = 'id'

    @extend_schema(
        operation_id='update_user_roles',
        summary="Update User Roles",
        description="Update the roles assigned to a specific user.",
        request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'role_ids': {
                        'type': 'array',
                        'items': {'type': 'integer'},
                        'description': 'Array of role IDs to assign to the user'
                    }
                }
            }
        },
        responses={
            200: UserDetailSerializer,
            404: OpenApiTypes.OBJECT,
            401: OpenApiTypes.OBJECT,
        },
        tags=['User Management']
    )
    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        role_ids = request.data.get('role_ids', [])
        
        # Clear existing roles and add new ones
        user.groups.clear()
        if role_ids:
            roles = Group.objects.filter(id__in=role_ids)
            user.groups.set(roles)
        
        serializer = self.get_serializer(user)
        return Response({
            'success': True,
            'message': 'User roles updated successfully',
            'data': serializer.data
        })

@extend_schema(
    tags=["User Profile"],
    summary="Get current user's profile information",
    description="Retrieve complete profile information for the logged-in user.",
    responses={
        200: UserProfileDetailSerializer,
        401: OpenApiTypes.OBJECT,
    },
)
class CurrentUserProfileView(generics.RetrieveAPIView):
    """Get current user's profile information"""
    serializer_class = UserProfileDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'message': 'User profile retrieved successfully',
            'data': serializer.data
        })

@extend_schema(
    tags=["User Profile"],
    summary="Update current user's profile information",
    description="Update profile information for the logged-in user including personal details, company info, and profile images.",
    request=UserProfileUpdateSerializer,
    responses={
        200: UserProfileDetailSerializer,
        400: OpenApiTypes.OBJECT,
        401: OpenApiTypes.OBJECT,
    },
)
class UpdateUserProfileView(generics.CreateAPIView):
    """Update current user's profile information"""
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def post(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            updated_user = serializer.save()
            
            # Return updated profile data
            response_serializer = UserProfileDetailSerializer(updated_user)
            return Response({
                'success': True,
                'message': 'Profile updated successfully',
                'data': response_serializer.data
            })
        
        return Response({
            'success': False,
            'message': 'Validation error',
            'errors': serializer.errors
        }, status=400)

@extend_schema(
    tags=["User Profile"],
    summary="Upload and update profile image",
    description="Upload a new profile image and update the user's image_url.",
    request={
        'multipart/form-data': {
            'type': 'object',
            'properties': {
                'image_url': {
                    'type': 'string',
                    'format': 'uri',
                    'description': 'URL of the uploaded image'
                }
            }
        }
    },
    responses={
        200: UserProfileDetailSerializer,
        400: OpenApiTypes.OBJECT,
    },
)
class UpdateProfileImageView(generics.CreateAPIView):
    """Update user's profile image"""
    serializer_class = serializers.Serializer  # Simple serializer for single field
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def post(self, request, *args, **kwargs):
        user = self.get_object()
        image_url = request.data.get('image_url')
        
        if not image_url:
            return Response({
                'success': False,
                'message': 'image_url is required'
            }, status=400)
        
        # Get or create user profile
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.image_url = image_url
        profile.save()
        
        # Return updated profile
        response_serializer = UserProfileDetailSerializer(user)
        return Response({
            'success': True,
            'message': 'Profile image updated successfully',
            'data': response_serializer.data
        })

@extend_schema(
    tags=["User Profile"],
    summary="Upload and update company logo",
    description="Upload a new company logo and update the user's company_logo_url.",
    request={
        'multipart/form-data': {
            'type': 'object',
            'properties': {
                'company_logo_url': {
                    'type': 'string',
                    'format': 'uri',
                    'description': 'URL of the uploaded company logo'
                }
            }
        }
    },
    responses={
        200: UserProfileDetailSerializer,
        400: OpenApiTypes.OBJECT,
    },
)
class UpdateCompanyLogoView(generics.CreateAPIView):
    """Update user's company logo"""
    serializer_class = serializers.Serializer  # Simple serializer for single field
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def post(self, request, *args, **kwargs):
        user = self.get_object()
        logo_url = request.data.get('company_logo_url')
        
        if not logo_url:
            return Response({
                'success': False,
                'message': 'company_logo_url is required'
            }, status=400)
        
        # Get or create user profile
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.company_logo_url = logo_url
        profile.save()
        
        # Return updated profile
        response_serializer = UserProfileDetailSerializer(user)
        return Response({
            'success': True,
            'message': 'Company logo updated successfully',
            'data': response_serializer.data
        })

@extend_schema(
    tags=["User Security"],
    summary="Change user password",
    description="Change the password for the currently logged-in user.",
    request=ChangePasswordSerializer,
    responses={
        200: OpenApiTypes.OBJECT,
        400: OpenApiTypes.OBJECT,
    },
)
class ChangePasswordView(generics.UpdateAPIView):
    """Change user password"""
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            
            # Optional: Invalidate all other sessions except current
            current_session_key = request.session.session_key
            if current_session_key:
                # Mark other sessions as inactive
                LoginSession.objects.filter(
                    user=request.user,
                    is_active=True
                ).exclude(session_key=current_session_key).update(is_active=False)
            
            return Response({
                'success': True,
                'message': 'Password changed successfully. Please log in again with your new password.',
            })
        
        return Response({
            'success': False,
            'message': 'Password change failed',
            'errors': serializer.errors
        }, status=400)

@extend_schema(
    tags=["User Security"],
    summary="Get/Update 2FA settings",
    request=TwoFactorSettingsSerializer,
    responses={
        200: TwoFactorSettingsSerializer,
        400: OpenApiTypes.OBJECT,
    },
)
class TwoFactorSettingsView(generics.RetrieveUpdateAPIView):
    """Get and update 2FA settings"""
    serializer_class = TwoFactorSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'data': serializer.data
        })

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': '2FA settings updated successfully',
                'data': serializer.data
            })
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=400)

@extend_schema(
    tags=["User Security"],
    summary="Get user's login sessions",
    description="Get a list of all login sessions for the current user.",
    parameters=[
        OpenApiParameter(
            name='active_only',
            type=OpenApiTypes.BOOL,
            location=OpenApiParameter.QUERY,
            description='Filter to show only active sessions'
        ),
    ],
    responses={200: LoginSessionSerializer(many=True)},
)
class LoginSessionsListView(generics.ListAPIView):
    """Get user's login sessions"""
    serializer_class = LoginSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = LoginSession.objects.filter(user=self.request.user)
        
        # Filter by active sessions only if requested
        active_only = self.request.query_params.get('active_only', '').lower() == 'true'
        if active_only:
            queryset = queryset.filter(is_active=True)
            
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'message': 'Login sessions retrieved successfully',
            'count': queryset.count(),
            'data': serializer.data
        })

@extend_schema(
    tags=["User Security"],
    summary="Terminate a specific login session",
    description="Terminate a specific login session by session ID.",
    responses={
        200: OpenApiTypes.OBJECT,
        404: OpenApiTypes.OBJECT,
    },
)
class TerminateSessionView(generics.DestroyAPIView):
    """Terminate a specific session"""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, session_id, *args, **kwargs):
        try:
            login_session = LoginSession.objects.get(
                id=session_id,
                user=request.user
            )
            
            # Mark session as inactive
            login_session.is_active = False
            login_session.logout_time = timezone.now()
            login_session.save()
            
            # Delete the actual Django session if it exists
            try:
                django_session = Session.objects.get(session_key=login_session.session_key)
                django_session.delete()
            except Session.DoesNotExist:
                pass
            
            return Response({
                'success': True,
                'message': 'Session terminated successfully'
            })
            
        except LoginSession.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Session not found'
            }, status=404)

@extend_schema(
    tags=["User Security"],
    summary="Terminate all other sessions",
    description="Terminate all login sessions except the current one.",
    responses={200: OpenApiTypes.OBJECT},
)
class TerminateAllOtherSessionsView(generics.CreateAPIView):
    """Terminate all other sessions except current"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        current_session_key = request.session.session_key
        
        # Get all other active sessions
        other_sessions = LoginSession.objects.filter(
            user=request.user,
            is_active=True
        )
        
        if current_session_key:
            other_sessions = other_sessions.exclude(session_key=current_session_key)
        
        # Mark them as inactive
        terminated_count = other_sessions.update(
            is_active=False,
            logout_time=timezone.now()
        )
        
        # Delete the Django sessions
        for login_session in other_sessions:
            try:
                django_session = Session.objects.get(session_key=login_session.session_key)
                django_session.delete()
            except Session.DoesNotExist:
                continue
        
        return Response({
            'success': True,
            'message': f'Terminated {terminated_count} other sessions successfully'
        })

@extend_schema(
    tags=["User Security"],
    summary="Get security overview",
    description="Get an overview of user's security settings and active sessions.",
    responses={200: SecuritySettingsSerializer},
)
class SecurityOverviewView(generics.RetrieveAPIView):
    """Get security overview"""
    serializer_class = SecuritySettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'data': serializer.data
        })

