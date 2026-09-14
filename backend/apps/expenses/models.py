from django.conf import settings
from django.db import models


class Expense(models.Model):
    class Category(models.TextChoices):
        HOTEL = "hotel", "Hotel"
        FOOD = "food", "Food"
        TRANSPORT = "transport", "Transport"
        OTHER = "other", "Other"

    trip = models.ForeignKey(
        "trips.Trip",
        on_delete=models.CASCADE,
        related_name="expenses",
    )
    paid_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="expenses_paid",
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )
    description = models.CharField(max_length=255)
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.OTHER,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["trip"]),
            models.Index(fields=["paid_by"]),
        ]

    def __str__(self):
        return f"{self.description} ({self.amount})"
