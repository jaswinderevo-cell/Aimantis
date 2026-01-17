from django.urls import path
from .views import (
    PropertyTypeListCreateView,
    PropertyTypeRetrieveUpdateDestroyView,
    PropertyListCreateView,
    PropertyRetrieveUpdateDestroyView,
    PropertyTypeByStructureView,
)

urlpatterns = [
    # Property Types
    path(
        "property-types/",
        PropertyTypeListCreateView.as_view(),
        name="property-type-list-create",
    ),
    path(
        "property-types/<int:pk>/",
        PropertyTypeRetrieveUpdateDestroyView.as_view(),
        name="property-type-detail",
    ),
    path(
        "property-types/by-structure/",
        PropertyTypeByStructureView.as_view(),
        name="property-types-by-structure",
    ),
    # Properties
    path("properties/", PropertyListCreateView.as_view(), name="property-list-create"),
    path(
        "properties/<int:pk>/",
        PropertyRetrieveUpdateDestroyView.as_view(),
        name="property-detail",
    ),
]
