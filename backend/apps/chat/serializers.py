from rest_framework import serializers
from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.ReadOnlyField(source="sender.username")
    sender_avatar = serializers.ImageField(
        source="sender.profile.avatar",
        read_only=True,
    )

    class Meta:
        model = Message
        fields = (
            "id",
            "conversation",
            "sender",
            "sender_username",
            "sender_avatar",
            "content",
            "created_at",
        )
        read_only_fields = (
            "id",
            "conversation",
            "sender",
            "created_at",
        )


class ConversationSerializer(serializers.ModelSerializer):
    trip_title = serializers.ReadOnlyField(source="trip.title")
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = (
            "id",
            "trip",
            "trip_title",
            "messages",
            "created_at",
        )
        read_only_fields = (
            "id",
            "trip",
            "created_at",
        )
