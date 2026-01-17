# rates/models.py
from django.db import models
from properties.models import Property

class Rate(models.Model):
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="rates",
        db_index=True,
    )
    date = models.DateField()

    base_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Default/base price for the night",
    )
    min_nights = models.PositiveIntegerField(
        default=1,
        help_text="Minimum nights required",
    )

    # OTA-specific rates
    booking = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Price on Booking.com",
    )
    airbnb = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Price on Airbnb",
    )
    experia = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Price on Expedia",
    )

    # === NEW FIELDS FOR BOOKING INTEGRATION ===
    booking_ref = models.ForeignKey(
        "bookings.Booking",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="rates",
        help_text="Reference to the booking occupying this rate slot",
    )
    is_booked = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "property_rates"
        unique_together = (("property", "date"),)
        ordering = ["property_id", "date"]

    def __str__(self):
        return f"{self.property.name} @ {self.date}: {self.base_price}"
