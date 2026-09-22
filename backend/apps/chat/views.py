from rest_framework import permissions, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from apps.trips.models import Trip
from .models import Message
from .serializers import MessageSerializer
from .services import (
    get_or_create_trip_conversation,
    send_trip_message,
    verify_chat_membership,
)


class MessagePagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = "page_size"
    max_page_size = 100


class TripMessageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, trip_id):
        trip = get_object_or_404(Trip, pk=trip_id)
        if not verify_chat_membership(trip=trip, user=request.user):
            return Response(
                {"detail": "Only trip members can view chat messages."},
                status=status.HTTP_403_FORBIDDEN,
            )

        conversation = get_or_create_trip_conversation(trip)
        messages = (
            Message.objects.filter(conversation=conversation)
            .select_related("sender", "sender__profile")
            .order_by("-created_at")
        )

        paginator = MessagePagination()
        page = paginator.paginate_queryset(messages, request)
        serializer = MessageSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request, trip_id):
        trip = get_object_or_404(Trip, pk=trip_id)
        content = request.data.get("content")
        try:
            message = send_trip_message(
                trip=trip,
                sender=request.user,
                content=content,
            )
        except ValueError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
