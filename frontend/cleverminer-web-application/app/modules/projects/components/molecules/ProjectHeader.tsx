import { Link } from 'react-router';
import { FileText, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/atoms/button';
import type { ProjectType } from '@/modules/projects/domain/project.type';
import { ModulePagesHeader } from '@/shared/components/molecules';

type ProjectHeaderProps = {
  project: ProjectType;
  projectId?: string;
};

export default function ProjectHeader({ project, projectId }: ProjectHeaderProps) {
  return (
    <ModulePagesHeader title={project.name}>
      <Link to={`/tasks/new-task?project_id=${projectId}`} className="flex items-center gap-2">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </Link>
    </ModulePagesHeader>
  );
}
