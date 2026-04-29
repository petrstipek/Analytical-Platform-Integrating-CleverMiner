import { addMember, removeMember } from '@/modules/projects/api/mutatations/projects.mutations';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AddProjectMemberType } from '@/modules/projects/api/domain/project.type';
import { getProjectSummary } from '@/modules/projects/api/queries/projects.query';

export const useProject = (projectId?: string) => {
  const queryClient = useQueryClient();

  const addMemberMutation = useMutation({
    mutationFn: (payload: AddProjectMemberType) => addMember(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members'] });
      toast.success('Member added successfully!');
    },
    onError: (error: any) => {
      const data = error?.response?.data;

      const message = Object.values(data ?? {})
        .flat()
        .join(', ');

      toast.error(message || 'Failed to add member');
    },
  });

  const { data: projectSummary, isLoading: projectSummaryLoading } = useQuery({
    queryKey: ['project-summary'],
    queryFn: () => getProjectSummary(Number(projectId)),
  });

  const removeMemberMutation = useMutation({
    mutationFn: (payload: { projectId: number; memberId: number }) =>
      removeMember(payload.projectId, payload.memberId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members'] });
      toast.success('Action performed successfully!');
    },

    onError: (error: any) => {
      const data = error?.response?.data;
      toast.error(data?.detail || 'Action Failed!');
    },
  });

  return { addMemberMutation, projectSummary, projectSummaryLoading, removeMemberMutation };
};
