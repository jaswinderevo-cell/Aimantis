from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Booking
from rates.models import Rate

@receiver(post_delete, sender=Booking)
def free_rates_on_booking_delete(sender, instance, **kwargs):
    rates = Rate.objects.filter(
        property=instance.property,
        date__gte=instance.check_in_date,
        date__lt=instance.check_out_date,
        booking_ref=instance
    )
    for rate in rates:
        rate.is_booked = False
        rate.booking_ref = None
        rate.save()
