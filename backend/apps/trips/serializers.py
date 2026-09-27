from .models import Trip, TripMembership, Itinerary, ItineraryItem
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
            "languages",
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

class ItineraryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryItem
        fields = (
            "id",
            "itinerary",
            "order",
            "time",
            "title",
            "description",
            "location_name",
            "latitude",
            "longitude",
            "created_at",
        )
        read_only_fields = ("id", "created_at")

class ItinerarySerializer(serializers.ModelSerializer):
    items = ItineraryItemSerializer(many=True, read_only=True)

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
            "items",
        )
        read_only_fields = ("id",)
