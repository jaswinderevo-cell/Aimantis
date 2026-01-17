# guests/serializers.py
from rest_framework import serializers
from .models import Guest
from bookings.models import Booking
from datetime import date


# ============================================
# ORIGINAL GuestSerializer (keep for bookings)
# ============================================
class GuestSerializer(serializers.ModelSerializer):
    """Original Guest serializer used by BookingSerializer"""
    extra_data = serializers.JSONField(required=False)

    class Meta:
        model = Guest
        fields = [
            "id",
            "booking",
            "full_name",
            "is_main_guest",
            "email",
            "phone",
            "nationality",
            "id_number",
            "address",
            "zip_code",
            "country",
            "city",
            "region",
            "language_preference",
            "guest_notes",
            "special_requests",
            "extra_data",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "booking", "created_at", "updated_at"]

    def validate_phone(self, value):
        """Basic phone number validation."""
        if value and not value.replace("+", "").replace(" ", "").isdigit():
            raise serializers.ValidationError("Phone number must contain only digits or '+' sign.")
        return value

    def validate_full_name(self, value):
        """Ensure full_name is not empty or only whitespace."""
        if not value.strip():
            raise serializers.ValidationError("Full name cannot be blank.")
        return value


# ============================================
# NEW Check-In Serializers
# ============================================
class CheckInGuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = [
            "id",
            "full_name",
            "is_main_guest",
            "email",
            "phone",
            "date_of_birth",
            "country_of_birth",
            "gender",
            "document_type",
            "id_number",
            "document_issue_date",
            "document_expiry_date",
            "document_issuing_country",
            "nationality",
            "address",
            "zip_code",
            "country",
            "city",
            "region",
            "language_preference",
            "special_requests",
            "guest_notes",
        ]
        read_only_fields = ["id"]
        extra_kwargs = {
            field: {
                "required": False,
                "allow_null": True,
                "allow_blank": True
            }
            for field in [
                "full_name",
                "email",
                "phone",
                "country_of_birth",
                "gender",
                "document_type",
                "id_number",
                "document_issuing_country",
                "nationality",
                "address",
                "zip_code",
                "country",
                "city",
                "region",
                "language_preference",
                "special_requests",
                "guest_notes",
            ]
        }

    def validate_full_name(self, value):
        # Only normalize when provided
        if value is None:
            return value
        return value.strip()


    def validate_document_expiry_date(self, value):
        """Ensure document is not expired"""
        if value and value < date.today():
            raise serializers.ValidationError("Document has expired.")
        return value
    
    def validate_date_of_birth(self, value):
        """Ensure date of birth is in the past"""
        if value and value >= date.today():
            raise serializers.ValidationError("Date of birth must be in the past.")
        return value


class CheckInSerializer(serializers.Serializer):
    """Main check-in serializer that handles multiple guests"""
    
    booking_id = serializers.IntegerField(required=True, help_text="Booking ID to link guests")
    guests = CheckInGuestSerializer(many=True, required=True, help_text="List of guests (at least one main guest required)")
    
    def validate_booking_id(self, value):
        """Validate that booking exists"""
        try:
            booking = Booking.objects.get(id=value)
        except Booking.DoesNotExist:
            raise serializers.ValidationError(f"Booking with ID {value} does not exist.")
        return value
    
    def validate_guests(self, value):
        """Validate that at least one main guest exists"""
        if not value:
            raise serializers.ValidationError("At least one guest is required.")
        
        # Check if there's at least one main guest
        main_guests = [guest for guest in value if guest.get('is_main_guest', False)]
        if not main_guests:
            raise serializers.ValidationError("At least one main guest is required.")
        
        # Check if there's more than one main guest
        if len(main_guests) > 1:
            raise serializers.ValidationError("Only one main guest is allowed.")
        
        # Validate main guest has all required fields
        # main_guest = main_guests[0]
        # required_fields = [
        #     'full_name', 'date_of_birth', 'country_of_birth', 'gender',
        #     'document_type', 'id_number', 'document_issuing_country', 
        #     'nationality', 'address', 'zip_code', 'country', "city"
        # ]
        
        # missing_fields = [field for field in required_fields if not main_guest.get(field)]
        # if missing_fields:
        #     raise serializers.ValidationError(
        #         f"Main guest is missing required fields: {', '.join(missing_fields)}"
        #     )
        
        return value
    
    def create(self, validated_data):
        """Create or update guests for the booking"""
        booking_id = validated_data['booking_id']
        guests_data = validated_data['guests']
        
        # Get the booking
        booking = Booking.objects.get(id=booking_id)
        
        # Delete existing guests for this booking (if any)
        Guest.objects.filter(booking=booking).delete()
        
        # Create new guests
        created_guests = []
        for guest_data in guests_data:
            guest = Guest.objects.create(
                booking=booking,
                **guest_data
            )
            created_guests.append(guest)
        
        return {
            'booking_id': booking_id,
            'guests': created_guests
        }


class CheckInResponseSerializer(serializers.Serializer):
    """Response serializer for check-in API"""
    
    booking_id = serializers.IntegerField()
    guests = CheckInGuestSerializer(many=True)
    message = serializers.CharField()
