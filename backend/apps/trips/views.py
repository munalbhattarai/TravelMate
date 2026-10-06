from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import (
    filters,
    permissions,
    status,
    viewsets,
)
from .services import (
    accept_membership,
    cancel_membership_request,
    create_trip,
    leave_trip,
    reject_membership,
    request_to_join,
)
from rest_framework.views import APIView
from .serializers import TripMembershipSerializer, TripSerializer, ItinerarySerializer
from common.permissions import IsTripCreator, IsTripMember, IsOwnerOrReadOnly
from .models import Trip, Itinerary, TripMembership


class TripViewSet(viewsets.ModelViewSet):
    
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        if self.action in [
            "update",
            "partial_update",
            "destroy",
            "start",
            "complete",
            "cancel",
        ]:
            return [permissions.IsAuthenticated(), IsTripCreator()]
        return [permissions.IsAuthenticated()]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description", "destination__name"]
    ordering_fields = ["start_date", "budget", "created_at"]
    ordering = ["start_date"]

    def get_queryset(self):
        queryset = Trip.objects.select_related("creator", "destination").prefetch_related("memberships").all()
        params = self.request.query_params

        query = params.get("query")
        if query:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(destination__name__icontains=query)
            )

        destination = params.get("destination")
        if destination:
            queryset = queryset.filter(destination_id=destination)

        travel_style = params.get("travel_style")
        if travel_style:
            queryset = queryset.filter(travel_style__iexact=travel_style)

        transport = params.get("transport")
        if transport:
            queryset = queryset.filter(transport__iexact=transport)

        accommodation = params.get("accommodation")
        if accommodation:
            queryset = queryset.filter(accommodation__iexact=accommodation)

        min_budget = params.get("min_budget")
        if min_budget:
            queryset = queryset.filter(budget__gte=min_budget)

        max_budget = params.get("max_budget")
        if max_budget:
            queryset = queryset.filter(budget__lte=max_budget)

        status_param = params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param)

        return queryset

    def perform_create(self, serializer):
        trip = serializer.save(creator=self.request.user)
        TripMembership.objects.get_or_create(
            trip=trip,
            user=self.request.user,
            defaults={
                "status": TripMembership.Status.ACCEPTED,
                "joined_at": timezone.now(),
            },
        )

    @action(detail=True, methods=["post"], url_path="join")
    def join(self, request, pk=None):
        trip = self.get_object()
        try:
            membership = request_to_join(trip=trip, user=request.user)
        except ValueError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            TripMembershipSerializer(membership).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["get", "post"], url_path="requests")
    def requests(self, request, pk=None):
        trip = self.get_object()
        if request.method == "POST":
            try:
                membership = request_to_join(trip=trip, user=request.user)
            except ValueError as exc:
                return Response(
                    {"detail": str(exc)},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(
                TripMembershipSerializer(membership).data,
                status=status.HTTP_201_CREATED,
            )

        if trip.creator != request.user:
            return Response(
                {"detail": "Only the trip creator can view requests."},
                status=status.HTTP_403_FORBIDDEN,
            )
        memberships = TripMembership.objects.filter(
            trip=trip,
            status=TripMembership.Status.PENDING,
        ).select_related("user", "user__profile")
        return Response(
            TripMembershipSerializer(memberships, many=True).data,
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"], url_path=r"members/(?P<membership_id>\d+)/accept")
    def accept_member(self, request, pk=None, membership_id=None):
        membership = get_object_or_404(TripMembership, pk=membership_id, trip_id=pk)
        try:
            membership = accept_membership(membership=membership, accepted_by=request.user)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(TripMembershipSerializer(membership).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path=r"members/(?P<membership_id>\d+)/reject")
    def reject_member(self, request, pk=None, membership_id=None):
        membership = get_object_or_404(TripMembership, pk=membership_id, trip_id=pk)
        try:
            membership = reject_membership(membership=membership, rejected_by=request.user)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(TripMembershipSerializer(membership).data, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=["get"],
        url_path="memberships",
    )
    def memberships(self, request, pk=None):
        trip = self.get_object()

        memberships = TripMembership.objects.filter(
            trip=trip
        ).select_related("user", "user__profile")

        return Response(
            TripMembershipSerializer(memberships, many=True).data,
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"])
    def leave(self, request, pk=None):
        trip = self.get_object()
        try:
            leave_trip(trip=trip, user=request.user)
        except ValueError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"detail": "You have left the trip."},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"])
    def start(self, request, pk=None):
        trip = self.get_object()
        if trip.creator != request.user:
            return Response(
                {"detail": "Only the trip creator can start this trip."},
                status=status.HTTP_403_FORBIDDEN,
            )
        if trip.status not in [Trip.Status.OPEN, Trip.Status.FULL]:
            return Response(
                {"detail": "Only open or full trips can be started."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        trip.status = Trip.Status.ONGOING
        trip.save(update_fields=["status", "updated_at"])
        return Response(TripSerializer(trip).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        trip = self.get_object()
        if trip.creator != request.user:
            return Response(
                {"detail": "Only the trip creator can mark this trip completed."},
                status=status.HTTP_403_FORBIDDEN,
            )
        if trip.status != Trip.Status.ONGOING:
            return Response(
                {"detail": "Only ongoing trips can be completed."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        trip.status = Trip.Status.COMPLETED
        trip.save(update_fields=["status", "updated_at"])
        return Response(TripSerializer(trip).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        trip = self.get_object()
        if trip.creator != request.user:
            return Response(
                {"detail": "Only the trip creator can cancel this trip."},
                status=status.HTTP_403_FORBIDDEN,
            )
        if trip.status in [Trip.Status.COMPLETED, Trip.Status.CANCELLED]:
            return Response(
                {"detail": "Cannot cancel a completed or already cancelled trip."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        trip.status = Trip.Status.CANCELLED
        trip.save(update_fields=["status", "updated_at"])
        return Response(TripSerializer(trip).data, status=status.HTTP_200_OK)



class ItineraryViewSet(viewsets.ModelViewSet):
    serializer_class = ItinerarySerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy", "reorder"]:
            return [permissions.IsAuthenticated(), IsTripMember()]
        return [permissions.IsAuthenticated()]

    ordering = ["day_number"]

    def get_queryset(self):
        return Itinerary.objects.filter(
            trip_id=self.kwargs["trip_pk"]
        )

    def perform_create(self, serializer):
        serializer.save(trip_id=self.kwargs["trip_pk"])
    @action(detail=True, methods=["post"])
    def reorder(self, request, pk=None, trip_pk=None):
        from .services import reorder_itinerary_items
        itinerary = self.get_object()
        item_orders = request.data.get("items", [])
        reorder_itinerary_items(itinerary=itinerary, item_orders=item_orders)
        return Response({"status": "items reordered successfully"})

        
class AcceptMembershipView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, membership_id):
        try:
            membership = TripMembership.objects.get(pk=membership_id)
        except TripMembership.DoesNotExist:
            return Response(
                {"detail": "Membership request not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            membership = accept_membership(
                membership=membership,
                accepted_by=request.user,
            )
        except ValueError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            TripMembershipSerializer(membership).data,
            status=status.HTTP_200_OK,
        )
        
class RejectMembershipView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, membership_id):
        try:
            membership = TripMembership.objects.get(pk=membership_id)
        except TripMembership.DoesNotExist:
            return Response(
                {"detail": "Membership request not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            membership = reject_membership(
                membership=membership,
                rejected_by=request.user,
            )
        except ValueError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            TripMembershipSerializer(membership).data,
            status=status.HTTP_200_OK,
        )


class CancelMembershipView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, membership_id):
        try:
            membership = TripMembership.objects.get(pk=membership_id)
        except TripMembership.DoesNotExist:
            return Response(
                {"detail": "Membership request not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            cancel_membership_request(
                membership=membership,
                user=request.user,
            )
        except ValueError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"detail": "Membership request cancelled successfully."},
            status=status.HTTP_200_OK,
        )
