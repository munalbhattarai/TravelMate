from django.db import transaction
from django.utils import timezone
from .models import Trip, TripMembership

@transaction.atomic
def request_to_join(*, trip, user):
    trip = (
        Trip.objects
        .select_for_update()
        .get(pk=trip.pk)
    )

    if trip.creator_id == user.id:
        raise ValueError(
            "The trip creator cannot request to join their own trip."
        )

    if trip.status != Trip.Status.OPEN:
        raise ValueError(
            "Only open trips can accept join requests."
        )

    if TripMembership.objects.filter(
        trip=trip,
        user=user,
    ).exists():
        raise ValueError(
            "You already have a membership record for this trip."
        )

    return TripMembership.objects.create(
        trip=trip,
        user=user,
        status=TripMembership.Status.PENDING,
    )

    
@transaction.atomic
def accept_membership(*, membership, accepted_by):
    trip = (
        Trip.objects
        .select_for_update()
        .get(pk=membership.trip_id)
    )

    if trip.creator_id != accepted_by.id:
        raise ValueError(
            "Only the trip creator can accept join requests."
        )

    membership = (
        TripMembership.objects
        .select_for_update()
        .get(pk=membership.pk)
    )

    if membership.status != TripMembership.Status.PENDING:
        raise ValueError(
            "Only pending membership requests can be accepted."
        )

    accepted_count = TripMembership.objects.filter(
        trip=trip,
        status=TripMembership.Status.ACCEPTED,
    ).count()

    if accepted_count >= trip.max_members:
        raise ValueError(
            "This trip has reached its maximum member capacity."
        )

    membership.status = TripMembership.Status.ACCEPTED
    membership.joined_at = timezone.now()
    membership.save(
        update_fields=[
            "status",
            "joined_at",
            "updated_at",
        ]
    )

    if accepted_count + 1 >= trip.max_members:
        trip.status = Trip.Status.FULL
        trip.save(update_fields=["status", "updated_at"])

    return membership

@transaction.atomic
def create_trip(
    *,
    creator,
    destination,
    title,
    description,
    start_date,
    end_date,
    budget,
    max_members,
):
    trip = Trip(
        creator=creator,
        destination=destination,
        title=title,
        description=description,
        start_date=start_date,
        end_date=end_date,
        budget=budget,
        max_members=max_members,
    )

    trip.full_clean()
    trip.save()

    TripMembership.objects.create(
        trip=trip,
        user=creator,
        status=TripMembership.Status.ACCEPTED,
        joined_at=timezone.now(),
    )

    return trip

@transaction.atomic
def reject_membership(*, membership, rejected_by):
    trip = Trip.objects.select_for_update().get(pk=membership.trip_id)

    if trip.creator_id != rejected_by.id:
        raise ValueError("Only the trip creator can reject join requests.")

    membership = TripMembership.objects.select_for_update().get(
        pk=membership.pk
    )

    if membership.status != TripMembership.Status.PENDING:
        raise ValueError("Only pending membership requests can be rejected.")

    membership.status = TripMembership.Status.REJECTED
    membership.save(update_fields=["status", "updated_at"])

    return membership


@transaction.atomic
def cancel_membership_request(*, membership, user):
    if membership.user_id != user.id:
        raise ValueError("You can only cancel your own membership requests.")

    membership = TripMembership.objects.select_for_update().get(pk=membership.pk)

    if membership.status != TripMembership.Status.PENDING:
        raise ValueError("Only pending requests can be cancelled.")

    membership.delete()
    return True


@transaction.atomic
def leave_trip(*, trip, user):
    if trip.creator_id == user.id:
        raise ValueError("Trip creator cannot leave their own trip.")

    membership = TripMembership.objects.select_for_update().filter(
        trip=trip,
        user=user,
        status=TripMembership.Status.ACCEPTED,
    ).first()

    if not membership:
        raise ValueError("You are not an accepted member of this trip.")

    trip = Trip.objects.select_for_update().get(pk=trip.pk)
    if trip.status not in [Trip.Status.OPEN, Trip.Status.FULL]:
        raise ValueError("Cannot leave a trip that is already in progress or completed.")

    membership.delete()

    accepted_count = TripMembership.objects.filter(
        trip=trip,
        status=TripMembership.Status.ACCEPTED,
    ).count()

    if trip.status == Trip.Status.FULL and accepted_count < trip.max_members:
        trip.status = Trip.Status.OPEN
        trip.save(update_fields=["status", "updated_at"])

    return True