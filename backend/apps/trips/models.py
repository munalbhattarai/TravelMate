from django.conf import settings
from django.db import models
from django.core.exceptions import ValidationError

class Trip(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        OPEN = "open", "Open"
        FULL = "full", "Full"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_trips",
    )

    destination = models.ForeignKey(
        "destinations.Destination",
        on_delete=models.PROTECT,
        related_name="trips",
    )

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    start_date = models.DateField()
    end_date = models.DateField()

    budget = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    max_members = models.PositiveIntegerField(default=2)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start_date", "-created_at"]
        indexes = [
            models.Index(fields=["destination"]),
            models.Index(fields=["creator"]),
            models.Index(fields=["status"]),
            models.Index(fields=["start_date"]),
        ]

    def clean(self):
        if self.end_date < self.start_date:
            raise ValidationError(
                {"end_date": "End date cannot be earlier than start date."}
            )

    def __str__(self):
        return self.title

class TripMembership(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACCEPTED = "accepted", "Accepted"
        REJECTED = "rejected", "Rejected"

    trip = models.ForeignKey(
        Trip,
        on_delete=models.CASCADE,
        related_name="memberships",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="trip_memberships",
    )
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )
    joined_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("trip", "user")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.trip.title} ({self.status})"

class Itinerary(models.Model):
    trip = models.ForeignKey(
        Trip,
        on_delete=models.CASCADE,
        related_name="itineraries",
    )
    day_number = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    activities = models.JSONField(default=list, blank=True)
    accommodation = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["trip", "day_number"]
        unique_together = ("trip", "day_number")

    def __str__(self):
        return f"Day {self.day_number} - {self.trip.title}"