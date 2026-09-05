from django.contrib import admin

from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("reviewer", "trip", "rating", "created_at")
    list_filter = ("rating",)
    search_fields = ("reviewer__username", "trip__title")
    ordering = ("-created_at",)
