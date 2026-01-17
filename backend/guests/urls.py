from django.urls import path
from .views import GuestViewSet, CheckInView, GetCheckInDetailsView,GetGuestsByBookingUUIDAPIView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'guests', GuestViewSet, basename='guest')

urlpatterns = [
    # Existing guest CRUD endpoints
    *router.urls,
    
    # NEW: Check-in endpoints
    path('check-in/', CheckInView.as_view(), name='check-in'),
    path('check-in/<int:booking_id>/', GetCheckInDetailsView.as_view(), name='get-check-in-details'),
    path("by-booking/<uuid:booking_uid>/",GetGuestsByBookingUUIDAPIView.as_view(), name="guests-by-booking-uuid")
]
