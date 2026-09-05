from django.db import transaction
from .models import Profile, TravelPreference, User

@transaction.atomic
def register_user(*, username , email, password):
    user = User.objects.create_user(
        username = username,
        email = email,
        password = password,
    )
    
    Profile.objects.create(
        user = user,
        display_name = username,
    )
    
    TravelPreference.objects.create(
        user = user,
    )
    
    return user