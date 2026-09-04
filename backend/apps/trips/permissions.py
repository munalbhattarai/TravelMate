from rest_framework import permissions


class IsTripCreator(permissions.BasePermission):
    """
    Only the trip creator can update or delete the trip.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.creator == request.user


class IsTripCreatorOrReadOnly(permissions.BasePermission):
    """
    Allow read access to anyone authenticated,
    but only the creator can modify.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.creator == request.user
