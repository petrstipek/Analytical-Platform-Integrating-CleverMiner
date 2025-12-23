from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from cleverminer_tasks.api.project.serializer import AddMemberSerializer
from cleverminer_tasks.api.project.service import create_project_membership
from cleverminer_tasks.api.views import IsOwnerOrAdmin
from cleverminer_tasks.models import Project, ProjectMembership, ProjectRole


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


class ProjectMembershipViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

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
