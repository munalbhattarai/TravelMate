from django.conf import settings
from django.db import models


class Notification(models.Model):
    class NotificationType(models.TextChoices):
        REQUEST_RECEIVED = "request_received", "Request Received"
        REQUEST_ACCEPTED = "request_accepted", "Request Accepted"
        REQUEST_REJECTED = "request_rejected", "Request Rejected"
        NEW_MESSAGE = "new_message", "New Message"
        TRIP_UPDATED = "trip_updated", "Trip Updated"
        TRIP_CANCELLED = "trip_cancelled", "Trip Cancelled"
        REVIEW_RECEIVED = "review_received", "Review Received"
        VERIFICATION_APPROVED = "verification_approved", "Verification Approved"
        VERIFICATION_REJECTED = "verification_rejected", "Verification Rejected"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    type = models.CharField(
        max_length=30,
        choices=NotificationType.choices,
    )
    payload = models.JSONField(default=dict, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "is_read"]),
            models.Index(fields=["user", "-created_at"]),
        ]

    def __str__(self):
        return f"Notification({self.type}) for {self.user.username}"
