from rest_framework.decorators import action
from rest_framework.response import Response
from .services import request_to_join
from rest_framework import (
    filters,
    permissions,
    status,
    viewsets,
)
from .serializers import TripMembershipSerializer, TripSerializer
from .models import Trip


class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description", "destination__name"]
    ordering_fields = ["start_date", "budget", "created_at"]
    ordering = ["start_date"]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=["post"])
    def join(self, request, pk=None):
        trip = self.get_object()

        try:
            membership = request_to_join(
                trip=trip,
                user=request.user,
            )
        except ValueError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            TripMembershipSerializer(membership).data,
            status=status.HTTP_201_CREATED,
        )