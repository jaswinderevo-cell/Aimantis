from django.db import models
from django.contrib.auth.models import User


class ApiConfiguration(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="api_configurations"
    )
    portal_name = models.CharField(max_length=255)
    api_key = models.CharField(max_length=255)
    secret = models.CharField(max_length=255)
    extra_config = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "api_configurations"

    def __str__(self):
        return f"API Configuration for {self.portal_name}"
