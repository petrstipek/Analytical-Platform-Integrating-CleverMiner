from rest_framework import serializers

from cleverminer_tasks.models import Dataset, Project, DatasetFormat


class DatasetSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner_id")
    project_id = serializers.IntegerField(
        write_only=True, required=False, allow_null=True
    )

    used_in_tasks = serializers.SerializerMethodField()

    def get_used_in_tasks(self, obj):  # noqa
        return obj.tasks.exists()

    class Meta:
        model = Dataset
        fields = [
            "id",
            "name",
            "owner",
            "source_type",
            "source",
            "delimiter",
            "encoding",
            "created_at",
            "file",
            "project_id",
            "parent_id",
            "used_in_tasks",
            "is_ready",
        ]
        read_only_fields = ["id", "owner", "created_at"]

        extra_kwargs = {
            "source": {"required": False, "allow_blank": True},
            "source_type": {"required": False},
            "delimiter": {"required": False, "trim_whitespace": False},
            "encoding": {"required": False},
        }

    def validate(self, attrs):
        file = attrs.get("file")

        source_type = attrs.get("source_type") or getattr(
            self.instance, "source_type", None
        )
        source = attrs.get("source") or getattr(self.instance, "source", None)
        delimiter = attrs.get("delimiter") or getattr(self.instance, "delimiter", None)

        if file:
            pass
        else:
            if not source and not self.instance:
                raise serializers.ValidationError(
                    "You must either upload a file or provide a source URL."
                )

        if source_type == "url":
            serializers.URLField().run_validation(source)

        if source_type == "local":
            if not isinstance(source, str) or len(source.strip()) == 0:
                raise serializers.ValidationError(
                    {"source": "Local source path is required."}
                )

        if delimiter and len(delimiter) > 3:
            raise serializers.ValidationError(
                {"delimiter": "Delimiter is unexpectedly long."}
            )

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
        uploaded = validated_data.get("file")

        if uploaded and not uploaded.name.lower().endswith(".csv"):
            raise serializers.ValidationError("Unsupported file format.")

        validated_data["is_ready"] = False
        dataset = super().create(validated_data)

        if project_id:
            project = Project.objects.get(id=project_id)
            dataset.projects.add(project)

        dataset.file_format = DatasetFormat.PARQUET
        dataset.source_type = "storage_file"
        dataset.source = dataset.file.name
        dataset.delimiter = dataset.delimiter or ";"
        dataset.save()

        return dataset


class CreateDerivedDatasetSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    transform_spec = serializers.JSONField()
    output_format = serializers.ChoiceField(
        choices=["csv", "parquet"], default="parquet"
    )
