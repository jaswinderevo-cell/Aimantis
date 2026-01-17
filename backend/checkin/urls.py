from django.urls import path
from .views import (
    CheckInTemplateListAPIView,
    LinkTemplateToStructureAPIView,
    StructureCheckInFormsAPIView,
    GetStructureCheckInFormAPIView,
    GetCheckInFormByBookingUIDAPIView,
    CreateCheckInTemplateAPIView,
    CheckInTemplateDetailAPIView,
    DefaultCheckInFieldsAPIView,
    UpdateCheckInTemplateAPIView,
    DeleteCheckInTemplateAPIView,
    UnlinkTemplateFromStructureAPIView,
    SubmitCheckInAPIView,
)

urlpatterns = [
    path("templates/", CheckInTemplateListAPIView.as_view()),
    path("templates/create/", CreateCheckInTemplateAPIView.as_view()),
    path("templates/link-structure/", LinkTemplateToStructureAPIView.as_view()),
    path("structures/", StructureCheckInFormsAPIView.as_view()),
    path("structure/<int:structure_id>/form/",GetStructureCheckInFormAPIView.as_view(),),
    path("booking/<uuid:uid>/form/",GetCheckInFormByBookingUIDAPIView.as_view(), name="checkin-form-by-booking-uid"),
    path("templates/<int:pk>/", CheckInTemplateDetailAPIView.as_view()),
    path("templates/<int:pk>/update/", UpdateCheckInTemplateAPIView.as_view()),
    path("templates/default-fields/", DefaultCheckInFieldsAPIView.as_view()),
    path("templates/<int:template_id>/delete/", DeleteCheckInTemplateAPIView.as_view()),
    path("templates/unlink-structure/",UnlinkTemplateFromStructureAPIView.as_view()),
    path("booking/<uuid:booking_uid>/", SubmitCheckInAPIView.as_view(), name="submit-checkin"),
]