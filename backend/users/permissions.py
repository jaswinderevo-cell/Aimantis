# users/permissions.py
from rest_framework import permissions
from .models import UserProfile

class IsSuperAdminOrAdmin(permissions.BasePermission):
    """
    Permission class that allows:
    - Super Admins: Full database access
    - Admins: Hierarchical access (own data + created users)
    """
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
            
        # Check if user has Super Admin privileges
        try:
            profile = request.user.profile
            if profile.super_admin:
                return True  # FULL ACCESS FOR SUPER ADMINS
        except UserProfile.DoesNotExist:
            pass
            
        # Fall back to regular Admin role check
        return request.user.groups.filter(name='Admin').exists()

class IsSuperAdminOrOwnerOrCreatedBy(permissions.BasePermission):
    """
    Object-level permission that allows:
    - Super Admins: Access to ANY object
    - Admins: Access to own objects and objects of users they created
    """

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
            
        # Super Admin has access to EVERYTHING
        try:
            profile = request.user.profile
            if profile.super_admin:
                return True  # FULL ACCESS TO ALL OBJECTS
        except UserProfile.DoesNotExist:
            pass

        # Regular Admin hierarchical permissions
        if request.user.groups.filter(name='Admin').exists():
            # If accessing user data
            if hasattr(obj, 'username'):  # User object
                # Can access own data
                if obj == request.user:
                    return True
                # Can access data of users they created
                try:
                    target_profile = obj.profile
                    if target_profile.created_by == request.user:
                        return True
                except UserProfile.DoesNotExist:
                    pass
            
            # For other models, check ownership
            if hasattr(obj, 'created_by'):
                return obj.created_by == request.user
            if hasattr(obj, 'user'):
                return obj.user == request.user or self._can_access_user_data(request.user, obj.user)
                
        return False

    def _can_access_user_data(self, current_user, target_user):
        """Check if current_user can access target_user's data"""
        try:
            profile = target_user.profile
            return profile.created_by == current_user
        except UserProfile.DoesNotExist:
            return False

class IsAdminOrOwnerOrCreatedBy(permissions.BasePermission):
    """
    Custom permission to allow:
    - Admins can access everything
    - Users can access their own data
    - Users can access data of users they created
    """

    def has_object_permission(self, request, view, obj):
        # Admin users have full access
        if request.user.groups.filter(name='Admin').exists():
            # If accessing user data
            if hasattr(obj, 'username'):  # User object
                # Can access own data
                if obj == request.user:
                    return True
                # Can access data of users they created
                try:
                    profile = obj.profile
                    if profile.created_by == request.user:
                        return True
                except UserProfile.DoesNotExist:
                    pass
            
            # For other models, check if the object belongs to the user
            # or was created by a user that this user created
            if hasattr(obj, 'created_by'):
                return obj.created_by == request.user
            if hasattr(obj, 'user'):
                return obj.user == request.user or self._can_access_user_data(request.user, obj.user)
                
        return False

    def _can_access_user_data(self, current_user, target_user):
        """Check if current_user can access target_user's data"""
        try:
            profile = target_user.profile
            return profile.created_by == current_user
        except UserProfile.DoesNotExist:
            return False

class IsAdminRole(permissions.BasePermission):
    """
    Permission class to check if user has Admin role
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.groups.filter(name='Admin').exists()
