from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Review(models.Model):
    trip = models.ForeignKey(
        "trips.Trip",
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews_given",
    )
    reviewed_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews_received",
        null=True,
        blank=True,
    )
    rating = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5),
        ],
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("trip", "reviewer", "reviewed_user")
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["trip"]),
            models.Index(fields=["reviewer"]),
            models.Index(fields=["reviewed_user"]),
            models.Index(fields=["rating"]),
        ]

    def __str__(self):
        return f"{self.reviewer.username} - {self.trip.title} ({self.rating}/5)"
