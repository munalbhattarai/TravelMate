from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from apps.trips.models import Trip
from .serializers import MatchCandidateSerializer
from .services import match_users_for_trip


class TripMatchesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        trip_id = request.query_params.get("trip")
        if trip_id:
            trip = get_object_or_404(
                Trip.objects.select_related("destination", "creator"),
                pk=trip_id,
            )
        else:
            trip = (
                Trip.objects.select_related("destination", "creator")
                .filter(creator=request.user)
                .first()
            )
            if not trip:
                trip = (
                    Trip.objects.select_related("destination", "creator")
                    .filter(status=Trip.Status.OPEN)
                    .first()
                )
            if not trip:
                trip = (
                    Trip.objects.select_related("destination", "creator")
                    .first()
                )
            if not trip:
                return Response([], status=status.HTTP_200_OK)

        matches = match_users_for_trip(trip, request.user)
        serializer = MatchCandidateSerializer(matches, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
