from rest_framework import serializers
from .models import Block, Report, Verification


class BlockSerializer(serializers.ModelSerializer):
    blocker_username = serializers.ReadOnlyField(source="blocker.username")
    blocked_username = serializers.ReadOnlyField(source="blocked.username")

    class Meta:
        model = Block
        fields = (
            "id",
            "blocker",
            "blocker_username",
            "blocked",
            "blocked_username",
            "created_at",
        )
        read_only_fields = (
            "id",
            "blocker",
            "created_at",
        )

    def validate_blocked(self, value):
        request = self.context.get("request")
        if request and value == request.user:
            raise serializers.ValidationError("You cannot block yourself.")
        return value


class ReportSerializer(serializers.ModelSerializer):
    reporter_username = serializers.ReadOnlyField(source="reporter.username")

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
        read_only_fields = (
            "id",
            "reporter",
            "status",
            "created_at",
            "resolved_at",
        )


class VerificationSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = Verification
        fields = (
            "id",
            "user",
            "username",
            "status",
            "submitted_at",
            "reviewed_at",
            "notes",
        )
        read_only_fields = (
            "id",
            "user",
            "status",
            "submitted_at",
            "reviewed_at",
            "notes",
        )
