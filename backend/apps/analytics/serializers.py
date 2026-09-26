from rest_framework import serializers


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
