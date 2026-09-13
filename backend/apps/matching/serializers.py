from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class CandidateUserSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(source="profile.display_name", read_only=True)
    avatar = serializers.ImageField(source="profile.avatar", read_only=True)
    average_rating = serializers.DecimalField(
        source="profile.average_rating",
        max_digits=3,
        decimal_places=2,
        read_only=True,
    )
    verification_status = serializers.CharField(
        source="profile.verification_status",
        read_only=True,
    )

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "display_name",
            "avatar",
            "average_rating",
            "verification_status",
        )


class MatchBreakdownSerializer(serializers.Serializer):
    destination = serializers.BooleanField()
    dates = serializers.BooleanField()
    budget = serializers.BooleanField()
    interests = serializers.BooleanField()
    travel_style = serializers.BooleanField()
    transport = serializers.BooleanField()
    accommodation = serializers.BooleanField()
    language = serializers.BooleanField()


class MatchCandidateSerializer(serializers.Serializer):
    user = CandidateUserSerializer()
    score = serializers.IntegerField()
    breakdown = serializers.DictField()
    weights = serializers.DictField(required=False)
