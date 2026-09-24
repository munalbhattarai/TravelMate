from rest_framework import permissions, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Notification
from .serializers import NotificationSerializer


class NotificationPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 50


class NotificationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = Notification.objects.filter(user=request.user)
        unread = request.query_params.get("unread")
        if unread and unread.lower() in ["true", "1"]:
            qs = qs.filter(is_read=False)

        paginator = NotificationPagination()
        page = paginator.paginate_queryset(qs, request)
        serializer = NotificationSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)


class NotificationMarkReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, notification_id):
        notification = get_object_or_404(
            Notification,
            pk=notification_id,
            user=request.user,
        )
        notification.is_read = True
        notification.save(update_fields=["is_read"])
        return Response(
            NotificationSerializer(notification).data,
            status=status.HTTP_200_OK,
        )


class NotificationMarkAllReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        updated_count = Notification.objects.filter(
            user=request.user,
            is_read=False,
        ).update(is_read=True)
        return Response(
            {"detail": f"{updated_count} notifications marked as read."},
            status=status.HTTP_200_OK,
        )
