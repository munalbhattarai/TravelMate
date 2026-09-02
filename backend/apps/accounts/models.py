from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    class Role(models.TextChoices):
        TRAVELLER = "traveller", "Traveller"
        GUIDE = "guide", "Guide"
        ADMIN = "admin", "Admin"
        
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=9,
        choices=Role.choices,
        default= Role.TRAVELLER,
    )
    
    def __str__(self):
        return self.username
    
class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    display_name = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(
        upload_to = "profiles/avatars",
        null=True,
        blank=True,
        )
    location = models.CharField(max_length=150, blank=True)
    
    class VerificationStatus(models.TextChoices):
        NOT_VERIFIED = "not_verified", "Not Verified"
        PENDING = "pending", "Pending"
        VERIFIED = "verified", "Verified"
        REJECTED = "rejected", "Rejected"
        
    verification_status = models.CharField(
            max_length=20,
            choices= VerificationStatus.choices,
            default=VerificationStatus.NOT_VERIFIED,   
        )
    average_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
    )
    trips_completed = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.display_name
    
class TravelPreference(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="travel_prefrence",
    )
    trevel_styles = models.JSONField(default=list, blank= True)
    interest = models.JSONField(default=list, blank=True)
    
    preferred_transport = models.CharField(
        max_length=100,
        blank=True,
    )
    preferred_accommodation = models.CharField(
        max_length=30,
        blank=True,
    )

    budget_min = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )
    budget_max = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )

    preferred_duration_days = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    preferred_destinations = models.JSONField(
        default=list,
        blank=True,
    )

    languages = models.JSONField(
        default=list,
        blank=True,
    )

    def __str__(self):
        return f"{self.user.username}'s travel preferences"