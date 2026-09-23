from .models import Notification


def notify(*, user, type, payload=None):
    if payload is None:
        payload = {}

    notification = Notification.objects.create(
        user=user,
        type=type,
        payload=payload,
    )
    return notification
