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


def get_platform_analytics():
    from django.db.models import Avg, Count
    from apps.reviews.models import Review
    from apps.trips.models import TripMembership

    popular_destinations = [
        {
            "destination": item["destination__name"],
            "trip_count": item["trip_count"],
        }
        for item in Trip.objects.filter(destination__isnull=False)
        .values("destination__name")
        .annotate(trip_count=Count("id"))
        .order_by("-trip_count")[:5]
    ]

    trip_status_distribution = {
        item["status"]: item["count"]
        for item in Trip.objects.values("status").annotate(count=Count("id"))
    }

    avg_companion_rating = Review.objects.aggregate(avg=Avg("rating"))["avg"] or 0

    total_requests = TripMembership.objects.count()
    accepted_requests = TripMembership.objects.filter(
        status=TripMembership.Status.ACCEPTED
    ).count()
    acceptance_rate = (
        round((accepted_requests / total_requests) * 100, 1)
        if total_requests > 0
        else 0
    )

    total_trips = Trip.objects.count()
    completed_trips = Trip.objects.filter(status=Trip.Status.COMPLETED).count()
    completion_rate = (
        round((completed_trips / total_trips) * 100, 1)
        if total_trips > 0
        else 0
    )

    return {
        "popular_destinations": popular_destinations,
        "trip_status_distribution": trip_status_distribution,
        "average_companion_rating": round(float(avg_companion_rating), 2),
        "acceptance_rate_percentage": acceptance_rate,
        "completion_rate_percentage": completion_rate,
        "total_membership_requests": total_requests,
    }
