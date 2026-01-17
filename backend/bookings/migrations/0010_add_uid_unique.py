# bookings/migrations/0010_add_uid_unique.py
from django.db import migrations, models
import uuid

def populate_uid(apps, schema_editor):
    Booking = apps.get_model("bookings", "Booking")
    for booking in Booking.objects.filter(uid__isnull=True):
        booking.uid = uuid.uuid4()
        booking.save(update_fields=["uid"])

class Migration(migrations.Migration):

    dependencies = [
        ("bookings", "0009_booking_uid"),
    ]

    operations = [
        # Ensure all existing rows have a UID
        migrations.RunPython(populate_uid, reverse_code=migrations.RunPython.noop),

        # Then enforce unique constraint
        migrations.AlterField(
            model_name="booking",
            name="uid",
            field=models.UUIDField(
                default=uuid.uuid4,
                editable=False,
                unique=True,
            ),
        ),
    ]
