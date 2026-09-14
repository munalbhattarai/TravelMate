from collections import defaultdict
from decimal import Decimal
from django.db import transaction
from .models import Expense, ExpenseShare


def calculate_expense_balances(trip):
    """
    Computes net balances per member for a trip.
    Positive balance = should receive money.
    Negative balance = owes money.
    """
    balances = defaultdict(Decimal)
    for expense in trip.expenses.select_related("paid_by").prefetch_related("shares__user"):
        balances[expense.paid_by_id] += expense.amount
        for share in expense.shares.all():
            balances[share.user_id] -= share.amount_owed
    return dict(balances)


@transaction.atomic
def create_expense_with_split(
    *,
    trip,
    paid_by,
    amount,
    description,
    category,
    participant_ids,
):
    if not participant_ids:
        raise ValueError("At least one participant is required for an expense split.")

    expense = Expense.objects.create(
        trip=trip,
        paid_by=paid_by,
        amount=amount,
        description=description,
        category=category,
    )

    participant_ids = sorted(list(set(participant_ids)))
    count = len(participant_ids)
    amount_cents = int(amount * Decimal(100))
    base_cents = amount_cents // count
    remainder = amount_cents % count

    shares = []
    for idx, user_id in enumerate(participant_ids):
        user_cents = base_cents + (remainder if idx == 0 else 0)
        share_amount = Decimal(user_cents) / Decimal(100)
        shares.append(
            ExpenseShare(
                expense=expense,
                user_id=user_id,
                amount_owed=share_amount,
            )
        )

    ExpenseShare.objects.bulk_create(shares)
    return expense

