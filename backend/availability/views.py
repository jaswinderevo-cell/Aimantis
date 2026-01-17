from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import BlockedPeriod
from .serializers import BlockedPeriodSerializer
from bookings.models import Booking


class BlockedPeriodCreateView(generics.CreateAPIView):
    """
    Create a blocked period.
    Includes validation:
    - Cannot overlap existing blocked periods
    - Cannot overlap bookings
    """
    queryset = BlockedPeriod.objects.all()
    serializer_class = BlockedPeriodSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)
        

class BlockedPeriodRetrieveView(generics.RetrieveAPIView):
    """
    GET → Retrieve single blocked period by ID
    """
    queryset = BlockedPeriod.objects.all()
    serializer_class = BlockedPeriodSerializer
    permission_classes = [IsAuthenticated]


class BlockedPeriodListView(generics.ListAPIView):
    """
    List all blocked periods for filtering on the calendar.
    """
    queryset = BlockedPeriod.objects.all().order_by("-start_date")
    serializer_class = BlockedPeriodSerializer
    permission_classes = [IsAuthenticated]


class BlockedPeriodDetailView(generics.DestroyAPIView):
    """
    DELETE → Unblock dates
    Simple deletion (Option A).
    """
    queryset = BlockedPeriod.objects.all()
    serializer_class = BlockedPeriodSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        instance.delete()


class BlockedPeriodUpdateView(generics.UpdateAPIView):
    """
    UPDATE → Edit blocked dates or other fields.
    Supports PUT & PATCH.
    """
    queryset = BlockedPeriod.objects.all()
    serializer_class = BlockedPeriodSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
