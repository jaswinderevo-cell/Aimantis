# bookings/views.py
from datetime import timedelta, datetime
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import (
    extend_schema,
    OpenApiResponse,
    OpenApiParameter,
    OpenApiExample,
)
from .models import Booking
from .serializers import BookingSerializer
from rates.models import Rate
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from properties.models import Property
from django.db.models import Q
from guests.models import Guest
from django.db import transaction
from django.shortcuts import get_object_or_404


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().select_related("property", "structure").prefetch_related("guests")
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    # Filtering & search
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = [
        "property__id",
        "check_in_date",
        "check_out_date",
        "guests__id",
    ]
    search_fields = ["guests__full_name", "id"]

    def perform_create(self, serializer):
        booking = serializer.save()

        # Update related rate records when booking is created
        start_date = booking.check_in_date
        end_date = booking.check_out_date
        current_date = start_date
        while current_date < end_date:
            Rate.objects.update_or_create(
                property=booking.property,
                date=current_date,
                defaults={
                    "base_price": booking.base_price,
                    "is_booked": True,
                    "booking_ref": booking,
                },
            )
            current_date += timedelta(days=1)
        return booking

    def perform_update(self, serializer):
        booking = serializer.save()
        # Re-sync price if property or date changed
        rate_qs = Rate.objects.filter(property=booking.property, date=booking.check_in_date)
        if rate_qs.exists():
            booking.base_price = rate_qs.first().base_price
            booking.save()

    @extend_schema(
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "split_date": {
                        "type": "string",
                        "format": "date",
                        "example": "2025-11-04"
                    },
                    "new_room_id": {
                        "type": "integer",
                        "example": 23
                    }
                }
            }
        },
        examples=[
            OpenApiExample(
                'Split Booking Example',
                value={"split_date": "2025-11-04", "new_room_id": 23}
            )
        ]
    )
    @action(detail=True, methods=['post'], url_path='split')
    def split_booking(self, request, pk=None):
        booking = self.get_object()
        split_date_raw = request.data.get('split_date')
        new_room_id = request.data.get('new_room_id')
        booking_checking_out = booking.check_out_date

        try:
            split_date = datetime.strptime(split_date_raw, "%Y-%m-%d").date()
        except Exception:
            return Response(
                {'detail': 'Invalid split_date format. Use YYYY-MM-DD.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not (booking.check_in_date < split_date < booking_checking_out):
            return Response(
                {'detail': 'Split date must be within original date range.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Determine target property for the new booking
        if new_room_id:
            new_property = Property.objects.get(id=new_room_id)
        else:
            new_property = booking.property

        original_checkout = booking.check_out_date
        new_check_in = split_date
        new_check_out = original_checkout

        # Validate overlap BEFORE persisting any changes
        overlap_exists = Booking.objects.filter(
            property=new_property,
            check_in_date__lt=new_check_out,
            check_out_date__gt=new_check_in
        ).exclude(id=booking.id).exists()

        if overlap_exists:
            return Response(
                {"detail": "This property is already booked for the selected dates."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Build data for the new booking (use original checkout stored above)
        new_data = {
            "structure": new_property.structure.id,
            "property_type": new_property.property_type.id,
            "property": new_property.id,
            "check_in_date": split_date,
            "check_out_date": original_checkout,
            "length_of_stay": (original_checkout - split_date).days,
            "adults_count": booking.adults_count,
            "children_count": booking.children_count,
            "special_requests": booking.special_requests,
            "base_price": booking.base_price,
            "cleaning_fee": booking.cleaning_fee,
            "other_extra_fees": booking.other_extra_fees,
            "city_tax": booking.city_tax,
            "subtotal": booking.subtotal,
            "total_price": booking.total_price,
            "payment_method": booking.payment_method,
            "payment_status": booking.payment_status,
            "platform": booking.platform,
            "platform_reservation_id": booking.platform_reservation_id,
            "due_at_property": booking.due_at_property,
            "external_reference": booking.external_reference,
            "invoice_info": booking.invoice_info,
        }

        with transaction.atomic():
            # Update original booking checkout only after validation
            booking.check_out_date = split_date
            booking.save()

            # Create the new booking
            serializer = BookingSerializer(data=new_data)
            serializer.is_valid(raise_exception=True)
            new_booking = serializer.save()

            # ---- COPY guests so both bookings have guests ----
            # Build list of non-FK, non-auto fields to copy safely
            guest_fields = [
                f.name for f in Guest._meta.fields
                if not f.auto_created and f.name not in ('id', 'booking')
            ]

            for guest in booking.guests.all():
                guest_data = {f: getattr(guest, f) for f in guest_fields}
                # Adjust guest_data here if needed to avoid unique constraint violations
                Guest.objects.create(booking=new_booking, **guest_data)

            # Refresh instances so relations are accurate for serialization
            booking.refresh_from_db()
            new_booking.refresh_from_db()

        return Response({
            'original_booking': BookingSerializer(booking).data,
            'new_booking': BookingSerializer(new_booking).data
        }, status=status.HTTP_201_CREATED)
    
    @extend_schema(
        tags=["Guest Check-In Forms"],
        summary="Get booking by UUID",
        description="Fetch booking details using public booking UUID",
        parameters=[
            OpenApiParameter(
                name="uid",
                type=str,
                location=OpenApiParameter.PATH,
                description="Booking UUID"
            )
        ]
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="by-uid/(?P<uid>[0-9a-fA-F-]+)",
        permission_classes=[AllowAny],  # guest-facing
    )
    def get_by_uid(self, request, uid=None):
        booking = get_object_or_404(
            Booking.objects.select_related(
                "property", "structure"
            ).prefetch_related("guests"),
            uid=uid
        )

        serializer = BookingSerializer(booking)
        return Response(serializer.data)