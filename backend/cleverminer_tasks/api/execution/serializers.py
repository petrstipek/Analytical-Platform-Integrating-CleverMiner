from rest_framework import serializers

from cleverminer_tasks.models import Task, Run
from cleverminer_tasks.registry.procedureConfigsRegistry import (
    PROCEDURE_CONFIG_REGISTRY,
)


class TaskSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner_id")

    class Meta:
        model = Task
        fields = [
            "id",
            "name",
            "owner",
            "dataset",
            "procedure",
            "params",
            "created_at",
            "updated_at",
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


class RunSerializer(serializers.ModelSerializer):
    class Meta:
        model = Run
        fields = [
            "id",
            "task",
            "status",
            "result",
            "error_log",
            "created_at",
            "started_at",
            "finished_at",
        ]
        read_only_fields = fields


class RunSummarySerializer(serializers.ModelSerializer):
    result_summary = serializers.SerializerMethodField()

    class Meta:
        model = Run
        fields = [
            "id",
            "task",
            "status",
            "error_log",
            "created_at",
            "started_at",
            "finished_at",
            "result_summary",
        ]
        read_only_fields = fields

    def get_result_summary(self, obj: Run):
        if not isinstance(obj.result, dict):
            return {"has_result": False}

        summary = obj.result.get("summary")
        rules = obj.result.get("rules")

        rule_count = None
        target = None

        if isinstance(summary, dict):
            rule_count = summary.get("rule_count")
            target = summary.get("target")

        if rule_count is None and isinstance(rules, list):
            rule_count = len(rules)

        return {
            "has_result": True,
            "rule_count": rule_count,
            "target": target,
        }


class RunDetailSerializer(serializers.ModelSerializer):
    result_summary = serializers.SerializerMethodField()

    class Meta:
        model = Run
        fields = [
            "id",
            "task",
            "status",
            "result",
            "error_log",
            "created_at",
            "started_at",
            "finished_at",
            "result_summary",
        ]
        read_only_fields = fields

    def get_result_summary(self, obj: Run):
        return RunSummarySerializer(obj).data["result_summary"]
