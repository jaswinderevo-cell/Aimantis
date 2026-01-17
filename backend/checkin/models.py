from django.db import models

JSON = models.JSONField

class CheckInTemplate(models.Model):
    """
    Reusable named template that defines which fields are available for online
    check-in for a structure.
    """
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "checkin_templates"
        ordering = ["name"]

    def __str__(self):
        return self.name


class CheckInTemplateField(models.Model):
    """
    A single field definition inside a CheckInTemplate.

    - field_type: determines frontend input type (text, email, date, select, file, etc.)
    - target: whether the field applies to main guest, additional guest, or both
    - meta: JSON blob for extra options (select options, placeholder, validation, etc.)
    - is_enabled/is_required control rendering and validation
    - order controls UI ordering
    """
    TARGET_MAIN = "main"
    TARGET_ADDITIONAL = "additional"
    TARGET_BOTH = "both"

    TARGET_CHOICES = [
        (TARGET_MAIN, "Main guest"),
        (TARGET_ADDITIONAL, "Additional guest"),
        (TARGET_BOTH, "Both"),
    ]

    FIELD_TEXT = "text"
    FIELD_TEXTAREA = "textarea"
    FIELD_SELECT = "select"
    FIELD_RADIO = "radio"
    FIELD_CHECKBOX = "checkbox"
    FIELD_DATE = "date"
    FIELD_EMAIL = "email"
    FIELD_PHONE = "phone"
    FIELD_FILE = "file"
    FIELD_NUMBER = "number"
    # Add more types as needed by frontend
    FIELD_TYPE_CHOICES = [
        (FIELD_TEXT, "Text"),
        (FIELD_TEXTAREA, "Text area"),
        (FIELD_SELECT, "Select"),
        (FIELD_RADIO, "Radio"),
        (FIELD_CHECKBOX, "Checkbox"),
        (FIELD_DATE, "Date"),
        (FIELD_EMAIL, "Email"),
        (FIELD_PHONE, "Phone"),
        (FIELD_FILE, "File"),
        (FIELD_NUMBER, "Number"),
    ]

    template = models.ForeignKey(
        CheckInTemplate,
        on_delete=models.CASCADE,
        related_name="fields",
    )
    slug = models.SlugField(max_length=255, help_text="Unique per template (used as key in payload)")
    label = models.CharField(max_length=255)
    help_text = models.CharField(max_length=512, blank=True, null=True)
    field_type = models.CharField(max_length=32, choices=FIELD_TYPE_CHOICES, default=FIELD_TEXT)
    target = models.CharField(max_length=16, choices=TARGET_CHOICES, default=TARGET_BOTH)
    is_enabled = models.BooleanField(default=True)
    is_required = models.BooleanField(default=False)
    # JSON meta for options (e.g., {"choices": [{"value":"m","label":"Male"}, ...], "placeholder": "...", "max_length": 50})
    meta = JSON(blank=True, null=True, default=dict)
    order = models.PositiveIntegerField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "checkin_template_fields"
        ordering = ["order", "id"]
        # unique_together = ("template", "slug")  # ensure slug uniqueness within template

    def __str__(self):
        return f"{self.template.name} — {self.label}"


class StructureCheckInTemplate(models.Model):
    """
    Assignment of a CheckInTemplate to a Structure (accommodation).
    Multiple templates can exist; this model marks which template(s) a structure uses.
    Typically a structure will have one active template (is_active=True).
    """
    # Replace 'structures.Structure' with your actual Structure model import path if different.
    structure = models.ForeignKey(
        "structures.Structure",
        on_delete=models.CASCADE,
        related_name="checkin_templates",
    )
    template = models.ForeignKey(
        CheckInTemplate,
        on_delete=models.PROTECT,
        related_name="structure_links",
    )
    is_active = models.BooleanField(default=True)
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "structure_checkin_templates"
        unique_together = ("structure", "template")
        ordering = ["-is_active", "assigned_at"]

    def __str__(self):
        return f"{self.structure} -> {self.template}"
