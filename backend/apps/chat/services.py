from django.db import transaction
from apps.trips.models import Trip, TripMembership
from .models import Conversation, Message


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


@transaction.atomic
def send_trip_message(*, trip, sender, content):
    if not content or not content.strip():
        raise ValueError("Message content cannot be empty.")

    if trip.status == Trip.Status.CANCELLED:
        raise ValueError("Cannot send messages in a cancelled trip.")

    if not verify_chat_membership(trip=trip, user=sender):
        raise ValueError("Only accepted trip members can send messages.")

    conversation = get_or_create_trip_conversation(trip)
    message = Message.objects.create(
        conversation=conversation,
        sender=sender,
        content=content.strip(),
    )
    return message
