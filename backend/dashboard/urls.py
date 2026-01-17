from django.urls import path
from .views import DashboardWidgetsView

urlpatterns = [
    path("widgets", DashboardWidgetsView.as_view(), name="dashboard-widgets"),
]
