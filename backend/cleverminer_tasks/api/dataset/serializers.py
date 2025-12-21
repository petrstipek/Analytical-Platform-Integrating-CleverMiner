from rest_framework import serializers

from cleverminer_tasks.models import Dataset

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