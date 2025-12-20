from rest_framework import serializers

from cleverminer_tasks.models import Dataset, Task, Run
from cleverminer_tasks.services.procedure_configs import PROCEDURE_CONFIG_REGISTRY


class DatasetSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner_id")

    class Meta:
        model = Dataset
        fields = [
            "id", "name", "owner",
            "source_type", "source",
            "delimiter", "encoding",
            "created_at",
        ]
        read_only_fields = ["id", "owner", "created_at"]

    def validate(self, attrs):
        source_type = attrs.get("source_type") or getattr(self.instance, "source_type", None)
        source = attrs.get("source") or getattr(self.instance, "source", None)

        if source_type == "url":
            serializers.URLField().run_validation(source)

        if source_type == "local":
            if not isinstance(source, str) or len(source.strip()) == 0:
                raise serializers.ValidationError({"source": "Local source path is required."})

        delimiter = attrs.get("delimiter") or getattr(self.instance, "delimiter", None)
        if delimiter and len(delimiter) > 3:
            raise serializers.ValidationError({"delimiter": "Delimiter is unexpectedly long."})

        return attrs


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
