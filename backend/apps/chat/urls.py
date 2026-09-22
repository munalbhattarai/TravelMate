from django.urls import path
from .views import TripMessageView

urlpatterns = [
    path("trips/<int:trip_id>/messages/", TripMessageView.as_view(), name="trip-messages"),
]
