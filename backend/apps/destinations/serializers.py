from rest_framework import serializers

from .models import Destination


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = (
            "id",
            "name",
            "country",
            "region",
            "latitude",
            "longitude",
            "description",
            "popular",
            "cover_image",
            "activities",
            "safety_info",
            "best_time_to_visit",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )