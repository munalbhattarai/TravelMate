from rest_framework import permissions, viewsets
from rest_framework.exceptions import ValidationError

from .models import Review
from .serializers import ReviewSerializer
from .services import recompute_reputation
from apps.trips.models import Trip


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.select_related("reviewer", "reviewed_user", "trip").all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    filterset_fields = ["trip", "rating"]
    search_fields = ["comment"]
    ordering_fields = ["rating", "created_at"]
    ordering = ["-created_at"]

    def perform_create(self, serializer):
        trip = serializer.validated_data["trip"]
        if trip.status != Trip.Status.COMPLETED:
            raise ValidationError(
                {"trip": "Reviews can only be submitted for completed trips."}
            )

        review = serializer.save(reviewer=self.request.user)
        if review.reviewed_user:
            recompute_reputation(review.reviewed_user)

    def get_queryset(self):
        qs = super().get_queryset()
        trip_id = self.request.query_params.get("trip")
        if trip_id:
            qs = qs.filter(trip_id=trip_id)
        user_id = self.request.query_params.get("user")
        if user_id:
            qs = qs.filter(reviewed_user_id=user_id)
        return qs
