try:
    from celery import shared_task
except ImportError:
    def shared_task(func):
        return func

from .services import auto_transition_trips

@shared_task
def task_auto_transition_trips():
    counts = auto_transition_trips()
    return counts
