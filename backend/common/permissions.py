from rest_framework import permissions
from apps.trips.models import TripMembership


class IsTripCreator(permissions.BasePermission):
    """
    Allows access only to the creator of the trip.
    """

    def has_object_permission(self, request, view, obj):
        creator = getattr(obj, "creator", None)
        return creator == request.user


class IsTripMember(permissions.BasePermission):
    """
    Allows access to accepted members of the trip (including creator).
    """

    def has_object_permission(self, request, view, obj):
        trip = getattr(obj, "trip", obj)
        if trip.creator == request.user:
            return True
        return TripMembership.objects.filter(
            trip=trip,
            user=request.user,
            status=TripMembership.Status.ACCEPTED,
        ).exists()


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Read-only for all, write permissions only for the owner.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        owner = getattr(
            obj,
            "user",
            getattr(obj, "creator", getattr(obj, "paid_by", None)),
        )
        return owner == request.user
