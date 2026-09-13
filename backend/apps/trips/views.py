from rest_framework.decorators import action
from rest_framework.response import Response
from .services import request_to_join
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
from .models import Trip, Itinerary, TripMembership


class TripViewSet(viewsets.ModelViewSet):
    
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description", "destination__name"]
    ordering_fields = ["start_date", "budget", "created_at"]
    ordering = ["start_date"]

    def get_queryset(self):
        queryset = Trip.objects.select_related("creator", "destination").all()
        params = self.request.query_params

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
        serializer.save(creator=self.request.user)

    @action(
    detail=True,
    methods=["get"],
    url_path="memberships",
)
    def memberships(self, request, pk=None):
        trip = self.get_object()

        if trip.creator != request.user:
            return Response(
                {"detail": "Only the trip creator can view membership requests."},
                status=status.HTTP_403_FORBIDDEN,
            )

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


class ItineraryViewSet(viewsets.ModelViewSet):
    serializer_class = ItinerarySerializer
    permission_classes = [permissions.IsAuthenticated]
    ordering = ["day_number"]

    def get_queryset(self):
        return Itinerary.objects.filter(
            trip_id=self.kwargs["trip_pk"]
        )

    def perform_create(self, serializer):
        serializer.save(trip_id=self.kwargs["trip_pk"])
        
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
