import { addMember } from '@/modules/projects/api/mutatations/projects.mutations';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AddProjectMember } from '@/modules/projects/api/domain/project.type';

export const useProject = () => {
  const queryClient = useQueryClient();

  const addMemberMutation = useMutation({
    mutationFn: (payload: AddProjectMember) => addMember(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members'] });
      toast.success('Member added successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to add member', error);
      toast.error('Failed to add member');
    },
  });

  return { addMemberMutation };
};
