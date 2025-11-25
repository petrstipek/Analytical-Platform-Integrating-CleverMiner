from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # right now inheriting from the Django default user model
    pass

    def __str__(self):
        return self.username