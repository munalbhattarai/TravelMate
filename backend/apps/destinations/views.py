from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets

from .models import Destination
from .serializers import DestinationSerializer
from rest_framework import filters, permissions, viewsets


class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = [
        "country",
        "region",
        "popular",
    ]

    search_fields = [
        "name",
        "country",
        "region",
        "description",
        "best_time_to_visit",
        "safety_info",
    ]

    ordering_fields = [
        "name",
        "country",
        "created_at",
        "updated_at",
    ]

    ordering = ["name"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]

        return [permission() for permission in permission_classes]