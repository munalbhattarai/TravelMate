from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import TravelPreference, Profile
from .services import register_user

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
        return register_user(**validated_data)
    
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
        read_only_fields = (
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
    profile = ProfileSerializer()
    travel_preference = TravelPreferenceSerializer()

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

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", {})
        preference_data = validated_data.pop("travel_preference", {})

        # Update User
        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.save()

        # Update Profile
        profile = instance.profile

        for field, value in profile_data.items():
            setattr(profile, field, value)

        profile.save()

        # Update Travel Preferences
        preference = instance.travel_preference

        for field, value in preference_data.items():
            setattr(preference, field, value)

        preference.save()

        return instance