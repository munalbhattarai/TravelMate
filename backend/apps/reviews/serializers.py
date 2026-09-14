from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    reviewer = serializers.ReadOnlyField(source="reviewer.username")
    reviewed_user_username = serializers.ReadOnlyField(
        source="reviewed_user.username"
    )

    class Meta:
        model = Review
        fields = (
            "id",
            "trip",
            "reviewer",
            "reviewed_user",
            "reviewed_user_username",
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

    def validate(self, attrs):
        request = self.context.get("request")
        if request and attrs.get("reviewed_user") == request.user:
            raise serializers.ValidationError(
                {"reviewed_user": "You cannot submit a review for yourself."}
            )
        return attrs
