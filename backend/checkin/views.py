# checkin/views.py
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_spectacular.utils import extend_schema
from django.db.models import Prefetch, Count
from .models import CheckInTemplate, CheckInTemplateField, StructureCheckInTemplate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from drf_spectacular.utils import extend_schema, OpenApiExample
from properties.models import Property
# Booking model
from bookings.models import Booking
from guests.serializers import CheckInSerializer, CheckInResponseSerializer

from .serializers import CheckInTemplateCreateSerializer,CheckInTemplateListSerializer, LinkTemplateToStructureSerializer, StructureCheckInFormSerializer, CheckInFormFieldSerializer, CheckInTemplateUpsertSerializer, UnlinkTemplateFromStructureSerializer
from django.shortcuts import get_object_or_404
from .utils import flatten_default_fields, serialize_checkin_field
from structures.models import Structure
from .default_fields import (
    DEFAULT_MAIN_GUEST_FIELDS,
    DEFAULT_ADDITIONAL_GUEST_FIELDS,
)

class CreateCheckInTemplateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["Guest Check-In Forms"],
        request=CheckInTemplateCreateSerializer,
        responses={201: None},
        examples=[
            OpenApiExample(
                "Create Check-in Template",
                value={
                    "name": "Italy Online Check-in",
                    "slug": "italy-online-checkin",
                    "description": "Online check-in form for Italian law compliance",
                    "fields": [
                        {
                            "slug": "first_name",
                            "label": "First Name",
                            "field_type": "text",
                            "target": "main",
                            "is_required": True,
                            "order": 1
                        },
                        {
                            "slug": "nationality",
                            "label": "Nationality",
                            "field_type": "select",
                            "target": "both",
                            "is_required": True,
                            "meta": {
                                "choices": [
                                    {"value": "IT", "label": "Italy"},
                                    {"value": "FR", "label": "France"}
                                ]
                            },
                            "order": 2
                        }
                    ],
                    "structure_id": 12
                },
                request_only=True
            )
        ]
    )
    def post(self, request):
        serializer = CheckInTemplateCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"message": "Check-in template created successfully"},
            status=status.HTTP_201_CREATED
        )

@extend_schema(
    tags=["Guest Check-In Forms"],
    summary="Get check-in forms",
    description="Returns all check-in form templates with linked structures"
)
class CheckInTemplateListAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CheckInTemplateListSerializer

    queryset = (
        CheckInTemplate.objects
        .prefetch_related("fields")
        .prefetch_related(
            Prefetch(
                "structure_links",
                queryset=StructureCheckInTemplate.objects.select_related("structure")
            )
        )
    )

@extend_schema(
    tags=["Guest Check-In Forms"],
    summary="Link check-in form to structure",
    description="Links an existing check-in form to a structure",
    request=LinkTemplateToStructureSerializer,
    responses={201: None}
)
class LinkTemplateToStructureAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = LinkTemplateToStructureSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"message": "Check-in form linked to structure successfully"},
            status=status.HTTP_201_CREATED
        )

@extend_schema(
    tags=["Guest Check-In Forms"],
    summary="Get structures with check-in forms",
    description="Returns structures with address details and linked check-in form"
)
class StructureCheckInFormsAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StructureCheckInFormSerializer

    def list(self, request, *args, **kwargs):
        structures = (
            Structure.objects
            .annotate(
                total_properties_count=Count("properties", distinct=True),
                total_property_types_count=Count("property_types", distinct=True),
            )
            .prefetch_related(
                Prefetch(
                    "checkin_templates",
                    queryset=StructureCheckInTemplate.objects.select_related("template")
                )
            )
        )

        response = []

        for structure in structures:
            active_link = next(
                (link for link in structure.checkin_templates.all() if link.is_active),
                None
            )

            response.append({
                "structure_id": structure.id,
                "structure_name": structure.name,
                "structure_type": structure.structure_type,
                "street_address": structure.street_address,
                "zip_code": structure.zip_code,
                "country": structure.country,
                "total_properties_count": structure.total_properties_count,
                "total_property_types_count": structure.total_property_types_count,
                "checkin_form": (
                    {
                        "id": active_link.template.id,
                        "name": active_link.template.name,
                        "slug": active_link.template.slug,
                    }
                    if active_link else None
                ),
                "is_active": bool(active_link),
            })

        return Response(response)

@extend_schema(
    tags=["Guest Check-In Forms"],
    summary="Get structure check-in form",
    description="Returns check-in form fields for a structure or default fields if no form is linked",
)
class GetStructureCheckInFormAPIView(APIView):
    permission_classes = [AllowAny]  # guest-facing

    def get(self, request, structure_id):
        structure = get_object_or_404(Structure, id=structure_id)

        link = (
            StructureCheckInTemplate.objects
            .select_related("template")
            .prefetch_related("template__fields")
            .filter(structure=structure, is_active=True)
            .first()
        )

        # ---------------- DEFAULT FORM ----------------
        if not link:
            sections = {
                "main_guest": [],
                "additional_guest": [],
            }

            main_fields = flatten_default_fields(
                DEFAULT_MAIN_GUEST_FIELDS,
                section="main_guest"
            )
            additional_fields = flatten_default_fields(
                DEFAULT_ADDITIONAL_GUEST_FIELDS,
                section="additional_guest"
            )

            for item in main_fields:
                meta = item.pop("meta")
                item["category"] = meta["category"]
                if "choices" in meta:
                    item["choices"] = meta["choices"]
                sections["main_guest"].append(item)

            for item in additional_fields:
                meta = item.pop("meta")
                item["category"] = meta["category"]
                if "choices" in meta:
                    item["choices"] = meta["choices"]
                sections["additional_guest"].append(item)

            return Response({
                "template": {
                    "id": None,
                    "name": "Default Hotel Check-in",
                    "slug": "default-hotel-check-in",
                    "description": "Default fields for hotel check-in",
                },
                "sections": sections
            })

        # ---------------- TEMPLATE FORM ----------------
        template = link.template
        fields = template.fields.filter(is_enabled=True)

        sections = {
            "main_guest": [],
            "additional_guest": [],
        }

        for field in fields:
            meta = field.meta or {}
            section = meta.get("section")

            if section in sections:
                sections[section].append(
                    serialize_checkin_field(field)
                )

        return Response({
            "template": {
                "id": template.id,
                "name": template.name,
                "slug": template.slug,
                "description": template.description,
            },
            "sections": sections
        })

@extend_schema(
    tags=["Guest Check-In Forms"],
    summary="Get check-in form by booking UID",
    description="Returns check-in form fields based on booking structure. Falls back to defaults if no template is linked."
)
class GetCheckInFormByBookingUIDAPIView(APIView):
    permission_classes = [AllowAny]  # guest-facing

    def get(self, request, uid):
        # 1️⃣ Validate booking exists
        booking = get_object_or_404(
            Booking.objects.select_related("structure"),
            uid=uid
        )

        # 2️⃣ Find active check-in form for structure
        link = (
            StructureCheckInTemplate.objects
            .select_related("template")
            .prefetch_related("template__fields")
            .filter(
                structure=booking.structure,
                is_active=True
            )
            .first()
        )

        # 3️⃣ Fallback to default fields
        if not link:
            sections = {
                "main_guest": [],
                "additional_guest": [],
            }

            main_fields = flatten_default_fields(
                DEFAULT_MAIN_GUEST_FIELDS,
                section="main_guest"
            )
            additional_fields = flatten_default_fields(
                DEFAULT_ADDITIONAL_GUEST_FIELDS,
                section="additional_guest"
            )

            for item in main_fields:
                meta = item.pop("meta")
                item["category"] = meta["category"]
                if "choices" in meta:
                    item["choices"] = meta["choices"]
                sections["main_guest"].append(item)

            for item in additional_fields:
                meta = item.pop("meta")
                item["category"] = meta["category"]
                if "choices" in meta:
                    item["choices"] = meta["choices"]
                sections["additional_guest"].append(item)

            return Response({
                "booking_uid": str(booking.uid),
                "structure_id": booking.structure.id,
                "source": "default",
                "template": {
                    "id": None,
                    "name": "Default Hotel Check-in",
                    "slug": "default-hotel-check-in",
                    "description": "Default fields for hotel check-in",
                },
                "sections": sections
            })

        # 4️⃣ Build template-driven response (SAME AS FIRST API)
        template = link.template
        fields = template.fields.filter(is_enabled=True)

        sections = {
            "main_guest": [],
            "additional_guest": [],
        }

        for field in fields:
            meta = field.meta or {}
            section = meta.get("section")

            if section in sections:
                sections[section].append(
                    serialize_checkin_field(field)
                )

        return Response({
            "booking_uid": str(booking.uid),
            "structure_id": booking.structure.id,
            "source": "template",
            "template": {
                "id": template.id,
                "name": template.name,
                "slug": template.slug,
                "description": template.description,
            },
            "sections": sections
        })

@extend_schema(
    tags=["Guest Check-In Forms"],
    summary="Create check-in form template",
    request=CheckInTemplateUpsertSerializer,
    responses={201: None},
    examples=[
        OpenApiExample(
            "Create Check-in Template",
            value={
                "name": "Default Hotel Check-in",
                "description": "Default fields for hotel check-in",
                "sections": {
                    "main_guest": [
                        {
                            "slug": "first_name",
                            "label": "First name",
                            "type": "text",
                            "required": False,
                            "category": "Personal info"
                        }
                    ],
                    "additional_guest": [
                        {
                            "slug": "first_name",
                            "label": "First name",
                            "type": "text",
                            "required": False,
                            "category": "Personal info"
                        }
                    ]
                }
            },
            request_only=True
        )
    ]
)
class CreateCheckInTemplateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = CheckInTemplateUpsertSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Check-in form created successfully"},
            status=status.HTTP_201_CREATED
        )


@extend_schema(
    tags=["Guest Check-In Forms"],
    summary="Update check-in form",
    request=CheckInTemplateUpsertSerializer,
    responses={200: None},
    examples=[
        OpenApiExample(
            "Update Check-in Template",
            value={
                "name": "Updated Hotel Check-in",
                "description": "Updated fields for hotel check-in",
                "sections": {
                    "main_guest": [
                        {
                            "slug": "first_name",
                            "label": "First Name",
                            "type": "text",
                            "required": True,
                            "category": "Personal info"
                        },
                        {
                            "slug": "email",
                            "label": "Email Address",
                            "type": "email",
                            "required": True,
                            "category": "Contact"
                        }
                    ],
                    "additional_guest": [
                        {
                            "slug": "first_name",
                            "label": "First Name",
                            "type": "text",
                            "required": True,
                            "category": "Personal info"
                        }
                    ]
                }
            },
            request_only=True
        )
    ]
)
class UpdateCheckInTemplateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request, pk):
        template = get_object_or_404(CheckInTemplate, pk=pk)
        serializer = CheckInTemplateUpsertSerializer(
            instance=template,  # Pass instance for update
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Check-in form updated successfully"},
            status=status.HTTP_200_OK
        )

@extend_schema(
    tags=["Guest Check-In Forms"],
    summary="Get default check-in fields",
    description="Returns default fields in flat structure for creating a new check-in form",
)
class DefaultCheckInFieldsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "source": "default",
            "template": {
                "id": None,
                "name": "Default Hotel Check-in",
                "slug": "default-hotel-check-in",
                "description": "Default fields for hotel check-in",
            },
            "sections": {
                "main_guest": flatten_default_fields(
                    DEFAULT_MAIN_GUEST_FIELDS,
                    section="main_guest"
                ),
                "additional_guest": flatten_default_fields(
                    DEFAULT_ADDITIONAL_GUEST_FIELDS,
                    section="additional_guest"
                ),
            }
        })


@extend_schema(
    tags=["Guest Check-In Forms"],
    summary="Get or update check-in template",
)

class CheckInTemplateDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        template = get_object_or_404(
            CheckInTemplate.objects.prefetch_related("fields"),
            pk=pk
        )

        sections = {
            "main_guest": [],
            "additional_guest": [],
        }

        for field in template.fields.filter(is_enabled=True).order_by("order", "id"):
            meta = field.meta or {}
            section = meta.get("section")

            if section in sections:
                sections[section].append({
                    "slug": field.slug,
                    "label": field.label,
                    "type": field.field_type,
                    "required": field.is_required,
                    "category": meta.get("category"),
                    **({"choices": meta["choices"]} if "choices" in meta else {})
                })

        return Response({
            "template": {
                "id": template.id,
                "name": template.name,
                "slug": template.slug,
                "description": template.description,
            },
            "sections": sections
        })

@extend_schema(
    tags=["Guest Check-In Forms"],
    summary="Delete check-in template",
    description="Deletes a check-in form if it is not linked to any structure",
)
class DeleteCheckInTemplateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, template_id):
        template = get_object_or_404(CheckInTemplate, id=template_id)

        # ❌ Do not allow delete if template is linked to any structure
        if StructureCheckInTemplate.objects.filter(
            template_id=template_id
        ).exists():
            return Response(
                {
                    "error": (
                        "This check-in form is linked to one or more structures "
                        "and cannot be deleted."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        template.delete()

        return Response(
            {"message": "Check-in form deleted successfully"},
            status=status.HTTP_200_OK
        )

@extend_schema(
    tags=["Guest Check-In Forms"],
    summary="Unlink check-in template from structure",
    description="Removes the check-in template association from a structure",
    request=UnlinkTemplateFromStructureSerializer,  # ✅ REQUIRED
    responses={200: None},
)
class UnlinkTemplateFromStructureAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UnlinkTemplateFromStructureSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"message": "Check-in template unlinked from structure successfully"},
            status=status.HTTP_200_OK
        )

@extend_schema(
    tags=["Guest Check-In"],
    summary="Submit guest check-in form",
    description=(
        "Public endpoint to submit guest check-in details using a valid booking UID. "
        "Creates or replaces guests linked to the booking."
    ),
    request=CheckInSerializer,
    responses={201: CheckInResponseSerializer},
    examples=[
        OpenApiExample(
            "Submit Check-In",
            value={
                "guests": [
                    {
                        "full_name": "John Doe",
                        "is_main_guest": True,
                        "email": "john@example.com",
                        "phone": "+49123456789",
                        "date_of_birth": "1990-05-12",
                        "gender": "male",
                        "document_type": "passport",
                        "id_number": "X1234567",
                        "document_issue_date": "2018-01-01",
                        "document_expiry_date": "2028-01-01",
                        "document_issuing_country": "Italy",
                        "nationality": "Italian",
                        "address": "Via Roma 10",
                        "zip_code": "00100",
                        "country": "Italy",
                        "city": "Rome"
                    },
                    {
                        "full_name": "Jane Doe",
                        "is_main_guest": False,
                        "date_of_birth": "1992-08-20",
                        "gender": "female",
                        "nationality": "Italian"
                    }
                ]
            },
            request_only=True,
        )
    ],
)
class SubmitCheckInAPIView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        tags=["Guest Check-In"],
        summary="Submit check-in by booking UID",
        description="Public endpoint to submit guest check-in details using Booking.uid",
        request=CheckInSerializer,
        responses={201: CheckInResponseSerializer},
    )
    def post(self, request, booking_uid):
        # 1. Validate booking UID
        booking = get_object_or_404(
            Booking.objects.select_related("structure"),
            uid=booking_uid
        )

        # 2. Prepare payload for serializer
        payload = {
            "booking_id": booking.id,
            "guests": request.data.get("guests", []),
        }

        serializer = CheckInSerializer(data=payload)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()

        return Response(
            {
                "booking_id": booking.id,
                # "guests": result["guests"],
                "message": "Check-in submitted successfully",
            },
            status=status.HTTP_201_CREATED
        )
    
