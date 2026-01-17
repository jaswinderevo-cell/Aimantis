from rest_framework import serializers
from .models import BlockedPeriod
from bookings.models import Booking


class BlockedPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockedPeriod
        fields = [
            "id",
            "structure",
            "property_type",
            "property",
            "start_date",
            "end_date",
            "reason",
            "notes",
            "created_by",
            "updated_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_by", "updated_by", "created_at", "updated_at"]

    def validate(self, data):
        start = data.get("start_date")
        end = data.get("end_date")
        property_obj = data.get("property")

        if not property_obj:
            raise serializers.ValidationError("Property is required.")

        if start >= end:
            raise serializers.ValidationError("End date must be after start date.")

        # -------- VALIDATE AGAINST EXISTING BLOCKED PERIODS ----------
        overlapping_block = BlockedPeriod.objects.filter(
            property=property_obj,
            start_date__lt=end,
            end_date__gt=start,
        )

        # Exclude current instance when updating
        if self.instance:
            overlapping_block = overlapping_block.exclude(id=self.instance.id)

        if overlapping_block.exists():
            raise serializers.ValidationError(
                "These dates are already blocked for this property."
            )

        # -------- VALIDATE AGAINST BOOKINGS ----------
        overlapping_booking = Booking.objects.filter(
            property=property_obj,
            check_in_date__lt=end,
            check_out_date__gt=start,
        ).exists()

        if overlapping_booking:
            raise serializers.ValidationError(
                "Cannot block these dates because the property has active bookings."
            )

        return data
