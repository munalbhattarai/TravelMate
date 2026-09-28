try:
    from celery import shared_task
except ImportError:
    def shared_task(func):
        return func

from django.utils import timezone
from .models import Trip, TripMembership
from .services import auto_transition_trips


@shared_task
def task_auto_transition_trips():
    """
    Periodic daily task to progress trip statuses according to start/end dates.
    """
    counts = auto_transition_trips()
    return counts


@shared_task
def task_expire_stale_join_requests():
    """
    Marks pending join requests as rejected for trips that have reached start_date
    or are already full/cancelled.
    """
    today = timezone.now().date()
    stale_requests = TripMembership.objects.filter(
        status=TripMembership.Status.PENDING,
        trip__start_date__lte=today,
    )
    count = stale_requests.update(status=TripMembership.Status.REJECTED)
    return {"expired_join_requests": count}
