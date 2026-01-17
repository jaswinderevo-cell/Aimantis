from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from django.contrib.auth.models import User
from django.db import IntegrityError
from .models import Structure, StructureUser, Invitation
from .serializers import (
    StructureSerializer, StructureUserSerializer, 
    CreateStructureUserSerializer, AddExistingUsersSerializer,
    StructureUserListSerializer,
    SendInvitationSerializer, InvitationSerializer, AcceptInvitationSerializer, UserWithStructureSerializer
)
from users.models import UserProfile
from django.utils import timezone
from rest_framework.decorators import api_view
from datetime import timedelta
from django.utils import timezone
from structures.utils import send_welcome_email

@extend_schema(
    tags=["structure"],
    summary="List and create structures",
    responses={
        200: StructureSerializer(many=True),
        201: StructureSerializer,
        403: OpenApiResponse(description="Forbidden"),
    },
)
class StructureListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StructureSerializer

    def get_queryset(self):
        # Show only structures owned by the logged-in user
        return Structure.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Let the serializer.create() pick up request.user from context
        serializer.save()


@extend_schema(
    tags=["structure"],
    summary="Retrieve, update, and delete a structure",
    responses={
        200: StructureSerializer,
        204: None,
        403: OpenApiResponse(description="Forbidden"),
    },
)
class StructureRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StructureSerializer

    def get_queryset(self):
        # Restrict access to structures owned by the logged-in user
        return Structure.objects.filter(user=self.request.user)

@extend_schema(
    tags=["structure-users"],
    summary="Get all users from a particular structure",
    responses={
        200: StructureUserListSerializer(many=True),
        404: OpenApiResponse(description="Structure not found"),
    },
)
class StructureUsersListView(generics.ListAPIView):
    """Get all users from a particular structure"""
    serializer_class = StructureUserListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        structure_id = self.kwargs['structure_id']
        return StructureUser.objects.filter(structure_id=structure_id)

    def get(self, request, structure_id, *args, **kwargs):
        # Verify structure exists and user has access
        try:
            structure = Structure.objects.get(id=structure_id)
            # Add permission check here if needed
            # if structure.user != request.user and not request.user.profile.super_admin:
            #     return Response({'error': 'Access denied'}, status=403)
        except Structure.DoesNotExist:
            return Response({'error': 'Structure not found'}, status=404)
        
        return super().list(request, *args, **kwargs)

@extend_schema(
    tags=["structure-users"],
    summary="Create new user for particular structure",
    request=CreateStructureUserSerializer,
    responses={
        201: StructureUserSerializer,
        400: OpenApiResponse(description="Bad request"),
        404: OpenApiResponse(description="Structure or User not found"),
    },
)
class CreateStructureUserView(generics.CreateAPIView):
    """Create user for particular structure"""
    serializer_class = CreateStructureUserSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, structure_id, *args, **kwargs):
        try:
            structure = Structure.objects.get(id=structure_id)
        except Structure.DoesNotExist:
            return Response({'error': 'Structure not found'}, status=404)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user_id = serializer.validated_data['user_id']
        role = serializer.validated_data['role']

        try:
            structure_user = StructureUser.objects.create(
                structure=structure,
                user_id=user_id,
                role=role,
                created_by=request.user
            )
            
            response_serializer = StructureUserSerializer(structure_user)
            return Response({
                'success': True,
                'message': 'User added to structure successfully',
                'data': response_serializer.data
            }, status=201)
            
        except IntegrityError:
            return Response({
                'error': 'User is already added to this structure'
            }, status=400)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

@extend_schema(
    tags=["structure-users"],
    summary="Delete user from particular structure",
    responses={
        200: OpenApiResponse(description="User removed successfully"),
        404: OpenApiResponse(description="Structure or User not found"),
    },
)
class DeleteStructureUserView(generics.DestroyAPIView):
    """Delete user from particular structure"""
    permission_classes = [IsAuthenticated]

    def delete(self, request, structure_id, user_id, *args, **kwargs):
        try:
            structure_user = StructureUser.objects.get(
                structure_id=structure_id,
                user_id=user_id
            )
            structure_user.delete()
            
            return Response({
                'success': True,
                'message': 'User removed from structure successfully'
            }, status=200)
            
        except StructureUser.DoesNotExist:
            return Response({
                'error': 'User not found in this structure'
            }, status=404)

@extend_schema(
    tags=["structure-users"],
    summary="Add multiple existing users to particular structure",
    request=AddExistingUsersSerializer,
    responses={
        201: OpenApiResponse(description="Users added successfully"),
        400: OpenApiResponse(description="Bad request"),
    },
)
class AddExistingUsersToStructureView(generics.CreateAPIView):
    """Add existing users to particular structure"""
    serializer_class = AddExistingUsersSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, structure_id, *args, **kwargs):
        try:
            structure = Structure.objects.get(id=structure_id)
        except Structure.DoesNotExist:
            return Response({'error': 'Structure not found'}, status=404)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user_ids = serializer.validated_data['user_ids']
        role = serializer.validated_data['role']
        
        added_users = []
        skipped_users = []
        
        for user_id in user_ids:
            try:
                structure_user, created = StructureUser.objects.get_or_create(
                    structure=structure,
                    user_id=user_id,
                    defaults={
                        'role': role,
                        'created_by': request.user
                    }
                )
                
                if created:
                    added_users.append(user_id)
                else:
                    skipped_users.append(user_id)
                    
            except User.DoesNotExist:
                skipped_users.append(user_id)
        
        return Response({
            'success': True,
            'message': f'Added {len(added_users)} users to structure',
            'added_users': added_users,
            'skipped_users': skipped_users,
            'total_added': len(added_users)
        }, status=201)

@extend_schema(
    tags=["structure-users"],
    summary="Update user role in structure",
    request={"role": "Admin"},
    responses={
        200: StructureUserSerializer,
        404: OpenApiResponse(description="User not found in structure"),
    },
)
class UpdateStructureUserRoleView(generics.UpdateAPIView):
    """Update user role in particular structure"""
    serializer_class = StructureUserSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, structure_id, user_id, *args, **kwargs):
        try:
            structure_user = StructureUser.objects.get(
                structure_id=structure_id,
                user_id=user_id
            )
        except StructureUser.DoesNotExist:
            return Response({
                'error': 'User not found in this structure'
            }, status=404)

        new_role = request.data.get('role')
        if new_role not in [choice[0] for choice in StructureUser.ROLE_CHOICES]:
            return Response({
                'error': 'Invalid role. Must be Admin, Editor, or Viewer'
            }, status=400)

        structure_user.role = new_role
        structure_user.save()
        
        serializer = self.get_serializer(structure_user)
        return Response({
            'success': True,
            'message': 'User role updated successfully',
            'data': serializer.data
        })

@extend_schema(
    tags=["invitations"],
    summary="Send invitation to user for specific structure",
    request=SendInvitationSerializer,
    responses={
        201: InvitationSerializer,
        400: OpenApiResponse(description="Bad request"),
    },
)
class SendStructureInvitationView(generics.CreateAPIView):
    """Send invitation to join a specific structure"""
    serializer_class = SendInvitationSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, structure_id, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            context={'request': request, 'structure_id': structure_id}
        )
        serializer.is_valid(raise_exception=True)
        invitation = serializer.save()
        
        response_serializer = InvitationSerializer(invitation)
        return Response({
            'success': True,
            'message': 'Invitation sent successfully',
            'data': response_serializer.data
        }, status=201)

@extend_schema(
    tags=["invitations"],
    summary="Send general system invitation (no specific structure)",
    request=SendInvitationSerializer,
    responses={
        201: InvitationSerializer,
        400: OpenApiResponse(description="Bad request"),
    },
)
class SendGeneralInvitationView(generics.CreateAPIView):
    """Send general invitation to join the system"""
    serializer_class = SendInvitationSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            context={'request': request, 'structure_id': None}
        )
        serializer.is_valid(raise_exception=True)
        invitation = serializer.save()
        
        response_serializer = InvitationSerializer(invitation)
        return Response({
            'success': True,
            'message': 'General invitation sent successfully',
            'data': response_serializer.data
        }, status=201)

@extend_schema(
    tags=["invitations"],
    summary="Get invitation details",
    responses={
        200: InvitationSerializer,
        404: OpenApiResponse(description="Invitation not found"),
    },
)
class InvitationDetailView(generics.RetrieveAPIView):
    """Get invitation details by ID"""
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = []  # Allow unauthenticated access for invitation links

    def get(self, request, invitation_id, *args, **kwargs):
        try:
            invitation = Invitation.objects.get(id=invitation_id)
            
            # Check if expired and mark as such
            if invitation.is_expired:
                invitation.expire()
            
            serializer = self.get_serializer(invitation)
            return Response({
                'success': True,
                'data': serializer.data
            })
            
        except Invitation.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Invitation not found'
            }, status=404)

@extend_schema(
    tags=["invitations"],
    summary="Accept invitation and create user account",
    request=AcceptInvitationSerializer,
    responses={
        200: OpenApiResponse(description="Invitation accepted and user created"),
        400: OpenApiResponse(description="Bad request"),
        404: OpenApiResponse(description="Invitation not found"),
    },
)
class AcceptInvitationView(APIView):
    """
    Accept an invitation and create a user account
    
    Validates:
    - Invitation exists
    - Invitation is in pending status
    - Invitation hasn't expired
    - No user account exists with the invitation email
    """
    
    permission_classes = []  # Public endpoint
    
    def post(self, request, invitation_id):
        from django.utils import timezone
        from django.db import transaction
        
        # Get the invitation
        try:
            invitation = Invitation.objects.get(id=invitation_id)
        except Invitation.DoesNotExist:
            return Response(
                {"error": "Invitation not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # ============================================
        # VALIDATION CHECKS
        # ============================================
        
        # 1. Check if invitation is already accepted
        if invitation.status == 'accepted':
            return Response(
                {
                    "error": "This invitation has already been accepted.",
                    "detail": f"User account was created on {invitation.accepted_at.strftime('%B %d, %Y at %I:%M %p') if invitation.accepted_at else 'N/A'}.",
                    "status": "accepted"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 2. Check if invitation is cancelled
        if invitation.status == 'cancelled':
            return Response(
                {
                    "error": "This invitation has been cancelled.",
                    "detail": "Please contact the administrator for a new invitation.",
                    "status": "cancelled"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 3. Check if invitation has expired
        if invitation.status == 'expired' or (invitation.expires_at and invitation.expires_at < timezone.now()):
            # Update status to expired if not already
            if invitation.status != 'expired':
                invitation.status = 'expired'
                invitation.save()
            
            return Response(
                {
                    "error": "This invitation has expired.",
                    "detail": f"Invitation expired on {invitation.expires_at.strftime('%B %d, %Y at %I:%M %p') if invitation.expires_at else 'N/A'}.",
                    "status": "expired"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 4. Check if user with this email already exists
        if User.objects.filter(email=invitation.email).exists():
            return Response(
                {
                    "error": "User account already exists.",
                    "detail": f"An account with email '{invitation.email}' already exists. Please login instead.",
                    "status": "user_exists"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 5. Validate the acceptance data
        serializer = AcceptInvitationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # ============================================
        # CREATE USER ACCOUNT
        # ============================================
        
        try:
            with transaction.atomic():
                # Create user
                user = User.objects.create_user(
                    username=serializer.validated_data['username'],
                    email=invitation.email,
                    first_name=serializer.validated_data.get('first_name', ''),
                    last_name=serializer.validated_data.get('last_name', ''),
                    password=serializer.validated_data['password']
                )
                
                # Create user profile
                UserProfile.objects.create(
                    user=user,
                    created_by=invitation.invited_by,
                    super_admin=False  # Invited users are not super admins by default
                )
                
                # If invitation has a structure, add user to it
                if invitation.structure:
                    StructureUser.objects.create(
                        structure=invitation.structure,
                        user=user,
                        role=invitation.role,
                        created_by=invitation.invited_by
                    )
                
                # Update invitation status
                invitation.status = 'accepted'
                invitation.accepted_at = timezone.now()
                invitation.created_user = user
                invitation.save()
                
                # Send welcome email
                send_welcome_email(
                    user, 
                    invitation.structure, 
                    invitation.get_role_display() if invitation.structure else None
                )
                
                return Response(
                    {
                        "message": "Invitation accepted successfully.",
                        "user": {
                            "id": user.id,
                            "username": user.username,
                            "email": user.email,
                            "first_name": user.first_name,
                            "last_name": user.last_name,
                        },
                        "structure": {
                            "id": invitation.structure.id,
                            "name": invitation.structure.name,
                        } if invitation.structure else None,
                        "role": invitation.get_role_display() if invitation.structure else None,
                    },
                    status=status.HTTP_201_CREATED
                )
                
        except Exception as e:
            return Response(
                {
                    "error": "Failed to create user account.",
                    "detail": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@extend_schema(
    tags=["invitations"],
    summary="List all invitations sent by current user",
    responses={200: InvitationSerializer(many=True)},
)
class MyInvitationsListView(generics.ListAPIView):
    """List invitations sent by current user"""
    serializer_class = InvitationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Invitation.objects.filter(invited_by=self.request.user)

@extend_schema(
    tags=["structure-users"],
    summary="Get all users with their structure IDs",
    description="Returns a flat array of all users across all structures with their structure information",
    responses={
        200: UserWithStructureSerializer(many=True),
    },
    parameters=[
        OpenApiParameter(
            name='structure_id',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description='Filter by specific structure ID',
            required=False,
        ),
        OpenApiParameter(
            name='role',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Filter by role (Admin, Editor, Viewer)',
            required=False,
        ),
    ]
)
class AllStructureUsersView(generics.ListAPIView):
    """Get all users with their structure IDs in a flat array"""
    serializer_class = UserWithStructureSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Get all StructureUser relationships
        queryset = StructureUser.objects.all().select_related('user', 'structure').order_by('-created_at')
        
        # Optional filters
        structure_id = self.request.query_params.get('structure_id', None)
        role = self.request.query_params.get('role', None)
        
        if structure_id:
            queryset = queryset.filter(structure_id=structure_id)
        
        if role:
            queryset = queryset.filter(role=role)
        
        return queryset


@extend_schema(
    tags=["invitations"],
    summary="Delete/Cancel an invitation",
    description="Delete or cancel an invitation. Only the user who sent the invitation can delete it.",
    responses={
        200: OpenApiResponse(description="Invitation deleted successfully"),
        403: OpenApiResponse(description="Forbidden - not authorized to delete this invitation"),
        404: OpenApiResponse(description="Invitation not found"),
    },
)
class DeleteInvitationView(generics.DestroyAPIView):
    """Delete/Cancel an invitation"""
    permission_classes = [IsAuthenticated]
    lookup_field = 'invitation_id'
    
    def get_queryset(self):
        # Only allow deletion of invitations sent by the authenticated user
        return Invitation.objects.filter(invited_by=self.request.user)
    
    def delete(self, request, invitation_id, *args, **kwargs):
        try:
            invitation = Invitation.objects.get(id=invitation_id)
            
            # Check if user is authorized to delete this invitation
            if invitation.invited_by != request.user:
                return Response({
                    'success': False,
                    'message': 'You are not authorized to delete this invitation'
                }, status=403)
            
            # Check if invitation is already accepted
            if invitation.status == 'accepted':
                return Response({
                    'success': False,
                    'message': 'Cannot delete an accepted invitation'
                }, status=400)
            
            # Store invitation details before deletion
            email = invitation.email
            structure_name = invitation.structure.name if invitation.structure else "System"
            
            # Delete the invitation
            invitation.delete()
            
            return Response({
                'success': True,
                'message': f'Invitation to {email} for {structure_name} has been deleted successfully'
            }, status=200)
            
        except Invitation.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Invitation not found'
            }, status=404)

@extend_schema(
    tags=["invitations"],
    summary="Cancel an invitation",
    description="Cancel a pending invitation. Only the user who sent the invitation can cancel it.",
    responses={
        200: InvitationSerializer,
        403: OpenApiResponse(description="Forbidden - not authorized to cancel this invitation"),
        404: OpenApiResponse(description="Invitation not found"),
    },
)
class CancelInvitationView(generics.UpdateAPIView):
    """Cancel a pending invitation"""
    permission_classes = [IsAuthenticated]
    serializer_class = InvitationSerializer
    
    def patch(self, request, invitation_id, *args, **kwargs):
        try:
            invitation = Invitation.objects.get(id=invitation_id)
            
            # Check if user is authorized to cancel this invitation
            if invitation.invited_by != request.user:
                return Response({
                    'success': False,
                    'message': 'You are not authorized to cancel this invitation'
                }, status=403)
            
            # Check if invitation can be cancelled
            if invitation.status == 'accepted':
                return Response({
                    'success': False,
                    'message': 'Cannot cancel an accepted invitation'
                }, status=400)
            
            if invitation.status == 'cancelled':
                return Response({
                    'success': False,
                    'message': 'Invitation is already cancelled'
                }, status=400)
            
            # Cancel the invitation
            invitation.status = 'cancelled'
            invitation.save()
            
            serializer = self.get_serializer(invitation)
            
            return Response({
                'success': True,
                'message': 'Invitation has been cancelled successfully',
                'data': serializer.data
            }, status=200)
            
        except Invitation.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Invitation not found'
            }, status=404)

@extend_schema(
    tags=["invitations"],
    summary="Resend an invitation",
    description="Resend an invitation email to the user. Updates the expiration date to 15 days from now. Only pending or expired invitations can be resent.",
    responses={
        200: InvitationSerializer,
        400: OpenApiResponse(description="Bad request - invitation cannot be resent"),
        403: OpenApiResponse(description="Forbidden - not authorized to resend this invitation"),
        404: OpenApiResponse(description="Invitation not found"),
    },
)
class ResendInvitationView(generics.GenericAPIView):
    """Resend an invitation email"""
    permission_classes = [IsAuthenticated]
    serializer_class = InvitationSerializer
    
    def post(self, request, invitation_id, *args, **kwargs):
        try:
            invitation = Invitation.objects.get(id=invitation_id)
            
            # Check if user is authorized to resend this invitation
            if invitation.invited_by != request.user:
                return Response({
                    'success': False,
                    'message': 'You are not authorized to resend this invitation'
                }, status=403)
            
            # Check if invitation can be resent
            if invitation.status == 'accepted':
                return Response({
                    'success': False,
                    'message': 'Cannot resend an accepted invitation'
                }, status=400)
            
            if invitation.status == 'cancelled':
                return Response({
                    'success': False,
                    'message': 'Cannot resend a cancelled invitation. Please create a new invitation.'
                }, status=400)
            
            # Update invitation status and expiration date
            if invitation.status == 'expired':
                invitation.status = 'pending'
            
            # Extend expiration date by 15 days from now
            invitation.expires_at = timezone.now() + timedelta(days=15)
            invitation.save()
            
            # Import the email function
            from .utils import send_invitation_email
            
            # Resend the invitation email
            email_sent = send_invitation_email(invitation)
            
            if not email_sent:
                return Response({
                    'success': False,
                    'message': 'Invitation updated but failed to send email. Please try again.'
                }, status=500)
            
            # Serialize and return the updated invitation
            serializer = self.get_serializer(invitation)
            
            return Response({
                'success': True,
                'message': f'Invitation resent successfully to {invitation.email}',
                'data': serializer.data
            }, status=200)
            
        except Invitation.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Invitation not found'
            }, status=404)

@extend_schema(
    tags=["invitations"],
    summary="List all invitations sent by any user",
    description="Returns all invitations in the system regardless of who sent them. Includes filtering options.",
    responses={
        200: InvitationSerializer(many=True),
    },
    parameters=[
        OpenApiParameter(
            name='status',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Filter by status (pending, accepted, expired, cancelled)',
            required=False,
        ),
        OpenApiParameter(
            name='structure_id',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description='Filter by structure ID',
            required=False,
        ),
        OpenApiParameter(
            name='email',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Filter by invitee email',
            required=False,
        ),
    ]
)
class AllInvitationsListView(generics.ListAPIView):
    """List all invitations sent by any user with optional filters"""
    serializer_class = InvitationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Start with all invitations
        queryset = Invitation.objects.all().select_related('invited_by', 'structure', 'created_user').order_by('-created_at')
        
        # Optional filters
        status_filter = self.request.query_params.get('status', None)
        structure_id = self.request.query_params.get('structure_id', None)
        email_filter = self.request.query_params.get('email', None)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        if structure_id:
            queryset = queryset.filter(structure_id=structure_id)
        
        if email_filter:
            queryset = queryset.filter(email__icontains=email_filter)
        
        return queryset