from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets
from rest_framework.response import Response
from django.core.cache import cache

from .models import Destination
from .serializers import DestinationSerializer


class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer

    def list(self, request, *args, **kwargs):
        cache_key = f"dest_list_{request.get_full_path()}"
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            return Response(cached_data)
        response = super().list(request, *args, **kwargs)
        if response.status_code == 200:
            cache.set(cache_key, response.data, 300)
        return response

    def perform_create(self, serializer):
        cache.clear()
        super().perform_create(serializer)

    def perform_update(self, serializer):
        cache.clear()
        super().perform_update(serializer)

    def perform_destroy(self, instance):
        cache.clear()
        super().perform_destroy(instance)

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