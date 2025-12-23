from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "date_joined"]
        read_only_fields = ["id", "username", "email", "date_joined"]
