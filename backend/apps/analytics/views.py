from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.moderation.models import Report, Verification
from apps.trips.models import Trip
from .services import get_dashboard_summary, get_platform_analytics
from .serializers import (
    DashboardSummarySerializer,
    PlatformAnalyticsSerializer,
    AdminUserSerializer,
    AdminVerificationSerializer,
    AdminReportSerializer,
    AdminTripSerializer,
)

User = get_user_model()


class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        data = get_dashboard_summary()
        serializer = DashboardSummarySerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminAnalyticsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        data = get_platform_analytics()
        serializer = PlatformAnalyticsSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminUserListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        users = User.objects.all().select_related("profile").order_by("-date_joined")
        serializer = AdminUserSerializer(users, many=True)
        return Response(serializer.data)


class AdminUserDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        role = request.data.get("role")
        is_active = request.data.get("is_active")

        if role is not None and role in ["traveller", "guide", "admin"]:
            user.role = role
            if role == "admin":
                user.is_staff = True
        if is_active is not None:
            user.is_active = bool(is_active)

        user.save()
        serializer = AdminUserSerializer(user)
        return Response(serializer.data)


class AdminVerificationListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        verifications = (
            Verification.objects.all()
            .select_related("user", "user__profile", "reviewed_by")
            .order_by("-submitted_at")
        )
        serializer = AdminVerificationSerializer(verifications, many=True)
        return Response(serializer.data)


class AdminVerificationDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        try:
            verification = Verification.objects.select_related("user", "user__profile").get(pk=pk)
        except Verification.DoesNotExist:
            return Response({"detail": "Verification request not found."}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get("status")
        notes = request.data.get("notes", "")

        if new_status in [Verification.Status.VERIFIED, Verification.Status.REJECTED]:
            verification.status = new_status
            verification.notes = notes
            verification.reviewed_by = request.user
            verification.reviewed_at = timezone.now()
            verification.save()

            if new_status == Verification.Status.VERIFIED:
                if hasattr(verification.user, "profile"):
                    verification.user.profile.verification_status = "verified"
                    verification.user.profile.save(update_fields=["verification_status"])

        serializer = AdminVerificationSerializer(verification)
        return Response(serializer.data)


class AdminReportListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        reports = Report.objects.all().select_related("reporter").order_by("-created_at")
        serializer = AdminReportSerializer(reports, many=True)
        return Response(serializer.data)


class AdminReportDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        try:
            report = Report.objects.get(pk=pk)
        except Report.DoesNotExist:
            return Response({"detail": "Report not found."}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get("status")
        if new_status in [
            Report.Status.PENDING,
            Report.Status.INVESTIGATING,
            Report.Status.RESOLVED,
            Report.Status.REJECTED,
        ]:
            report.status = new_status
            if new_status in [Report.Status.RESOLVED, Report.Status.REJECTED]:
                report.resolved_at = timezone.now()
            report.save()

        serializer = AdminReportSerializer(report)
        return Response(serializer.data)


class AdminTripListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        trips = (
            Trip.objects.all()
            .select_related("creator", "destination")
            .prefetch_related("members")
            .order_by("-created_at")
        )
        serializer = AdminTripSerializer(trips, many=True)
        return Response(serializer.data)


class AdminTripDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        try:
            trip = Trip.objects.get(pk=pk)
        except Trip.DoesNotExist:
            return Response({"detail": "Trip not found."}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get("status")
        if new_status in [
            Trip.Status.OPEN,
            Trip.Status.FULL,
            Trip.Status.IN_PROGRESS,
            Trip.Status.COMPLETED,
            Trip.Status.CANCELLED,
        ]:
            trip.status = new_status
            trip.save(update_fields=["status"])

        serializer = AdminTripSerializer(trip)
        return Response(serializer.data)
