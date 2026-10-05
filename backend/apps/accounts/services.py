from django.db import transaction
from .models import Profile, TravelPreference, User

@transaction.atomic
def register_user(*, username , email, password):
    user = User.objects.create_user(
        username = username,
        email = email,
        password = password,
    )
    
    Profile.objects.get_or_create(
        user=user,
        defaults={"display_name": username},
    )
    
    TravelPreference.objects.get_or_create(
        user=user,
    )
    
    return user