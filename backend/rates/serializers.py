from datetime import timedelta
from rest_framework import serializers
from properties.models import Property
from .models import Rate

WEEKDAY_MAP = {
    "Monday": 0,
    "Tuesday": 1,
    "Wednesday": 2,
    "Thursday": 3,
    "Friday": 4,
    "Saturday": 5,
    "Sunday": 6,
}

# --------------------- Calendar Rate Item Serializer ---------------------
class RateItemSerializer(serializers.Serializer):
    date = serializers.DateField()
    minNights = serializers.IntegerField()
    basePrice = serializers.FloatField()
    airbnb = serializers.FloatField()
    booking = serializers.FloatField()
    expedia = serializers.FloatField()
    is_booked = serializers.BooleanField()
    booking_id = serializers.IntegerField(allow_null=True)


# --------------------- Calendar View Serializer ---------------------
class RatesCalendarSerializer(serializers.Serializer):
    property_id = serializers.IntegerField()
    property_name = serializers.CharField()
    property_type = serializers.IntegerField()
    structure = serializers.IntegerField()
    rates = RateItemSerializer(many=True)


# --------------------- Bulk Price Change Serializer ---------------------
class BulkPriceChangeSerializer(serializers.Serializer):
    property = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all(),
        required=False,
    )
    properties = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(queryset=Property.objects.all()),
        required=False,
        allow_empty=False,
    )
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    base_price = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0)
    min_nights = serializers.IntegerField(min_value=1)
    weekdays = serializers.ListField(
        child=serializers.ChoiceField(choices=list(WEEKDAY_MAP.keys())),
        required=False,
    )
    booking_pct = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=0, max_value=100)
    airbnb_pct = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=0, max_value=100)
    experia_pct = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=0, max_value=100)

    def validate(self, attrs):
        if attrs["end_date"] < attrs["start_date"]:
            raise serializers.ValidationError({"end_date": "end_date must be on or after start_date."})

        prop_single = attrs.get("property")
        prop_multiple = attrs.get("properties")
        if not prop_single and not prop_multiple:
            raise serializers.ValidationError("Either 'property' or 'properties' must be provided.")
        if prop_single and prop_multiple:
            raise serializers.ValidationError("Cannot provide both 'property' and 'properties'. Use 'properties' only.")
        if prop_multiple:
            prop_ids = [p.id for p in prop_multiple]
            if len(prop_ids) != len(set(prop_ids)):
                raise serializers.ValidationError({"properties": "Duplicate properties are not allowed."})
        return attrs

    def save(self):
        single_property = self.validated_data.get("property")
        multiple_properties = self.validated_data.get("properties", [])
        properties_to_process = [single_property] if single_property else multiple_properties

        start = self.validated_data["start_date"]
        end = self.validated_data["end_date"]
        base_price = float(self.validated_data["base_price"])
        min_nights = self.validated_data["min_nights"]
        b_mul = 1 + float(self.validated_data["booking_pct"]) / 100
        a_mul = 1 + float(self.validated_data["airbnb_pct"]) / 100
        e_mul = 1 + float(self.validated_data["experia_pct"]) / 100
        selected_wds = {WEEKDAY_MAP[d] for d in self.validated_data.get("weekdays", [])}

        for prop in properties_to_process:
            current = start
            while current <= end:
                if not selected_wds or current.weekday() in selected_wds:
                    defaults = {
                        "base_price": base_price,
                        "min_nights": min_nights,
                        "booking": round(base_price * b_mul, 2),
                        "airbnb": round(base_price * a_mul, 2),
                        "experia": round(base_price * e_mul, 2),
                    }
                    Rate.objects.update_or_create(property=prop, date=current, defaults=defaults)
                current += timedelta(days=1)

        return {
            "message": f"Successfully updated rates for {len(properties_to_process)} properties",
            "properties_count": len(properties_to_process),
            "date_range": f"{start} to {end}"
        }


# --------------------- Simplified Single Rate Update ---------------------
class SimplifiedRateUpdateSerializer(serializers.Serializer):
    property = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all())
    date = serializers.DateField()
    base_price = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=1)
    min_nights = serializers.IntegerField(min_value=1)
    is_booked = serializers.BooleanField(required=False)

    def save(self):
        prop = self.validated_data["property"]
        rate_date = self.validated_data["date"]
        base_price = self.validated_data["base_price"]
        min_nights = self.validated_data["min_nights"]

        rate, created = Rate.objects.get_or_create(
            property=prop,
            date=rate_date,
            defaults={"base_price": base_price, "min_nights": min_nights}
        )

        rate.base_price = base_price
        rate.min_nights = min_nights

        if rate.is_booked and rate.booking_ref:
            booking = rate.booking_ref
            booking.base_price = base_price
            booking.save()

        rate.save()
        return {"rate": rate, "created": created}


# --------------------- Detailed Rate Serializer ---------------------
class RateDetailSerializer(serializers.ModelSerializer):
    property_name = serializers.CharField(source='property.name', read_only=True)
    property_id = serializers.IntegerField(source='property.id', read_only=True)

    class Meta:
        model = Rate
        fields = [
            'id', 'property_id', 'property_name', 'date', 'base_price',
            'min_nights', 'booking', 'airbnb', 'experia',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
