from datetime import date
from django.db.models import Q
from itertools import chain
from operator import attrgetter
from django.db import models
from rest_framework.views import APIView
from rest_framework.response import Response

from bookings.models import Booking
from guests.models import Guest
from properties.models import Property, PropertyType, PropertyTypeBed

class DashboardWidgetsView(APIView):
    def get(self, request):
        today = date.today()

        # Get upcoming check-in events
        upcoming_checkins = Booking.objects.filter(
            check_in_date__gte=today
        ).prefetch_related("guests")

        # Get upcoming check-out events
        upcoming_checkouts = Booking.objects.filter(
            check_out_date__gte=today
        ).prefetch_related("guests")

        combined_events = list(chain(
            [("check_in", b, b.check_in_date) for b in upcoming_checkins],
            [("check_out", b, b.check_out_date) for b in upcoming_checkouts]
        ))

        # Track bookings that already have check-in event added
        added_booking_ids = set()

        upcoming = []
        # Sort combined events by event_date
        for status, booking, event_date in sorted(combined_events, key=lambda x: x[2]):
            # If check-out, only add if no check-in event was added for the same booking
            if status == "check_out" and booking.id in added_booking_ids:
                continue

            main_guest = booking.guests.filter(is_main_guest=True).first()
            guest_name = main_guest.full_name if main_guest else "—"

            platform = getattr(booking, "platform", "") or "Direct"
            platform_lower = platform.lower()
            if "airbnb" in platform_lower:
                platform = "Airbnb"
            elif "booking" in platform_lower:
                platform = "Booking"
            elif "expedia" in platform_lower:
                platform = "Expedia"

            upcoming.append({
                "booking_id": booking.id,
                "status": status,
                "guest_name": guest_name,
                "nights": booking.length_of_stay,
                "channel": platform,
                "total_amount": f"{getattr(booking, 'total_price', 0):.2f}",
                "event_date": event_date.isoformat()
            })

            if status == "check_in":
                added_booking_ids.add(booking.id)

            # Stop when we have 5 events
            if len(upcoming) >= 5:
                break

        checkin_count = Booking.objects.filter(check_in_date=today).count()
        checkout_count = Booking.objects.filter(check_out_date=today).count()

        # --- NEW WIDGETS ---

        # 1. Total guests in structure (currently staying guests)
        current_bookings = Booking.objects.filter(
            check_in_date__lte=today,
            check_out_date__gt=today
        )
        total_guests = Guest.objects.filter(booking__in=current_bookings).count()

        # 2. Total beds (sum up beds of all properties)
        property_types = PropertyType.objects.all().prefetch_related("beds")
        total_beds = sum(
            sum(b.quantity for b in pt.beds.all())
            for pt in property_types
        )

        # 3. Available rooms (available properties for booking today)
        mapped_properties = Property.objects  # or PropertyStatus.MAPPED
        
        # Get all property IDs that have a booking covering today
        reserved_property_ids = Booking.objects.filter(
            check_in_date__lte=today,
            check_out_date__gt=today
        ).values_list('property_id', flat=True)

        # Filter mapped properties not in reserved_property_ids
        available_properties_today = mapped_properties.exclude(id__in=reserved_property_ids)
        available_rooms_count = available_properties_today.count()

        return Response({
            "upcoming_bookings": upcoming,
            "today_checkin_count": checkin_count,
            "today_checkout_count": checkout_count,
            "total_guests_in_structure": total_guests,
            "total_beds": total_beds,
            "available_rooms": available_rooms_count,
            "reserved_properties": reserved_property_ids.count(),
        })
