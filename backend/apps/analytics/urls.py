from django.urls import path
from .views import (
    AdminDashboardView,
    AdminAnalyticsView,
    AdminUserListView,
    AdminUserDetailView,
    AdminVerificationListView,
    AdminVerificationDetailView,
    AdminReportListView,
    AdminReportDetailView,
    AdminTripListView,
    AdminTripDetailView,
)

urlpatterns = [
    path("admin/dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
    path("admin/analytics/", AdminAnalyticsView.as_view(), name="admin-analytics"),
    path("admin/users/", AdminUserListView.as_view(), name="admin-users"),
    path("admin/users/<int:pk>/", AdminUserDetailView.as_view(), name="admin-user-detail"),
    path("admin/verifications/", AdminVerificationListView.as_view(), name="admin-verifications"),
    path("admin/verifications/<int:pk>/", AdminVerificationDetailView.as_view(), name="admin-verification-detail"),
    path("admin/reports/", AdminReportListView.as_view(), name="admin-reports"),
    path("admin/reports/<int:pk>/", AdminReportDetailView.as_view(), name="admin-report-detail"),
    path("admin/trips/", AdminTripListView.as_view(), name="admin-trips"),
    path("admin/trips/<int:pk>/", AdminTripDetailView.as_view(), name="admin-trip-detail"),
]
