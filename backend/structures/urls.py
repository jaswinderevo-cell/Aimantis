from django.urls import path
from .views import *
from .channel_views import (
    ChannelSettingsDetailView, ChannelSettingsUpdateView, ChannelSettingsListView
)

urlpatterns = [
    # Existing structure URLs
    path("", StructureListCreateView.as_view(), name="structure-list-create"),
    path("<int:pk>/", StructureRetrieveUpdateDestroyView.as_view(), name="structure-detail"),
    # NEW: All structures with users
    path("users/", AllStructureUsersView.as_view(), name="all-structure-users"),

    # Structure-User Management URLs (existing)
    path("<int:structure_id>/users/", StructureUsersListView.as_view(), name="structure-users-list"),
    path("<int:structure_id>/users/create/", CreateStructureUserView.as_view(), name="structure-user-create"),
    path("<int:structure_id>/users/add-existing/", AddExistingUsersToStructureView.as_view(), name="structure-users-add-existing"),
    path("<int:structure_id>/users/<int:user_id>/", DeleteStructureUserView.as_view(), name="structure-user-delete"),
    path("<int:structure_id>/users/<int:user_id>/role/", UpdateStructureUserRoleView.as_view(), name="structure-user-role-update"),
    
    # NEW: Invitation URLs
    path("<int:structure_id>/invite/", SendStructureInvitationView.as_view(), name="structure-invite"),
    path("invite/", SendGeneralInvitationView.as_view(), name="general-invite"),
    path("invitations/<uuid:invitation_id>/", InvitationDetailView.as_view(), name="invitation-detail"),
    path("invitations/<uuid:invitation_id>/accept/", AcceptInvitationView.as_view(), name="accept-invitation"),
    path("invitations/<uuid:invitation_id>/delete/", DeleteInvitationView.as_view(), name="delete-invitation"), 
    path("invitations/<uuid:invitation_id>/resend/", ResendInvitationView.as_view(), name="resend-invitation"),
    path("invitations/<uuid:invitation_id>/cancel/", CancelInvitationView.as_view(), name="cancel-invitation"),  # NEW

    path("invitations/my/", MyInvitationsListView.as_view(), name="my-invitations"),
    path("invitations/all", AllInvitationsListView.as_view(), name="all-invitations"),

    path("channel-settings/", ChannelSettingsListView.as_view(), name="channel-settings-list"),
    path("<int:structure_id>/channel-settings/", ChannelSettingsDetailView.as_view(), name="channel-settings-detail"),
    path("<int:structure_id>/channel-settings/update/", ChannelSettingsUpdateView.as_view(), name="channel-settings-update"),
]