from .models import Trip, TripMembership, Itinerary
from rest_framework import serializers

class TripSerializer(serializers.ModelSerializer):
    creator = serializers.ReadOnlyField(source="creator.username")
    destination_name = serializers.ReadOnlyField(source="destination.name")

    class Meta:
        model = Trip
        fields = (
            "id",
            "creator",
            "destination",
            "destination_name",
            "title",
            "description",
            "start_date",
            "end_date",
            "travel_style",
            "transport",
            "accommodation",
            "budget",
            "max_members",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "creator",
            "status",
            "created_at",
            "updated_at",
        )

class TripMembershipSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")
    trip = serializers.ReadOnlyField(source="trip_id")

    class Meta:
        model = TripMembership
        fields = (
            "id",
            "trip",
            "user",
            "status",
            "joined_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "trip",
            "user",
            "status",
            "joined_at",
            "created_at",
            "updated_at",
        )

class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = (
            "id",
            "trip",
            "day_number",
            "title",
            "description",
            "activities",
            "accommodation",
            "notes",
        )
        read_only_fields = ("id",)