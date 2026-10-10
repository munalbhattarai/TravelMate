from .models import Trip, TripMembership, Itinerary, ItineraryItem
from rest_framework import serializers

class TripSerializer(serializers.ModelSerializer):
    creator = serializers.ReadOnlyField(source="creator.username")
    creator_id = serializers.ReadOnlyField(source="creator.id")
    creator_role = serializers.ReadOnlyField(source="creator.role")
    destination_name = serializers.ReadOnlyField(source="destination.name")
    destination_latitude = serializers.ReadOnlyField(source="destination.latitude")
    destination_longitude = serializers.ReadOnlyField(source="destination.longitude")
    destination_region = serializers.ReadOnlyField(source="destination.region")
    current_members = serializers.SerializerMethodField()

    def get_current_members(self, obj):
        return obj.memberships.filter(status='accepted').count()

    class Meta:
        model = Trip
        fields = (
            "id",
            "creator",
            "creator_id",
            "creator_role",
            "destination",
            "destination_name",
            "destination_latitude",
            "destination_longitude",
            "destination_region",
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
            "current_members",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "creator",
            "creator_id",
            "creator_role",
            "status",
            "created_at",
            "updated_at",
        )

class TripMembershipSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")
    user_id = serializers.ReadOnlyField(source="user.id")
    user_role = serializers.ReadOnlyField(source="user.role")
    trip = serializers.ReadOnlyField(source="trip_id")

    class Meta:
        model = TripMembership
        fields = (
            "id",
            "trip",
            "user",
            "user_id",
            "user_role",
            "status",
            "joined_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "trip",
            "user",
            "user_id",
            "user_role",
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
