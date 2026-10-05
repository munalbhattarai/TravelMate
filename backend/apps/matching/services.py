from django.contrib.auth import get_user_model

User = get_user_model()


def calculate_budget_score(*, user, trip):
    preference = getattr(user, "travel_preference", None)
    if not preference or preference.budget_min is None or preference.budget_max is None:
        return 0

    budget_min = preference.budget_min
    budget_max = preference.budget_max

    trip_budget = getattr(trip, "budget", 0)
    if not trip_budget:
        return 0

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
    preference = getattr(user, "travel_preference", None)
    user_interests = getattr(preference, "interests", []) if preference else []
    trip_activities = getattr(trip.destination, "activities", []) if getattr(trip, "destination", None) else []

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
    preference = getattr(user, "travel_preference", None)
    preferred_styles = getattr(preference, "travel_styles", []) if preference else []
    trip_style = getattr(trip, "travel_style", "")

    if not preferred_styles or not trip_style:
        return 0

    preferred = {
        str(style).strip().lower()
        for style in preferred_styles
    }

    return 100 if trip_style.strip().lower() in preferred else 0

def calculate_transport_score(*, user, trip):
    preference = getattr(user, "travel_preference", None)
    preferred_transport = getattr(preference, "preferred_transport", "") if preference else ""
    trip_transport = getattr(trip, "transport", "")

    if not preferred_transport or not trip_transport:
        return 0

    return (
        100
        if preferred_transport.strip().lower()
        == trip_transport.strip().lower()
        else 0
    )

def calculate_accommodation_score(*, user, trip):
    preference = getattr(user, "travel_preference", None)
    preferred_accommodation = getattr(preference, "preferred_accommodation", "") if preference else ""
    trip_accommodation = getattr(trip, "accommodation", "")

    if not preferred_accommodation or not trip_accommodation:
        return 0

    return (
        100
        if preferred_accommodation.strip().lower()
        == trip_accommodation.strip().lower()
        else 0
    )

def calculate_destination_score(*, user, trip):
    preference = getattr(user, "travel_preference", None)
    preferred_destinations = getattr(preference, "preferred_destinations", []) if preference else []
    if not preferred_destinations or not getattr(trip, "destination", None):
        return 0

    preferred = {
        str(dest).strip().lower()
        for dest in preferred_destinations
    }

    dest_name = str(trip.destination.name).strip().lower()
    dest_id = str(trip.destination.id)

    return 100 if (dest_name in preferred or dest_id in preferred) else 0

def calculate_date_score(*, user, trip):
    preference = getattr(user, "travel_preference", None)
    preferred_duration = getattr(preference, "preferred_duration_days", None) if preference else None
    if not preferred_duration or not getattr(trip, "start_date", None) or not getattr(trip, "end_date", None):
        return 0

    trip_duration = (trip.end_date - trip.start_date).days
    difference = abs(trip_duration - preferred_duration)

    if difference == 0:
        return 100
    if difference <= 1:
        return 80
    if difference <= 2:
        return 60
    if difference <= 3:
        return 40
    if difference <= 5:
        return 20

    return 0

def calculate_language_score(*, user, trip):
    preference = getattr(user, "travel_preference", None)
    user_languages = getattr(preference, "languages", []) if preference else []
    trip_languages = getattr(trip, "languages", [])

    if not user_languages or not trip_languages:
        return 0

    user_set = {
        str(item).strip().lower()
        for item in user_languages
    }

    trip_set = {
        str(item).strip().lower()
        for item in trip_languages
    }

    matched_languages = user_set.intersection(trip_set)

    if not matched_languages:
        return 0

    match_percentage = (
        len(matched_languages) / len(user_set)
    ) * 100

    return round(match_percentage)

MATCHING_WEIGHTS = {
    "destination": 25,
    "dates": 20,
    "budget": 15,
    "interests": 15,
    "travel_style": 10,
    "transport": 5,
    "accommodation": 5,
    "language": 5,
}


def calculate_match_score(*, user, trip):
    scores = {
        "destination": calculate_destination_score(user=user, trip=trip),
        "dates": calculate_date_score(user=user, trip=trip),
        "budget": calculate_budget_score(user=user, trip=trip),
        "interests": calculate_interest_score(user=user, trip=trip),
        "travel_style": calculate_travel_style_score(user=user, trip=trip),
        "transport": calculate_transport_score(user=user, trip=trip),
        "accommodation": calculate_accommodation_score(user=user, trip=trip),
        "language": calculate_language_score(user=user, trip=trip),
    }

    weighted_score = sum(
        scores[factor] * MATCHING_WEIGHTS[factor] / 100
        for factor in scores
    )

    return {
        "score": round(weighted_score),
        "breakdown": scores,
        "weights": MATCHING_WEIGHTS,
    }


def match_users_for_trip(trip, requesting_user):
    candidates = (
        User.objects.filter(is_active=True)
        .exclude(id=requesting_user.id)
        .exclude(id=trip.creator_id)
        .exclude(blocked_by__blocker=requesting_user)
        .exclude(blocking__blocked=requesting_user)
        .exclude(id__in=trip.memberships.values("user_id"))
        .select_related("profile")
    )

    results = []
    for candidate in candidates:
        match_data = calculate_match_score(user=candidate, trip=trip)
        results.append({
            "user": candidate,
            **match_data,
        })

    return sorted(results, key=lambda r: r["score"], reverse=True)