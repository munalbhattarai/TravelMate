from rest_framework import serializers
from .models import Expense, ExpenseShare


class ExpenseShareSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = ExpenseShare
        fields = (
            "id",
            "user",
            "username",
            "amount_owed",
        )


class ExpenseSerializer(serializers.ModelSerializer):
    paid_by_username = serializers.ReadOnlyField(source="paid_by.username")
    shares = ExpenseShareSerializer(many=True, read_only=True)

    class Meta:
        model = Expense
        fields = (
            "id",
            "trip",
            "paid_by",
            "paid_by_username",
            "amount",
            "description",
            "category",
            "shares",
            "created_at",
        )
        read_only_fields = (
            "id",
            "paid_by",
            "created_at",
        )


class ExpenseCreateSerializer(serializers.ModelSerializer):
    participant_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
    )

    class Meta:
        model = Expense
        fields = (
            "id",
            "trip",
            "amount",
            "description",
            "category",
            "participant_ids",
        )
