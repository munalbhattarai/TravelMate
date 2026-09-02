from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import TravelPreference, Profile
User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password",
        )

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        self.token = RefreshToken(attrs["refresh"])
        return attrs

    def save(self, **kwargs):
        self.token.blacklist()
        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = (
            "display_name",
            "bio",
            "avatar",
            "location",
            "verification_status",
            "average_rating",
            "trips_completed",
        )


class TravelPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelPreference
        fields = (
            "travel_styles",
            "interests",
            "preferred_transport",
            "preferred_accommodation",
            "budget_min",
            "budget_max",
            "preferred_duration_days",
            "preferred_destinations",
            "languages",
        )


class MeSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    travel_preference = TravelPreferenceSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "role",
            "profile",
            "travel_preference",
        )
        read_only_fields = (
            "id",
            "username",
            "role",
        )