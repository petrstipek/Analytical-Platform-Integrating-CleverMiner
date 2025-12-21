from rest_framework import serializers

from cleverminer_tasks.models import Task, Run
from cleverminer_tasks.registry.procedureConfigsRegistry import PROCEDURE_CONFIG_REGISTRY


class TaskSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner_id")

    class Meta:
        model = Task
        fields = [
            "id", "name", "owner",
            "dataset", "procedure", "params",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]

    def validate(self, attrs):
        procedure = attrs.get("procedure") or getattr(self.instance, "procedure", None)
        params = attrs.get("params") if "params" in attrs else getattr(self.instance, "params", None)

        if not procedure:
            raise serializers.ValidationError({"procedure": "Procedure is required."})
        if params is None:
            raise serializers.ValidationError({"params": "Params are required."})

        config_cls = PROCEDURE_CONFIG_REGISTRY.get(procedure)
        if not config_cls:
            raise serializers.ValidationError({"procedure": f"Unknown procedure '{procedure}'."})

        try:
            config_cls(**params)
        except Exception as e:
            raise serializers.ValidationError({"params": str(e)})

        return attrs


class RunSerializer(serializers.ModelSerializer):
    class Meta:
        model = Run
        fields = [
            "id", "task",
            "status", "result", "error_log",
            "created_at", "started_at", "finished_at",
        ]
        read_only_fields = fields
