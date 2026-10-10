from rest_framework import permissions
from apps.trips.models import TripMembership


class IsTripCreator(permissions.BasePermission):
    """
    Allows access to the creator of the trip or platform admins.
    """

    def has_object_permission(self, request, view, obj):
        if request.user and (request.user.is_staff or getattr(request.user, "role", None) == "admin"):
            return True
        creator = getattr(obj, "creator", None)
        return creator == request.user


class IsTripMember(permissions.BasePermission):
    """
    Allows access to accepted members of the trip (including creator and admins).
    """

    def has_object_permission(self, request, view, obj):
        if request.user and (request.user.is_staff or getattr(request.user, "role", None) == "admin"):
            return True
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
    Read-only for all, write permissions for owner or platform admins.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user and (request.user.is_staff or getattr(request.user, "role", None) == "admin"):
            return True
        owner = getattr(
            obj,
            "user",
            getattr(obj, "creator", getattr(obj, "paid_by", None)),
        )
        return owner == request.user
