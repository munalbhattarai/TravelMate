from apps.trips.models import Trip, TripMembership
from .models import Conversation


def get_or_create_trip_conversation(trip):
    conversation, _ = Conversation.objects.get_or_create(trip=trip)
    return conversation


def verify_chat_membership(*, trip, user):
    if trip.creator_id == user.id:
        return True
    return TripMembership.objects.filter(
        trip=trip,
        user=user,
        status=TripMembership.Status.ACCEPTED,
    ).exists()
