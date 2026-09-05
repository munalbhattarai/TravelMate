from django.contrib import admin

from .models import Trip, TripMembership, Itinerary


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ("title", "creator", "destination", "status", "start_date", "end_date")
    list_filter = ("status", "start_date")
    search_fields = ("title", "creator__username", "destination__name")
    ordering = ("-created_at",)


@admin.register(TripMembership)
class TripMembershipAdmin(admin.ModelAdmin):
    list_display = ("user", "trip", "status", "joined_at")
    list_filter = ("status",)
    search_fields = ("user__username", "trip__title")


@admin.register(Itinerary)
class ItineraryAdmin(admin.ModelAdmin):
    list_display = ("trip", "day_number", "title", "accommodation")
    list_filter = ("trip",)
    search_fields = ("title", "trip__title")
    ordering = ("trip", "day_number")
