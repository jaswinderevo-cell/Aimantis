# users/urls.py
from django.urls import path
from .views.auth import *
from .views.users import UserListView, UserDetailView, ActiveUsersView, RoleListView, UserRoleUpdateView, CurrentUserProfileView, UpdateUserProfileView, UpdateProfileImageView, UpdateCompanyLogoView, SecurityOverviewView, ChangePasswordView, TwoFactorSettingsView, LoginSessionsListView, TerminateSessionView, TerminateAllOtherSessionsView

urlpatterns = [
    # Authentication endpoints
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot_password"),
    
    # User management endpoints
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:id>/', UserDetailView.as_view(), name='user-detail'),
    path('users/active/', ActiveUsersView.as_view(), name='active-users'),
    
    # Role management endpoints
    path('roles/', RoleListView.as_view(), name='role-list'),
    path('users/<int:id>/roles/', UserRoleUpdateView.as_view(), name='user-roles-update'),
    
    # Profile management endpoints
    path('profile/', CurrentUserProfileView.as_view(), name='current-user-profile'),
    path('profile/update/', UpdateUserProfileView.as_view(), name='update-user-profile'),
    path('profile/image/', UpdateProfileImageView.as_view(), name='update-profile-image'),
    path('profile/company-logo/', UpdateCompanyLogoView.as_view(), name='update-company-logo'),

    path('security/', SecurityOverviewView.as_view(), name='security-overview'),
    path('security/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('security/2fa/', TwoFactorSettingsView.as_view(), name='two-factor-settings'),
    path('security/sessions/', LoginSessionsListView.as_view(), name='login-sessions'),
    path('security/sessions/<int:session_id>/terminate/', TerminateSessionView.as_view(), name='terminate-session'),
    path('security/sessions/terminate-others/', TerminateAllOtherSessionsView.as_view(), name='terminate-other-sessions'),
]