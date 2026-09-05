from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    reviewer = serializers.ReadOnlyField(source="reviewer.username")

    class Meta:
        model = Review
        fields = (
            "id",
            "trip",
            "reviewer",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "reviewer",
            "created_at",
            "updated_at",
        )
