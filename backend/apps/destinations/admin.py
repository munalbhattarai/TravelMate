from django.contrib import admin

from .models import Destination


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "country",
        "region",
        "popular",
        "created_at",
    )

    list_filter = (
        "country",
        "popular",
    )

    search_fields = (
        "name",
        "country",
        "region",
    )

    ordering = (
        "name",
    )