# rates/signals.py
from datetime import timedelta
from django.db.models.signals import post_save, pre_delete, post_delete
from django.dispatch import receiver
from bookings.models import Booking
from .models import Rate


def get_dates_in_range(start_date, end_date):
    """Return a list of dates between start and end (inclusive)."""
    delta = end_date - start_date
    return [start_date + timedelta(days=i) for i in range(delta.days)]


@receiver(post_save, sender=Booking)
def create_or_update_rates_for_booking(sender, instance, created, **kwargs):
    """
    When a booking is created or updated:
    - Mark rates as booked for the booked dates
    - Set the rate price to match booking base_price
    """
    if not instance.property:
        return  # Skip if booking has no property

    dates = get_dates_in_range(instance.check_in_date, instance.check_out_date)
    for dt in dates:
        rate, _ = Rate.objects.update_or_create(
            property=instance.property,
            date=dt,
            defaults={
                "base_price": float(instance.base_price or 0),
                "min_nights": instance.length_of_stay,
                "booking_ref": instance,
                "is_booked": True,
                # Optional: sync OTA prices if needed
                "booking": float(instance.base_price or 0),
                "airbnb": float(instance.base_price or 0),
                "experia": float(instance.base_price or 0),
            },
        )


@receiver(pre_delete, sender=Booking)
def remove_rates_for_booking(sender, instance, **kwargs):
    """
    When a booking is deleted, clear the booking_ref and unbook the rates.
    """
    if not instance.property:
        return

    rates = Rate.objects.filter(booking_ref=instance)
    for rate in rates:
        rate.booking_ref = None
        rate.is_booked = False
        rate.save()


@receiver(post_save, sender=Rate)
def update_booking_from_rate(sender, instance, created, **kwargs):
    """
    When a rate is updated via calendar:
    - Update the linked booking's base_price if rate is linked
    """
    booking = instance.booking_ref
    if booking:
        # Only update booking price if base_price has changed
        if booking.base_price != instance.base_price:
            booking.base_price = instance.base_price
            booking.save()
