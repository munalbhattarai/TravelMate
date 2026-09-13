from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    AcceptMembershipView,
    CancelMembershipView,
    RejectMembershipView,
    ItineraryViewSet,
    TripViewSet,
)


router = DefaultRouter()
router.register("trips", TripViewSet, basename="trip")

trip_router = DefaultRouter()
trip_router.register(
    "itineraries",
    ItineraryViewSet,
    basename="trip-itinerary",
)

urlpatterns = router.urls + [
    path(
        "trips/<int:trip_pk>/",
        include(trip_router.urls),
    ),
    path(
        "memberships/<int:membership_id>/accept/",
        AcceptMembershipView.as_view(),
        name="accept-membership",
    ),
    path(
        "memberships/<int:membership_id>/reject/",
        RejectMembershipView.as_view(),
        name="reject-membership",
    ),
    path(
        "memberships/<int:membership_id>/cancel/",
        CancelMembershipView.as_view(),
        name="cancel-membership",
    ),
]
