from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import BlockViewSet, ReportViewSet, VerificationView

router = DefaultRouter()
router.register("blocks", BlockViewSet, basename="block")
router.register("reports", ReportViewSet, basename="report")

urlpatterns = router.urls + [
    path("verification/", VerificationView.as_view(), name="verification-request"),
]
