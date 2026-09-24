from django.urls import path
from .views import (
    NotificationListView,
    NotificationMarkReadView,
    NotificationMarkAllReadView,
)

urlpatterns = [
    path("notifications/", NotificationListView.as_view(), name="notification-list"),
    path("notifications/<int:notification_id>/read/", NotificationMarkReadView.as_view(), name="notification-mark-read"),
    path("notifications/read-all/", NotificationMarkAllReadView.as_view(), name="notification-mark-all-read"),
]
