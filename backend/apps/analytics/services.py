from django.contrib.auth import get_user_model
from apps.trips.models import Trip
from apps.moderation.models import Report, Verification

User = get_user_model()


def get_dashboard_summary():
    total_users = User.objects.filter(is_active=True).count()
    total_trips = Trip.objects.count()
    completed_trips = Trip.objects.filter(status=Trip.Status.COMPLETED).count()
    active_trips = Trip.objects.filter(
        status__in=[
            Trip.Status.OPEN,
            Trip.Status.FULL,
            Trip.Status.IN_PROGRESS,
        ]
    ).count()
    pending_reports = Report.objects.filter(
        status=Report.Status.PENDING
    ).count()
    verified_users = User.objects.filter(
        profile__verification_status="verified"
    ).count()
    pending_verifications = Verification.objects.filter(
        status=Verification.Status.PENDING
    ).count()

    return {
        "total_users": total_users,
        "verified_users": verified_users,
        "total_trips": total_trips,
        "active_trips": active_trips,
        "completed_trips": completed_trips,
        "pending_reports": pending_reports,
        "pending_verifications": pending_verifications,
    }
