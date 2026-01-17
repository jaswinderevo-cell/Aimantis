from django.db import models
from structures.models import Structure


class PropertyType(models.Model):
    class Status(models.IntegerChoices):
        UNMAPPED = 1, "Unmapped"
        MAPPED = 2, "Mapped"

    # Foreign key to Structure
    structure = models.ForeignKey(
        Structure,
        on_delete=models.CASCADE,
        related_name="property_types",
        db_index=True,
    )

    # Basic Information
    name = models.CharField(max_length=255, help_text="Property Type Name")
    internal_property_type_id = models.CharField(
        max_length=100, blank=True, null=True, help_text="Optional internal property ID"
    )

    # Property Type Characteristics
    image_url = models.URLField(max_length=500, blank=True, null=True)
    property_size_sqm = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Size in square meters",
    )
    max_guests = models.IntegerField(default=0)
    num_beds = models.IntegerField(default=0)
    num_sofa_beds = models.IntegerField(default=0)
    num_bedrooms = models.IntegerField(default=0)
    num_bathrooms = models.IntegerField(default=0)
    amenities = models.TextField(
        blank=True, null=True, help_text="Comma-separated amenities list"
    )
    status = models.IntegerField(
        choices=Status.choices,
        default=Status.UNMAPPED,
        help_text="Use Status Enum: 1=Unmapped, 2=Mapped, etc.",
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "property_types"

    def __str__(self):
        return self.name



class PropertyTypeBed(models.Model):
    property_type = models.ForeignKey(
        PropertyType, on_delete=models.CASCADE, related_name="beds"
    )
    bed_type = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "property_types_beds"

    def __str__(self):
        return f"{self.bed_type} x {self.quantity}"


class Property(models.Model):
    class PropertyStatus(models.IntegerChoices):
        UNMAPPED = 1, "Unavailable"
        MAPPED = 2, "Available"

    # Foreign Keys
    structure = models.ForeignKey(
        Structure, on_delete=models.CASCADE, related_name="properties", db_index=True
    )
    property_type = models.ForeignKey(
        PropertyType, on_delete=models.CASCADE, related_name="properties", db_index=True
    )

    # Basic Information
    name = models.CharField(max_length=255, help_text="Property Name")
    internal_property_id = models.CharField(
        max_length=100, blank=True, null=True, help_text="Optional Property ID"
    )
    floor_number = models.IntegerField(blank=True, null=True, help_text="Floor Number")

    # Property Characteristics
    amenities = models.TextField(
        blank=True, null=True, help_text="Comma-separated amenities list"
    )
    status = models.IntegerField(
        choices=PropertyStatus.choices,
        default=PropertyStatus.UNMAPPED,
        help_text="Use Status Enum: 1=Unavailable, 2=Available, etc.",
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "properties"

    def __str__(self):
        return self.name
