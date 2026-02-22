from rest_framework import serializers

from cleverminer_tasks.api.tasks.serializers import TaskSerializer
from cleverminer_tasks.models import Run


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
    task_name = serializers.CharField(source="task.name", read_only=True)

    class Meta:
        model = Run
        fields = [
            "id",
            "task",
            "task_name",
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
    task = TaskSerializer(read_only=True)

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
            "task",
            "run_snapshot",
        ]
        read_only_fields = fields

    def get_result_summary(self, obj: Run):
        return RunSummarySerializer(obj).data["result_summary"]


class RunStatusSummarySerializer(serializers.Serializer):
    total = serializers.IntegerField()
    queued = serializers.IntegerField()
    running = serializers.IntegerField()
    failed = serializers.IntegerField()
    done = serializers.IntegerField()
    canceled = serializers.IntegerField()
