from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from cleverminer_tasks.api.dataset.serializers import DatasetSerializer
from cleverminer_tasks.api.runs.serializers import (
    RunSerializer,
    RunSummarySerializer,
)
from cleverminer_tasks.api.project.serializer import (
    AddMemberSerializer,
    MemberActionSerializer,
    ProjectSerializer,
    ProjectMembershipSerializer,
)
from cleverminer_tasks.api.project.service import (
    create_project_membership,
    create_project,
)
from cleverminer_tasks.api.views import IsOwnerOrAdmin
from cleverminer_tasks.models import (
    Project,
    ProjectMembership,
    ProjectRole,
    Run,
)


class IsUserProjectMember(permissions.BasePermission):
    def has_object_permission(self, request, view, obj: Project):
        return ProjectMembership.objects.filter(project=obj, user=request.user).exists()


class IsUserProjectAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj: Project):
        return ProjectMembership.objects.filter(
            project=obj, user=request.user, role=ProjectRole.ADMIN
        ).exists()


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        qs = Project.objects.all()
        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return qs
        if user.is_authenticated:
            return qs.filter(memberships__user=user).distinct()
        return qs.none()

    def get_permissions(self):
        if self.action in ("add_member", "remove_member", "update_member_role"):
            return [permissions.IsAuthenticated(), IsUserProjectAdmin()]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        project = create_project(owner=request.user, **serializer.validated_data)

        out = self.get_serializer(project)
        return Response(out.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="add-member")
    def add_member(self, request, pk=None):
        project = self.get_object()

        serializer = AddMemberSerializer(
            data=request.data, context={"project": project, "request": request}
        )

        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data

        create_project_membership(
            project=project,
            user_to_add=validated_data["user"],
            role=validated_data["role"],
        )

        return Response({"status": "Member added"}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="remove-member")
    def remove_member(self, request, pk=None):
        project = self.get_object()

        serializer = MemberActionSerializer(
            data=request.data, context={"project": project}
        )

        serializer.is_valid(raise_exception=True)
        membership = serializer.validated_data["membership"]

        membership.delete()

        return Response({"status": "Member removed"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="update-member-role")
    def update_member_role(self, request, pk=None):
        project = self.get_object()

        serializer = MemberActionSerializer(
            data=request.data, context={"project": project}
        )

        serializer.is_valid(raise_exception=True)

        membership = serializer.validated_data["membership"]
        new_role = serializer.validated_data.get("role")

        membership.role = new_role
        membership.save()

        return Response({"status": "Member role updated"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="runs")
    def project_runs(self, request, pk=None):
        project = self.get_object()
        queryset = Run.objects.filter(task__project=project).order_by("-created_at")
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = RunSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = RunSummarySerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="datasets")
    def project_datasets(self, request, pk=None):
        project = self.get_object()
        queryset = project.datasets.all().order_by("-created_at")

        serializer = DatasetSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="members")
    def project_members(self, request, pk=None):
        project = self.get_object()
        queryset = project.memberships.all()
        serializer = ProjectMembershipSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="summary")
    def summary(self, request, pk=None):
        project = self.get_object()

        runs = Run.objects.filter(task__project=project)
        tasks = project.tasks.all()
        datasets = project.datasets.all()

        return Response(
            {"runs": runs.count(), "tasks": tasks.count(), "datasets": datasets.count()}
        )


class ProjectMembershipViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    serializer_class = ProjectMembershipSerializer

    def get_queryset(self):
        qs = ProjectMembership.objects.all()
        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return qs
        if user.is_authenticated:
            return ProjectMembership.objects.filter(
                project__memberships__user=user
            ).distinct()

        return qs.none()
