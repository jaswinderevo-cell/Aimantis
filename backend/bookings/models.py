from django.db import models
from structures.models import Structure
from properties.models import Property, PropertyType
import uuid

class Booking(models.Model):
    # Linked entities
    structure = models.ForeignKey(
        Structure, on_delete=models.CASCADE, related_name="bookings"
    )
    property_type = models.ForeignKey(
        PropertyType, on_delete=models.SET_NULL, null=True, blank=True, related_name="bookings"
    )
    property = models.ForeignKey(
        Property, on_delete=models.SET_NULL, null=True, blank=True, related_name="bookings"
    )
    uid = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        db_index=True,
        unique=True,
        help_text="Public UID for guest check-in access"
    )
    # Stay details
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    length_of_stay = models.IntegerField()
    adults_count = models.IntegerField()
    children_count = models.IntegerField(default=0)
    special_requests = models.TextField(blank=True)

    # Pricing
    base_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    cleaning_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    other_extra_fees = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    city_tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Payment info
    PAYMENT_METHOD_CHOICES = [
        ("cash", "Cash on Arrival"),
        ("credit_card", "Credit Card"),
        ("bank_transfer", "Bank Transfer"),
        ("online", "Online Payment"),
    ]
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES, default="cash")

    PAYMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("partially_paid", "Partially Paid"),
        ("fully_paid", "Fully Paid"),
    ]
    payment_status = models.CharField(max_length=50, choices=PAYMENT_STATUS_CHOICES, default="pending")

    # Platform fields  
    platform = models.TextField(
        blank=True, null=True, help_text="Comma-separated platforms list"
    )

    platform_reservation_id = models.CharField(
        max_length=255, null=True, blank=True,
        help_text="Reservation ID from external platform (e.g., Airbnb, Booking.com)"
    )

    due_at_property = models.DecimalField(
        max_digits=10, decimal_places=2, default=0, null=True, blank=True,
        help_text="Amount still due to be paid at the property (applicable for direct bookings)"
    )

    # Additional details
    external_reference = models.CharField(max_length=255, null=True, blank=True)
    invoice_info = models.JSONField(null=True, blank=True)
    citations = models.IntegerField(default=0)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "bookings"

    def __str__(self):
        return f"Booking #{self.id} ({self.property.name if self.property else 'No Property'})"

    def save(self, *args, **kwargs):
        """Automatically calculate length_of_stay before saving."""
        if self.check_in_date and self.check_out_date:
            self.length_of_stay = (self.check_out_date - self.check_in_date).days
        super().save(*args, **kwargs)
