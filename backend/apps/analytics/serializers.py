from rest_framework import serializers


class DashboardSummarySerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    verified_users = serializers.IntegerField()
    total_trips = serializers.IntegerField()
    active_trips = serializers.IntegerField()
    completed_trips = serializers.IntegerField()
    pending_reports = serializers.IntegerField()
    pending_verifications = serializers.IntegerField()
