from django.db import models
from django.conf import settings
from structures.models import Structure
from properties.models import Property, PropertyType

class BlockedPeriod(models.Model):
    structure = models.ForeignKey(
        Structure,
        on_delete=models.CASCADE,
        related_name="blocked_periods"
    )

    property_type = models.ForeignKey(
        PropertyType,
        on_delete=models.CASCADE,
        related_name="blocked_periods",
        null=True,
        blank=True
    )

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="blocked_periods"
    )

    start_date = models.DateField()
    end_date = models.DateField()

    reason = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_blocked_periods"
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="updated_blocked_periods"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "blocked_periods"
        ordering = ["-start_date"]
        indexes = [
            models.Index(fields=["property", "start_date", "end_date"]),
        ]

    def __str__(self):
        return f"Blocked {self.property.name} {self.start_date}→{self.end_date}"
