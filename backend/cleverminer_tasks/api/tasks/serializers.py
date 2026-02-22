from rest_framework import serializers

from cleverminer_tasks.models import Task, Project
from cleverminer_tasks.registry.procedureConfigsRegistry import (
    PROCEDURE_CONFIG_REGISTRY,
)


class TaskSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner_id")
    dataset_name = serializers.CharField(source="dataset.name", read_only=True)

    project_id = serializers.IntegerField(
        write_only=True, required=False, allow_null=True
    )
    project_name = serializers.CharField(source="project.name", read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "name",
            "owner",
            "dataset",
            "dataset_name",
            "procedure",
            "params",
            "created_at",
            "updated_at",
            "project_id",
            "project",
            "project_name",
        ]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]

    def validate(self, attrs):
        procedure = attrs.get("procedure") or getattr(self.instance, "procedure", None)
        params = (
            attrs.get("params")
            if "params" in attrs
            else getattr(self.instance, "params", None)
        )

        if not procedure:
            raise serializers.ValidationError({"procedure": "Procedure is required."})
        if params is None:
            raise serializers.ValidationError({"params": "Params are required."})

        config_cls = PROCEDURE_CONFIG_REGISTRY.get(procedure)
        if not config_cls:
            raise serializers.ValidationError(
                {"procedure": f"Unknown procedure '{procedure}'."}
            )

        try:
            config_cls(**params)
        except Exception as e:
            raise serializers.ValidationError({"params": str(e)})

        return attrs

    def validate_project_id(self, project_id):
        if not project_id:
            return None
        user = self.context["request"].user
        is_member = Project.objects.filter(
            id=project_id, memberships__user=user
        ).exists()
        if not is_member:
            raise serializers.ValidationError("User is not a member of the project.")
        return project_id

    def create(self, validated_data):
        project_id = validated_data.pop("project_id", None)
        if project_id is not None:
            validated_data["project_id"] = project_id
        return super().create(validated_data)

    def update(self, instance, validated_data):
        project_id = validated_data.pop("project_id", None)
        if project_id is not None:
            instance.project_id = project_id
        return super().update(instance, validated_data)
