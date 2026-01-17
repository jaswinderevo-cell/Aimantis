# checkin/serializers.py
from rest_framework import serializers
from .models import CheckInTemplate, CheckInTemplateField, StructureCheckInTemplate
from .utils import generate_random_slug
from django.utils.text import slugify
from .constants import DEFAULT_FIELD_TYPE_MAP
from structures.models import Structure
from django.utils import timezone
from django.db import transaction

class CheckInTemplateFieldCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckInTemplateField
        fields = (
            "slug",
            "label",
            "help_text",
            "field_type",
            "target",
            "is_enabled",
            "is_required",
            "meta",
            "order",
        )

class CheckInTemplateListSerializer(serializers.ModelSerializer):
    fields_count = serializers.IntegerField(source="fields.count", read_only=True)
    structures = serializers.SerializerMethodField()

    class Meta:
        model = CheckInTemplate
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "is_active",
            "fields_count",
            "structures",
            "created_at",
        )

    def get_structures(self, obj):
        """
        Returns list of structures linked to this template
        """
        return [
            {
                "id": link.structure.id,
                "name": link.structure.name
            }
            for link in obj.structure_links.all()
        ]

class LinkTemplateToStructureSerializer(serializers.Serializer):
    structure_id = serializers.IntegerField()
    template_id = serializers.IntegerField()
    is_active = serializers.BooleanField(default=True)

    def validate(self, attrs):
        structure_id = attrs["structure_id"]
        template_id = attrs["template_id"]

        if not Structure.objects.filter(id=structure_id).exists():
            raise serializers.ValidationError({
                "structure_id": "Structure not found."
            })

        if not CheckInTemplate.objects.filter(id=template_id).exists():
            raise serializers.ValidationError({
                "template_id": "Check-in template not found."
            })

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        structure_id = validated_data["structure_id"]
        template_id = validated_data["template_id"]
        is_active = validated_data["is_active"]

        link = StructureCheckInTemplate.objects.filter(
            structure_id=structure_id
        ).first()

        # Existing row → UPDATE
        if link:
            template_changed = link.template_id != template_id

            link.template_id = template_id
            link.is_active = is_active

            if template_changed:
                link.assigned_at = timezone.now()

            fields_to_update = ["template_id", "is_active"]
            if template_changed:
                fields_to_update.append("assigned_at")

            link.save(update_fields=fields_to_update)

        # No row → CREATE
        else:
            StructureCheckInTemplate.objects.create(
                structure_id=structure_id,
                template_id=template_id,
                is_active=is_active,
                assigned_at=timezone.now(),
            )

        return {
            "structure_id": structure_id,
            "template_id": template_id,
            "is_active": is_active,
        }

class StructureCheckInFormSerializer(serializers.Serializer):
    structure_id = serializers.IntegerField()
    structure_name = serializers.CharField()
    structure_type = serializers.CharField()
    street_address = serializers.CharField()
    zip_code = serializers.CharField()
    country = serializers.CharField()

    checkin_form = serializers.DictField(allow_null=True)
    is_active = serializers.BooleanField()
    

class StructureMiniSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()

class CheckInFormFieldSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source="field_type")
    required = serializers.BooleanField(source="is_required")
    category = serializers.SerializerMethodField()

    class Meta:
        model = CheckInTemplateField
        fields = (
            "slug",
            "label",
            "type",
            "required",
            "category",
        )

    def get_category(self, obj):
        if not obj.meta:
            return None
        return obj.meta.get("category")


class StructureCheckInFormSerializer(serializers.Serializer):
    structure_id = serializers.IntegerField()
    structure_name = serializers.CharField()
    checkin_form = serializers.DictField(allow_null=True)
    is_active = serializers.BooleanField()

class UnlinkTemplateFromStructureSerializer(serializers.Serializer):
    structure_id = serializers.IntegerField()

    def validate(self, attrs):
        structure_id = attrs["structure_id"]

        if not Structure.objects.filter(id=structure_id).exists():
            raise serializers.ValidationError({
                "structure_id": "Structure not found."
            })

        if not StructureCheckInTemplate.objects.filter(
            structure_id=structure_id
        ).exists():
            raise serializers.ValidationError({
                "structure_id": "No check-in template is linked to this structure."
            })

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        structure_id = validated_data["structure_id"]

        StructureCheckInTemplate.objects.filter(
            structure_id=structure_id
        ).delete()

        return {"structure_id": structure_id}

class CheckInTemplateUpsertSerializer(serializers.Serializer):
    """
    Unified serializer for both create and update operations.
    Accepts sections-based structure matching the Get API response.
    """
    name = serializers.CharField()
    slug = serializers.SlugField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    is_active = serializers.BooleanField(default=True)
    sections = serializers.DictField()

    def validate_sections(self, value):
        """Ensure sections have at least one field"""
        if not value:
            raise serializers.ValidationError(
                "At least one section with fields is required."
            )
        
        total_fields = sum(len(fields) for fields in value.values())
        if total_fields == 0:
            raise serializers.ValidationError(
                "At least one field is required to create a check-in form."
            )
        return value

    def validate(self, attrs):
        """Auto-generate slug from name if not provided"""
        name = attrs.get("name")
        slug = attrs.get("slug")
        
        if not slug and name:
            base_slug = slugify(name)
            # For updates, preserve existing slug unless name changed
            if self.instance and self.instance.slug:
                attrs["slug"] = self.instance.slug
            else:
                attrs["slug"] = base_slug
        
        return attrs

    def _flatten_sections_to_fields(self, sections):
        """
        Convert sections structure to flat list of fields.
        Matches the format from GetStructureCheckInFormAPIView response.
        """
        fields_data = []
        order = 1
        
        for section, fields in sections.items():
            for field in fields:
                # Build meta with section and category
                meta = {
                    "section": section,
                    "category": field.get("category", ""),
                }
                
                # Add choices if present
                if "choices" in field:
                    meta["choices"] = field["choices"]
                
                # Get field type
                field_type = field.get("type", "text")
                
                fields_data.append({
                    "slug": field["slug"],
                    "label": field["label"],
                    "field_type": field_type,
                    "is_required": field.get("required", False),
                    "meta": meta,
                    "order": order,
                    "target": "both",  # Use section in meta for placement
                    "is_enabled": True,
                    "help_text": field.get("help_text", ""),
                })
                order += 1
        
        return fields_data

    def create(self, validated_data):
        """Create new template with fields from sections"""
        sections = validated_data.pop("sections")
        
        # Create template
        template = CheckInTemplate.objects.create(**validated_data)
        
        # Flatten sections to fields and bulk create
        fields_data = self._flatten_sections_to_fields(sections)
        CheckInTemplateField.objects.bulk_create([
            CheckInTemplateField(template=template, **field)
            for field in fields_data
        ])
        
        return template

    def update(self, instance, validated_data):
        """Update template and sync fields from sections"""
        sections = validated_data.pop("sections")
        
        # Update template core fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Flatten incoming sections to fields
        fields_data = self._flatten_sections_to_fields(sections)
        
        # Get existing fields mapped by slug
        existing_fields = {
            f.slug: f for f in instance.fields.all()
        }
        
        # Track which slugs are in the incoming data
        incoming_slugs = set()
        
        # Update or create fields
        for field_data in fields_data:
            slug = field_data["slug"]
            incoming_slugs.add(slug)
            
            if slug in existing_fields:
                # Update existing field
                obj = existing_fields[slug]
                for attr, value in field_data.items():
                    setattr(obj, attr, value)
                obj.save()
            else:
                # Create new field
                CheckInTemplateField.objects.create(
                    template=instance,
                    **field_data
                )
        
        # Delete fields that are no longer in the incoming data
        fields_to_delete = [
            field_obj for slug, field_obj in existing_fields.items()
            if slug not in incoming_slugs
        ]
        for field_obj in fields_to_delete:
            field_obj.delete()
        
        return instance


# Alias for backwards compatibility
CheckInTemplateCreateSerializer = CheckInTemplateUpsertSerializer
