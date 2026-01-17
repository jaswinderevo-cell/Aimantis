from calendar import monthrange
from datetime import date, timedelta
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from properties.models import Property
from .models import Rate
from .serializers import (
    RatesCalendarSerializer,
    BulkPriceChangeSerializer,
    SimplifiedRateUpdateSerializer,
    RateDetailSerializer,
)

# Compute defaults once at import time
_today = timezone.localdate()
_DEFAULT_YEAR = _today.year
_DEFAULT_MONTH = _today.month


# -------------------------
# Rates Calendar View
# -------------------------
@extend_schema(
    tags=["rates"],
    summary="Get calendar rates by month and year",
    description="Returns all property rates for the specified year and month. Defaults to current month/year.",
    parameters=[
        OpenApiParameter("year", type=int, location=OpenApiParameter.QUERY, required=False, default=_DEFAULT_YEAR),
        OpenApiParameter("month", type=int, location=OpenApiParameter.QUERY, required=False, default=_DEFAULT_MONTH),
    ],
    responses={200: RatesCalendarSerializer(many=True), 403: OpenApiResponse(description="Forbidden")},
)
class RatesCalendarView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        year = int(request.query_params.get("year", _DEFAULT_YEAR))
        month = int(request.query_params.get("month", _DEFAULT_MONTH))
        first_day = date(year, month, 1)
        last_day = date(year, month, monthrange(year, month)[1])

        rates_qs = (
            Rate.objects.select_related("property", "booking_ref")
            .filter(date__gte=first_day, date__lte=last_day)
            .order_by("property_id", "date")
        )

        data = {}
        for r in rates_qs:
            pid = r.property_id
            if pid not in data:
                data[pid] = {
                    "property_id": pid,
                    "property_name": r.property.name,
                    "property_type": r.property.property_type.id,
                    "structure": r.property.structure.id,
                    "rates": [],
                }

            data[pid]["rates"].append({
                "date": r.date,
                "minNights": r.min_nights,
                "basePrice": float(r.base_price),
                "airbnb": float(r.airbnb or 0),
                "booking": float(r.booking or 0),
                "expedia": float(r.experia or 0),
                "is_booked": r.is_booked,
                "booking_id": r.booking_ref.id if r.booking_ref else None,
            })

        serializer = RatesCalendarSerializer(list(data.values()), many=True)
        return Response(serializer.data)


# -------------------------
# Bulk Price Change View
# -------------------------
@extend_schema(
    tags=["rates"],
    summary="Apply a bulk price change",
    request=BulkPriceChangeSerializer,
    responses={200: OpenApiResponse(description="Prices updated successfully"),
               400: OpenApiResponse(description="Validation errors")},
)
class BulkPriceChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BulkPriceChangeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            result = serializer.save()
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"success": False, "message": "Failed to apply bulk price change", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# -------------------------
# Simplified Single Rate Update
# -------------------------
@extend_schema(
    tags=["rates"],
    summary="Update single property rate (simplified)",
    request=SimplifiedRateUpdateSerializer,
    responses={200: RateDetailSerializer, 201: RateDetailSerializer, 400: OpenApiResponse(description="Validation errors")},
)
class SimplifiedSingleRateUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SimplifiedRateUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "message": "Validation failed", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            result = serializer.save()
            rate = result["rate"]
            created = result["created"]

            status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
            action = "created" if created else "updated"

            response_serializer = RateDetailSerializer(rate)
            return Response(
                {
                    "success": True,
                    "message": f"Rate {action} successfully",
                    "action": action,
                    "data": response_serializer.data,
                },
                status=status_code,
            )
        except Exception as e:
            return Response(
                {"success": False, "message": "Failed to update rate", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

       
