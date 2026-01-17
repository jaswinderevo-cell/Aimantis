from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .models import ChannelSettings
from .channel_serializers import ChannelSettingsSerializer, ChannelSettingsSummarySerializer

@extend_schema(
    tags=["Channel Settings"],
    summary="Get or create channel settings for structure",
    description="Retrieve existing channel settings for a structure or create default settings if none exist.",
    responses={
        200: ChannelSettingsSerializer,
        201: ChannelSettingsSerializer,
    },
)
class ChannelSettingsDetailView(generics.RetrieveAPIView):
    """Get channel settings for a structure"""
    permission_classes = [IsAuthenticated]
    serializer_class = ChannelSettingsSerializer
    lookup_field = 'structure_id'

    def get_object(self):
        structure_id = self.kwargs['structure_id']
        
        # Get or create channel settings for the structure
        channel_settings, created = ChannelSettings.objects.get_or_create(
            structure_id=structure_id,
            defaults={
                'created_by': self.request.user,
                'default_booking_type': 'relative',
                'default_booking_value': 6,
                'booking_percentage': 0,
                'airbnb_percentage': 0,
                'expedia_percentage': 0,
            }
        )
        
        return channel_settings

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'message': 'Channel settings retrieved successfully',
            'data': serializer.data
        })

@extend_schema(
    tags=["Channel Settings"],
    summary="Update channel settings for structure",
    description="Update channel settings including availability and price settings for a structure.",
    request=ChannelSettingsSerializer,
    responses={
        200: ChannelSettingsSerializer,
        400: OpenApiResponse(description="Validation errors"),
    },
)
class ChannelSettingsUpdateView(generics.UpdateAPIView):
    """Update channel settings for a structure"""
    permission_classes = [IsAuthenticated]
    serializer_class = ChannelSettingsSerializer
    lookup_field = 'structure_id'

    def get_object(self):
        structure_id = self.kwargs['structure_id']
        
        # Get or create channel settings for the structure
        channel_settings, created = ChannelSettings.objects.get_or_create(
            structure_id=structure_id,
            defaults={
                'created_by': self.request.user,
                'default_booking_type': 'relative',
                'default_booking_value': 6,
                'booking_percentage': 0,
                'airbnb_percentage': 0,
                'expedia_percentage': 0,
            }
        )
        
        return channel_settings

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Channel settings updated successfully',
                'data': serializer.data
            })
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    tags=["Channel Settings"],
    summary="List all channel settings",
    description="Get a list of all channel settings with summary information.",
    responses={200: ChannelSettingsSummarySerializer(many=True)},
)
class ChannelSettingsListView(generics.ListAPIView):
    """List all channel settings"""
    permission_classes = [IsAuthenticated]
    serializer_class = ChannelSettingsSummarySerializer
    queryset = ChannelSettings.objects.select_related('structure').all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'message': 'Channel settings list retrieved successfully',
            'count': queryset.count(),
            'data': serializer.data
        })