from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import TripViewSet, ItineraryViewSet


router = DefaultRouter()
router.register("trips", TripViewSet, basename="trip")

trip_router = DefaultRouter()
trip_router.register("itineraries", ItineraryViewSet, basename="trip-itinerary")

urlpatterns = router.urls + [
    path("trips/<int:trip_pk>/", include(trip_router.urls)),
]
