from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import (
    extend_schema,
    OpenApiResponse,
    OpenApiParameter,
    OpenApiExample,
)
from .models import PropertyType, Property
from .serializers import PropertyTypeSerializer, PropertySerializer
from django.http import JsonResponse

import time
import hashlib
import os


@extend_schema(
    tags=["property-type"],
    summary="List and create property types",
    responses={
        200: PropertyTypeSerializer(many=True),
        201: PropertyTypeSerializer,
        403: OpenApiResponse(description="Forbidden"),
    },
    examples=[
        OpenApiExample(
            name="Create Property Type",
            value={
                "structure": 1,
                "name": "Deluxe Suite",
                "internal_property_type_id": "DLX-001",
                "property_size_sqm": "45.5",
                "max_guests": 4,
                "num_sofa_beds": 1,
                "num_bedrooms": 2,
                "num_bathrooms": 1,
                "amenities": "WiFi,TV,Air Conditioning,Mini Bar",
                "status": 1,
                "beds": [
                    {"bed_type": "King Bed", "quantity": 1},
                    {"bed_type": "Single Bed", "quantity": 2},
                ],
            },
            request_only=True,
        )
    ],
)
class PropertyTypeListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertyTypeSerializer

    def get_queryset(self):
        # Only show types for structures the user owns
        return PropertyType.objects.filter(structure__user=self.request.user)

    def perform_create(self, serializer):
        # Ensure the provided structure belongs to the user
        serializer.save()


@extend_schema(
    tags=["property-type"],
    summary="Retrieve, update, and delete a property type",
    responses={
        200: PropertyTypeSerializer,
        204: None,
        403: OpenApiResponse(description="Forbidden"),
    },
    examples=[
        OpenApiExample(
            name="Update Property Type",
            value={
                "structure": 1,
                "name": "Executive Suite",
                "internal_property_type_id": "EXE-002",
                "property_size_sqm": "60.0",
                "max_guests": 3,
                "num_sofa_beds": 1,
                "num_bedrooms": 1,
                "num_bathrooms": 1,
                "amenities": "WiFi,Smart TV,Work Desk",
                "status": 2,
                "beds": [{"bed_type": "Queen Bed", "quantity": 1}],
            },
            request_only=True,
        )
    ],
)
class PropertyTypeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertyTypeSerializer

    def get_queryset(self):
        # Only allow operations on the user's own property types
        return PropertyType.objects.filter(structure__user=self.request.user)


@extend_schema(
    tags=["property-type"],
    summary="List property types by structure ID",
    parameters=[
        OpenApiParameter(
            name="structure_id",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Filter by structure ID",
            required=True,
        )
    ],
    responses={
        200: PropertyTypeSerializer(many=True),
        403: OpenApiResponse(description="Forbidden"),
        404: OpenApiResponse(description="Structure not found"),
    },
    examples=[
        OpenApiExample(
            name="List Property Types by Structure",
            value=[
                {
                    "id": 1,
                    "structure": 1,
                    "name": "Deluxe Suite",
                    "internal_property_type_id": "DLX-001",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png",
                    "property_size_sqm": "45.5",
                    "max_guests": 4,
                    "num_sofa_beds": 1,
                    "num_bedrooms": 2,
                    "num_bathrooms": 1,
                    "amenities": "WiFi,TV,Air Conditioning,Mini Bar",
                    "status": 1,
                    "beds": [
                        {"id": 1, "bed_type": "King Bed", "quantity": 1},
                        {"id": 2, "bed_type": "Single Bed", "quantity": 2},
                    ],
                    "created_at": "2025-07-11T10:00:00Z",
                    "updated_at": "2025-07-11T10:00:00Z",
                }
            ],
            response_only=True,
        )
    ],
)
class PropertyTypeByStructureView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertyTypeSerializer

    def get_queryset(self):
        structure_id = self.request.query_params.get("structure_id")
        if not structure_id:
            raise serializers.ValidationError("structure_id parameter is required")

        return PropertyType.objects.filter(
            structure_id=structure_id,
            structure__user=self.request.user,  # Ensure user owns the structure
        )


@extend_schema(
    tags=["property"],
    summary="List and create properties",
    responses={
        200: PropertySerializer(many=True),
        201: PropertySerializer,
        403: OpenApiResponse(description="Forbidden"),
    },
    examples=[
        OpenApiExample(
            name="Create Property",
            value={
                "structure": 1,
                "property_type": 2,
                "name": "Room A-101",
                "internal_property_id": "A-101",
                "floor_number": 1,
                "amenities": "WiFi,TV,Mini Bar",
            },
            request_only=True,
        )
    ],
)
class PropertyListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertySerializer

    def get_queryset(self):
        # Only show properties for structures the user owns
        return Property.objects.filter(structure__user=self.request.user)

    def perform_create(self, serializer):
        # Ensure the provided structure/property_type belongs to the user
        serializer.save()


@extend_schema(
    tags=["property"],
    summary="Retrieve, update, and delete a property",
    responses={
        200: PropertySerializer,
        204: None,
        403: OpenApiResponse(description="Forbidden"),
    },
    examples=[
        OpenApiExample(
            name="Update Property",
            value={
                "structure": 1,
                "property_type": 2,
                "name": "Room A-101",
                "internal_property_id": "A-101",
                "floor_number": 1,
                "amenities": "WiFi,TV,Mini Bar",
            },
            request_only=True,
        )
    ],
)
class PropertyRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertySerializer

    def get_queryset(self):
        # Only allow operations on the user's own properties
        return Property.objects.filter(structure__user=self.request.user)
