from django.conf import settings
from django.db import models


class Block(models.Model):
    blocker = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="blocking",
    )
    blocked = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="blocked_by",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("blocker", "blocked")
        indexes = [
            models.Index(fields=["blocker"]),
            models.Index(fields=["blocked"]),
        ]

    def __str__(self):
        return f"{self.blocker.username} blocked {self.blocked.username}"


class Report(models.Model):
    class TargetType(models.TextChoices):
        USER = "user", "User"
        TRIP = "trip", "Trip"
        MESSAGE = "message", "Message"
        REVIEW = "review", "Review"

    class Category(models.TextChoices):
        HARASSMENT = "harassment", "Harassment"
        SPAM = "spam", "Spam"
        FRAUD = "fraud", "Fraud"
        FAKE_PROFILE = "fake_profile", "Fake Profile"
        INAPPROPRIATE_CONTENT = "inappropriate_content", "Inappropriate Content"
        SAFETY_CONCERN = "safety_concern", "Safety Concern"
        OTHER = "other", "Other"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        INVESTIGATING = "investigating", "Investigating"
        RESOLVED = "resolved", "Resolved"
        REJECTED = "rejected", "Rejected"

    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reports_filed",
    )
    target_type = models.CharField(
        max_length=20,
        choices=TargetType.choices,
    )
    target_id = models.PositiveIntegerField()
    category = models.CharField(
        max_length=30,
        choices=Category.choices,
    )
    detail = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["target_type", "target_id"]),
            models.Index(fields=["reporter"]),
        ]

    def __str__(self):
        return f"Report #{self.id} by {self.reporter.username} ({self.status})"

