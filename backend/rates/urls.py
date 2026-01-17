from django.urls import path
from .views import BulkPriceChangeView, RatesCalendarView, SimplifiedSingleRateUpdateView  
urlpatterns = [
    path("calendar/", RatesCalendarView.as_view(), name="rates-calendar"),
    path("bulk/", BulkPriceChangeView.as_view(), name="bulk-price-change"),

    path("update/", SimplifiedSingleRateUpdateView.as_view(), name="single-rate-update"),
]
