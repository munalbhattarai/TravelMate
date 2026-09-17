from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from common.permissions import IsTripMember, IsOwnerOrReadOnly
from apps.trips.models import Trip
from .models import Expense
from .serializers import ExpenseSerializer, ExpenseCreateSerializer
from .services import calculate_expense_balances, create_expense_with_split


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = (
        Expense.objects.select_related("paid_by", "trip")
        .prefetch_related("shares__user")
        .all()
    )
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == "create":
            return ExpenseCreateSerializer
        return ExpenseSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        trip_id = self.request.query_params.get("trip")
        if trip_id:
            qs = qs.filter(trip_id=trip_id)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            expense = create_expense_with_split(
                trip=data["trip"],
                paid_by=request.user,
                amount=data["amount"],
                description=data["description"],
                category=data.get("category", Expense.Category.OTHER),
                participant_ids=data["participant_ids"],
            )
        except ValueError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        output_serializer = ExpenseSerializer(expense)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["get"])
    def balances(self, request):
        trip_id = request.query_params.get("trip")
        if not trip_id:
            return Response(
                {"detail": "Query parameter 'trip' is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        trip = get_object_or_404(Trip, pk=trip_id)
        balances = calculate_expense_balances(trip)
        formatted = [
            {"user_id": uid, "balance": str(bal)}
            for uid, bal in balances.items()
        ]
        return Response({"balances": formatted}, status=status.HTTP_200_OK)
