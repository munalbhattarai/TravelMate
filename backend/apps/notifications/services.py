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


def bulk_notify(recipients, type, payload=None):
    if not recipients:
        return
    if payload is None:
        payload = {}
    notifications = [
        Notification(
            user_id=u if isinstance(u, int) else u.id,
            type=type,
            payload=payload,
        )
        for u in recipients
    ]
    Notification.objects.bulk_create(notifications)
