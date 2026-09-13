from django.urls import path
from .views import TripMatchesView

urlpatterns = [
    path("matches/", TripMatchesView.as_view(), name="trip-matches"),
]
