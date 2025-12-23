from django.contrib.auth import get_user_model
from rest_framework import serializers

from cleverminer_tasks.models import ProjectRole, ProjectMembership

User = get_user_model()


class AddMemberSerializer(serializers.Serializer):
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=[ProjectRole.VIEWER, ProjectRole.EDITOR])

    @staticmethod
    def validate_email(email):
        try:
            return User.objects.get(email__iexact=email.strip())
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")

    def validate(self, data):
        user_to_add = data.pop("email")
        data["user"] = user_to_add
        project = self.context["project"]
        request = self.context["request"]

        if user_to_add == request.user:
            raise serializers.ValidationError("Cannot add yourself to the project.")

        if ProjectMembership.objects.filter(project=project, user=user_to_add).exists():
            raise serializers.ValidationError(
                "User is already a member of the project."
            )

        return data
