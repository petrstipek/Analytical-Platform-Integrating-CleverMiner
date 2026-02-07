import { addMember } from '@/modules/projects/api/mutatations/projects.mutations';
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
      console.error('Failed to add member', error);
      toast.error('Failed to add member');
    },
  });

  const { data: projectSummary, isLoading: projectSummaryLoading } = useQuery({
    queryKey: ['project-summary'],
    queryFn: () => getProjectSummary(Number(projectId)),
  });

  return { addMemberMutation, projectSummary, projectSummaryLoading };
};
