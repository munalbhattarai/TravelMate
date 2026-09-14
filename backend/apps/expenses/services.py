from collections import defaultdict
from decimal import Decimal
from .models import Expense


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
