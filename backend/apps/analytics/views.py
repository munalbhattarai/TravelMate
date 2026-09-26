from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .services import get_dashboard_summary, get_platform_analytics
from .serializers import DashboardSummarySerializer, PlatformAnalyticsSerializer


class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        data = get_dashboard_summary()
        serializer = DashboardSummarySerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminAnalyticsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        data = get_platform_analytics()
        serializer = PlatformAnalyticsSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)
