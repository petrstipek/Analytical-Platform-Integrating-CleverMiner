import { useMutation } from '@tanstack/react-query';
import { createNewProject } from '@/modules/projects/api/mutatations/projects.mutations';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export const useProjects = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const project = await createNewProject(name);
      return project;
    },
    onSuccess: (project: any) => {
      toast.success(`Project "${project.name}" created!`);
      navigate(`/projects/${project.id}`);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error('Failed to create project: ' + (error.response?.data?.detail || error.message));
    },
  });
};
