import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';
import { Progress } from '@/shared/components/ui/atoms/progress';
import type { ProjectType } from '@/modules/projects/domain/project.type';

type ProjectStatsProps = {
  project: ProjectType;
};

export default function ProjectStats({ project }: ProjectStatsProps) {
  const progress = (project.completedTasks / project.totalTasks) * 100;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Project Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{project.totalTasks}</div>
            <div className="text-muted-foreground text-xs">Total Tasks</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{project.completedTasks}</div>
            <div className="text-muted-foreground text-xs">Completed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
