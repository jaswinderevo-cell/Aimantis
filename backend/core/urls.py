"""
URL configuration for app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    # API Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),  
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    # User/auth endpoints
    path("api/", include("users.urls")),
    path("api/structures/", include("structures.urls")),
    path("api/", include("properties.urls")),
    path("auth/", include("django.contrib.auth.urls")),
    path("api/rates/", include("rates.urls")),
    path("api/bookings/", include("bookings.urls")),
    path("api/guests/", include("guests.urls")),
    path("api/availability/", include("availability.urls")),
    path("api/checkin/", include("checkin.urls")),
    path('api/dashboard/', include('dashboard.urls'))
]

