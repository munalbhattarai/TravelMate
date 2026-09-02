from django.contrib import admin

from .models import Profile, TravelPreference, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "role", "is_active")
    list_filter = ("role", "is_active")
    search_fields = ("username", "email")


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        "display_name",
        "user",
        "verification_status",
        "average_rating",
        "trips_completed",
    )
    list_filter = ("verification_status",)
    search_fields = ("display_name", "user__username")


@admin.register(TravelPreference)
class TravelPreferenceAdmin(admin.ModelAdmin):
    list_display = ("user", "preferred_transport", "preferred_accommodation")
    search_fields = ("user__username",)