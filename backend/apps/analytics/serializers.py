from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.moderation.models import Report, Verification
from apps.trips.models import Trip

User = get_user_model()


class DashboardSummarySerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    verified_users = serializers.IntegerField()
    total_trips = serializers.IntegerField()
    active_trips = serializers.IntegerField()
    completed_trips = serializers.IntegerField()
    pending_reports = serializers.IntegerField()
    pending_verifications = serializers.IntegerField()


class DestinationStatSerializer(serializers.Serializer):
    destination = serializers.CharField()
    trip_count = serializers.IntegerField()


class PlatformAnalyticsSerializer(serializers.Serializer):
    popular_destinations = DestinationStatSerializer(many=True)
    trip_status_distribution = serializers.DictField(child=serializers.IntegerField(), required=False)
    average_companion_rating = serializers.FloatField()
    acceptance_rate_percentage = serializers.FloatField()
    completion_rate_percentage = serializers.FloatField()
    total_membership_requests = serializers.IntegerField()


class AdminUserSerializer(serializers.ModelSerializer):
    verification_status = serializers.CharField(source="profile.verification_status", read_only=True)
    display_name = serializers.CharField(source="profile.display_name", read_only=True)
    average_rating = serializers.FloatField(source="profile.average_rating", read_only=True)
    trips_completed = serializers.IntegerField(source="profile.trips_completed", read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "role",
            "is_active",
            "is_staff",
            "date_joined",
            "display_name",
            "verification_status",
            "average_rating",
            "trips_completed",
        )


class AdminVerificationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.CharField(source="user.email", read_only=True)
    display_name = serializers.CharField(source="user.profile.display_name", read_only=True)
    reviewer_username = serializers.CharField(source="reviewed_by.username", read_only=True, default=None)

    class Meta:
        model = Verification
        fields = (
            "id",
            "user",
            "username",
            "email",
            "display_name",
            "status",
            "submitted_at",
            "reviewed_by",
            "reviewer_username",
            "reviewed_at",
            "notes",
        )


class AdminReportSerializer(serializers.ModelSerializer):
    reporter_username = serializers.CharField(source="reporter.username", read_only=True)

    class Meta:
        model = Report
        fields = (
            "id",
            "reporter",
            "reporter_username",
            "target_type",
            "target_id",
            "category",
            "detail",
            "status",
            "created_at",
            "resolved_at",
        )


class AdminTripSerializer(serializers.ModelSerializer):
    creator_username = serializers.CharField(source="creator.username", read_only=True)
    destination_name = serializers.CharField(source="destination.name", read_only=True, default="Custom Trek")
    members_count = serializers.IntegerField(source="members.count", read_only=True)

    class Meta:
        model = Trip
        fields = (
            "id",
            "title",
            "status",
            "creator",
            "creator_username",
            "destination_name",
            "start_date",
            "end_date",
            "max_members",
            "members_count",
            "estimated_cost",
            "currency",
            "difficulty_level",
            "created_at",
        )
