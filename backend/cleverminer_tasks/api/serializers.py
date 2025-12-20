from rest_framework import serializers

from cleverminer_tasks.models import Dataset, Task, Run


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


class RunSerializer(serializers.ModelSerializer):
    class Meta:
        model = Run
        fields = [
            "id", "task",
            "status", "result", "error_log",
            "created_at", "started_at", "finished_at",
        ]
        read_only_fields = fields
