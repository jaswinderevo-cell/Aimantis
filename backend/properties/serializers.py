from rest_framework import serializers
from .models import PropertyType, Property, PropertyTypeBed


class PropertyTypeBedSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyTypeBed
        fields = ["id", "bed_type", "quantity"]
        read_only_fields = ["id"]


class PropertyTypeSerializer(serializers.ModelSerializer):
    beds = PropertyTypeBedSerializer(many=True)

    class Meta:
        model = PropertyType
        fields = [
            "id",
            "structure",
            "name",
            "image_url",
            "internal_property_type_id",
            "property_size_sqm",
            "max_guests",
            "num_sofa_beds",
            "num_bedrooms",
            "num_bathrooms",
            "amenities",
            "status",
            "beds",  # Nested list of bed types
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, attrs):
        # Validate numeric fields
        numeric_fields = [
            "max_guests",
            "num_sofa_beds",
            "num_bedrooms",
            "num_bathrooms",
        ]
        for field in numeric_fields:
            if attrs.get(field, 0) < 0:
                raise serializers.ValidationError(
                    {field: "Must be a non-negative integer."}
                )

        return attrs

    def validate_beds(self, beds):
        if not beds or len(beds) == 0:
            raise serializers.ValidationError(
                "At least one bed type must be specified."
            )
        return beds

    def create(self, validated_data):
        beds_data = validated_data.pop("beds")
        property_type = PropertyType.objects.create(**validated_data)

        for bed in beds_data:
            PropertyTypeBed.objects.create(property_type=property_type, **bed)

        return property_type

    def update(self, instance, validated_data):
        beds_data = validated_data.pop("beds", None)

        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if beds_data is not None:
            instance.beds.all().delete()  # Clear existing beds
            for bed in beds_data:
                PropertyTypeBed.objects.create(property_type=instance, **bed)

        return instance


class PropertySerializer(serializers.ModelSerializer):
    property_type_name = serializers.CharField(source="property_type.name", read_only=True)

    class Meta:
        model = Property
        fields = [
            "id",
            "structure",
            "property_type",
            "name",
            "property_type_name",
            "status",
            "internal_property_id",
            "floor_number",
            "amenities",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_floor_number(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError(
                "floor_number must be a non-negative integer."
            )
        return value
