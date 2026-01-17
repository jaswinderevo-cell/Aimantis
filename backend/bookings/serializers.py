from rest_framework import serializers
from .models import Booking
from guests.serializers import GuestSerializer
from guests.models import Guest
from properties.models import Property
from availability.models import BlockedPeriod


class BookingSerializer(serializers.ModelSerializer):
    guests = GuestSerializer(many=True, required=False)
    property_name = serializers.SerializerMethodField() 
    
    class Meta:
        model = Booking
        fields = [
            "id",
            "structure",
            "uid",
            "property_type",
            "property",
            "property_name",
            "check_in_date",
            "check_out_date",
            "length_of_stay",
            "adults_count",
            "children_count",
            "special_requests",
            "base_price",
            "cleaning_fee",
            "other_extra_fees",
            "city_tax",
            "subtotal",
            "total_price",
            "payment_method",
            "payment_status",
            "platform",
            "platform_reservation_id",
            "due_at_property",
            "external_reference",
            "invoice_info",
            "created_at",
            "updated_at",
            "guests",
        ]
        read_only_fields = [
            "id", "created_at", "updated_at", "uid",
            "length_of_stay", "property_name"
        ]

    def get_property_name(self, obj):
        return obj.property.name if obj.property else None

    # -------------------------------------------------------------------------
    # VALIDATION (includes double-booking + blocked dates)
    # -------------------------------------------------------------------------
    def validate(self, data):
        guests = data.get("guests", [])
        if guests and not any(g.get("is_main_guest") for g in guests):
            raise serializers.ValidationError("At least one main guest is required.")

        check_in = data.get("check_in_date")
        check_out = data.get("check_out_date")
        property_obj = data.get("property")

        if check_in and check_out and check_out <= check_in:
            raise serializers.ValidationError("Check-out date must be after check-in date. check_in: {}, check_out: {}, booking: {}".format(check_in, check_out, self.instance.id if self.instance else "new"))

        if property_obj and check_in and check_out:

            # Exclude current instance from overlap checks during update
            booking_id = self.instance.id if self.instance else None

            # -------------------------------------------------------
            # Prevent double booking
            # -------------------------------------------------------
            overlapping = Booking.objects.filter(
                property=property_obj,
                check_in_date__lt=check_out,
                check_out_date__gt=check_in,
            ).exclude(id=booking_id).exists()

            if overlapping:
                raise serializers.ValidationError(
                    "This property is already booked for the selected dates."
                )

            # -------------------------------------------------------
            # Prevent booking in blocked dates
            # -------------------------------------------------------
            blocked = BlockedPeriod.objects.filter(
                property=property_obj,
                start_date__lt=check_out,
                end_date__gt=check_in,
            ).exists()

            if blocked:
                raise serializers.ValidationError(
                    "This property is blocked for the selected dates."
                )

        return data

    # -------------------------------------------------------------------------
    # CREATE
    # -------------------------------------------------------------------------
    def create(self, validated_data):
        guests_data = validated_data.pop("guests", [])
        
        property_obj = validated_data.get("property")
        if property_obj:
            validated_data["structure"] = property_obj.structure
            validated_data["property_type"] = property_obj.property_type

        check_in = validated_data.get("check_in_date")
        check_out = validated_data.get("check_out_date")

        if check_in and check_out:
            validated_data["length_of_stay"] = (check_out - check_in).days

        booking = Booking.objects.create(**validated_data)

        for guest_data in guests_data:
            Guest.objects.create(booking=booking, **guest_data)

        return booking

    # -------------------------------------------------------------------------
    # UPDATE
    # -------------------------------------------------------------------------
    def update(self, instance, validated_data):
        guests_data = validated_data.pop("guests", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if instance.property:
            instance.structure = instance.property.structure
            instance.property_type = instance.property.property_type

        if instance.check_in_date and instance.check_out_date:
            instance.length_of_stay = (instance.check_out_date - instance.check_in_date).days

        instance.save()

        if guests_data is not None:
            instance.guests.all().delete()
            for guest_data in guests_data:
                Guest.objects.create(booking=instance, **guest_data)

        return instance
