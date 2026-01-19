from django.db import transaction

from accounts.models import CustomUser as User

from cleverminer_tasks.models import Project, ProjectMembership, ProjectRole


def create_project_membership(
    project: Project, user_to_add: User, role: ProjectRole
) -> ProjectMembership:
    return ProjectMembership.objects.create(
        project=project, user=user_to_add, role=role
    )


@transaction.atomic
def create_project(owner, **project_data) -> Project:
    project = Project.objects.create(owner=owner, **project_data)
    ProjectMembership.objects.create(
        project=project,
        user=owner,
        role=ProjectRole.ADMIN,
    )
    return project
