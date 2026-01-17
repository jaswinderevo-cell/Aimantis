from django.urls import path
from .views import (
    BlockedPeriodCreateView,
    BlockedPeriodListView,
    BlockedPeriodDetailView,
    BlockedPeriodUpdateView,
    BlockedPeriodRetrieveView,
)

urlpatterns = [
    path("", BlockedPeriodListView.as_view(), name="blocked-period-list"),
    path("create/", BlockedPeriodCreateView.as_view(), name="blocked-period-create"),

    # GET single blocked period
    path("<int:pk>/detail/", BlockedPeriodRetrieveView.as_view(), name="blocked-period-retrieve"),

    # UPDATE (PUT / PATCH)
    path("<int:pk>/edit/", BlockedPeriodUpdateView.as_view(), name="blocked-period-update"),

    # DELETE
    path("<int:pk>/", BlockedPeriodDetailView.as_view(), name="blocked-period-detail"),
]
