from django.conf import settings
from django.db import models


class Conversation(models.Model):
    trip = models.OneToOneField(
        "trips.Trip",
        on_delete=models.CASCADE,
        related_name="conversation",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation for {self.trip.title}"
