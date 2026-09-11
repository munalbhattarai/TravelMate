def calculate_budget_score(*, user, trip):
    preference = user.travel_preference

    budget_min = preference.budget_min
    budget_max = preference.budget_max

    if budget_min is None or budget_max is None:
        return 0

    trip_budget = trip.budget

    if budget_min <= trip_budget <= budget_max:
        return 100

    if trip_budget < budget_min:
        difference = budget_min - trip_budget
    else:
        difference = trip_budget - budget_max

    budget_range = budget_max - budget_min

    if budget_range <= 0:
        return 0

    percentage_difference = (
        difference / budget_range
    ) * 100

    if percentage_difference <= 10:
        return 80

    if percentage_difference <= 25:
        return 60

    if percentage_difference <= 50:
        return 40

    if percentage_difference <= 75:
        return 20

    return 0