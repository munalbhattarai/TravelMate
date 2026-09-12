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

def calculate_interest_score(*, user, trip):
    user_interests = user.travel_preference.interests
    trip_activities = trip.destination.activities

    if not user_interests or not trip_activities:
        return 0

    user_set = {
        str(item).strip().lower()
        for item in user_interests
    }

    activity_set = {
        str(item).strip().lower()
        for item in trip_activities
    }

    matched_interests = user_set.intersection(activity_set)

    if not matched_interests:
        return 0

    match_percentage = (
        len(matched_interests) / len(user_set)
    ) * 100

    return round(match_percentage)

def calculate_travel_style_score(*, user, trip):
    preferred_styles = user.travel_preference.travel_styles
    trip_style = trip.travel_style

    if not preferred_styles or not trip_style:
        return 0

    preferred = {
        str(style).strip().lower()
        for style in preferred_styles
    }

    return 100 if trip_style.strip().lower() in preferred else 0

def calculate_transport_score(*, user, trip):
    preferred_transport = user.travel_preference.preferred_transport
    trip_transport = trip.transport

    if not preferred_transport or not trip_transport:
        return 0

    return (
        100
        if preferred_transport.strip().lower()
        == trip_transport.strip().lower()
        else 0
    )