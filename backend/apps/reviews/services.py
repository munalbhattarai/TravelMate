from decimal import Decimal
from django.db.models import Avg, Count
from .models import Review


def recompute_reputation(user):
    profile = getattr(user, "profile", None)
    if not profile:
        return None

    stats = Review.objects.filter(reviewed_user=user).aggregate(
        avg_rating=Avg("rating"),
        total_reviews=Count("id"),
    )

    avg = stats["avg_rating"]
    profile.average_rating = (
        Decimal(str(round(avg, 2))) if avg is not None else Decimal("0.00")
    )
    profile.reviews_received = stats["total_reviews"] or 0
    profile.save(update_fields=["average_rating", "reviews_received", "updated_at"])

    return profile
