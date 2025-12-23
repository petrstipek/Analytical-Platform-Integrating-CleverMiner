from accounts.models import CustomUser as User

from cleverminer_tasks.models import Project, ProjectMembership, ProjectRole


def create_project_membership(
    project: Project, user_to_add: User, role: ProjectRole
) -> ProjectMembership:
    return ProjectMembership.objects.create(
        project=project, user=user_to_add, role=role
    )
