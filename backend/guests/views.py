# guests/views.py
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample
from .models import Guest
from .serializers import GuestSerializer, CheckInSerializer, CheckInResponseSerializer, CheckInGuestSerializer
from django.shortcuts import get_object_or_404
from bookings.models import Booking


# ============================================
# ORIGINAL GuestViewSet (keep for CRUD)
# ============================================
class GuestViewSet(viewsets.ModelViewSet):
    """
    CRUD API for Guests
    """
    queryset = Guest.objects.all().order_by("-created_at")
    serializer_class = GuestSerializer
    permission_classes = [IsAuthenticated]


# ============================================
# NEW Check-In Views
# ============================================
@extend_schema(
    tags=["Check-In"],
    summary="Check-in form submission",
    description="Submit check-in form with guest details. Requires at least one main guest. All guests will be linked to the specified booking.",
    request=CheckInSerializer,
    responses={
        201: OpenApiResponse(
            response=CheckInResponseSerializer,
            description="Check-in successful"
        ),
        400: OpenApiResponse(description="Validation error"),
        404: OpenApiResponse(description="Booking not found"),
    },
    examples=[
        OpenApiExample(
            name="Check-in with main guest and additional guest",
            value={
                "booking_id": 1,
                "guests": [
                    {
                        "full_name": "John Doe",
                        "is_main_guest": True,
                        "email": "john.doe@example.com",
                        "phone": "+1234567890",
                        "date_of_birth": "1990-05-15",
                        "country_of_birth": "United States",
                        "gender": "male",
                        "document_type": "passport",
                        "document_number": "P123456789",
                        "document_issue_date": "2020-01-01",
                        "document_expiry_date": "2030-01-01",
                        "document_issuing_country": "United States",
                        "nationality": "American",
                        "address": "123 Main St",
                        "zip_code": "12345",
                        "country": "United States",
                        "city": "New York",
                        "region": "Northeast",
                        "language_preference": "English",
                        "special_requests": "Late check-out if possible"
                    },
                    {
                        "full_name": "Jane Doe",
                        "is_main_guest": False,
                        "email": "jane.doe@example.com",
                        "phone": "+1234567891",
                        "date_of_birth": "1992-08-20",
                        "country_of_birth": "United States",
                        "gender": "female",
                        "document_type": "passport",
                        "document_number": "P987654321",
                        "document_issue_date": "2021-03-15",
                        "document_expiry_date": "2031-03-15",
                        "document_issuing_country": "United States",
                        "nationality": "American",
                        "address": "123 Main St",
                        "zip_code": "12345",
                        "country": "United States",
                        "city": "New York",
                        "region": "Northeast"
                    }
                ]
            },
            request_only=True,
        ),
    ],
)
class CheckInView(APIView):
    """
    API endpoint for hotel check-in form submission.
    
    - Links guests to a booking
    - Requires at least one main guest with complete information
    - Replaces any existing guest records for the booking
    """
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = CheckInSerializer(data=request.data)
        
        if serializer.is_valid():
            result = serializer.save()
            
            response_data = {
                'booking_id': result['booking_id'],
                'guests': result['guests'],
                'message': f"Check-in successful. {len(result['guests'])} guest(s) registered."
            }
            
            response_serializer = CheckInResponseSerializer(response_data)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=["Check-In"],
    summary="Get check-in details for a booking",
    description="Retrieve all guests registered for a specific booking",
    responses={
        200: CheckInGuestSerializer(many=True),
        404: OpenApiResponse(description="Booking not found or no guests registered"),
    },
)
class GetCheckInDetailsView(APIView):
    """
    Get check-in details for a booking
    """
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, booking_id):
        guests = Guest.objects.filter(booking_id=booking_id).order_by('-is_main_guest', 'created_at')
        
        if not guests.exists():
            return Response(
                {"error": "No guests found for this booking"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = CheckInGuestSerializer(guests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@extend_schema(
    tags=["Check-In"],
    summary="Get guests by booking UUID",
    description="Returns all guests with extra check-in fields for a booking"
)
class GetGuestsByBookingUUIDAPIView(APIView):
    permission_classes = [AllowAny]  # guest-facing

    def get(self, request, booking_uid):
        booking = get_object_or_404(
            Booking.objects.prefetch_related("guests"),
            uid=booking_uid
        )

        serializer = GuestSerializer(booking.guests.all(), many=True)
        return Response({
            "booking_uid": str(booking.uid),
            "guests": serializer.data
        })