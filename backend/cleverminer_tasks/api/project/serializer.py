from django.contrib.auth import get_user_model
from rest_framework import serializers

from cleverminer_tasks.models import ProjectRole, ProjectMembership, Project

User = get_user_model()


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"
        read_only_fields = ("owner",)


class ProjectMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMembership
        fields = "__all__"


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


class MemberActionSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    role = serializers.ChoiceField(
        choices=[ProjectRole.VIEWER, ProjectRole.EDITOR], required=False
    )

    @staticmethod
    def validate_user_id(user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this id does not exist.")

    def validate(self, data):
        project = self.context["project"]
        target_user = data.pop("user_id")

        try:
            membership = ProjectMembership.objects.get(
                project=project, user=target_user
            )
        except ProjectMembership.DoesNotExist:
            raise serializers.ValidationError("User is not a member of the project.")

        data["membership"] = membership
        return data
