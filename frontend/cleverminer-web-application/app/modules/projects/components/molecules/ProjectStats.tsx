import type { ProjectSummary } from '@/modules/projects/api/domain/project.type';
import BaseSummaryCard from '@/shared/components/atoms/BaseSummaryCard';

type ProjectStatsProps = {
  project: ProjectSummary;
};

export default function ProjectStats({ project }: ProjectStatsProps) {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-3">
      <BaseSummaryCard title={'Tasks'} value={project.tasks} variant={'default'} />
      <BaseSummaryCard title={'Runs'} value={project.runs} variant={'default'} />
      <BaseSummaryCard title={'Datasets'} value={project.datasets} variant={'default'} />
    </div>
  );
}
