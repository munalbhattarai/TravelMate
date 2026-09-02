from django.db import models

class Destination(models.Model):
    name = models.CharField(max_length=150)
    country = models.CharField(max_length=100)
    region = models.CharField(max_length=100, blank=True)

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )

    description = models.TextField(blank=True)

    popular = models.BooleanField(default=False)

    cover_image = models.ImageField(
        upload_to="destinations/",
        blank=True,
        null=True,
    )

    activities = models.JSONField(
        default=list,
        blank=True,
    )

    safety_info = models.TextField(blank=True)

    best_time_to_visit = models.CharField(
        max_length=150,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        indexes = [
            models.Index(fields=["country"]),
            models.Index(fields=["popular"]),
        ]

    def __str__(self):
        return f"{self.name}, {self.country}"