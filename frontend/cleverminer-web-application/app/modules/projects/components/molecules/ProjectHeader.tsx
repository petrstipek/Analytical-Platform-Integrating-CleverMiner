import { Link } from 'react-router';
import { FileText, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/atoms/button';
import type { ProjectType } from '@/modules/projects/domain/project.type';

type ProjectHeaderProps = {
  project: ProjectType;
};

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-1">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Link to="/projects" className="hover:text-primary transition-colors">
            Projects
          </Link>
          <span>/</span>
          <span>{project.name}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
        <p className="text-muted-foreground">Project description</p>

        <div className="text-muted-foreground flex items-center gap-4 pt-2 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
            </span>
            {String(project.updatedAt)}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>
    </div>
  );
}
