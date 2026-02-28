import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';
import type { ProjectMember } from '@/modules/projects/domain/member.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import {
  type AddProjectMemberFormValues,
  addProjectMemberSchema,
} from '@/modules/projects/utils/project-validation';
import { ProjectRole } from '@/modules/projects/domain/project.type';
import ProjectMembers from '@/modules/projects/components/molecules/ProjectMembers';
import type { AddProjectMemberType } from '@/modules/projects/api/domain/project.type';
import AddProjectMember from '@/modules/projects/components/molecules/AddProjectMember';
import { DataTable } from '@/shared/components/organisms/table/data-table';
import { useNavigate } from 'react-router';
import type { RunResult } from '@/modules/runs/domain/runs-results.type';
import { getBaseRunColumns } from '@/modules/runs/components/organisms/table/runs.columns';
import { getDatasetBaseColumns } from '@/modules/datasets/components/organisms/table/datasetBase.columns';
import type { Dataset } from '@/modules/datasets/api/types/datasetBase.type';
import { PlatformCard } from '@/shared/components/molecules';

type ProjectOverviewTabProps = {
  members: ProjectMember[];
  onAddMember: (payload: AddProjectMemberType) => void;
  projectId: number;
  runs: RunResult[];
  datasets: Dataset[];
};

export default function ProjectOverviewTab({
  members,
  onAddMember,
  projectId,
  runs,
  datasets,
}: ProjectOverviewTabProps) {
  const navigate = useNavigate();
  const methods = useForm<AddProjectMemberFormValues>({
    resolver: zodResolver(addProjectMemberSchema),
    mode: 'onChange',
    defaultValues: {
      role: ProjectRole.editor,
    },
  });

  const submit = methods.handleSubmit((values) => {
    onAddMember({
      projectId,
      email: values.email,
      role: values.role,
    });
    methods.reset({ email: '', role: values.role });
  });

  const RunsBaseColumns = getBaseRunColumns((runId: number) => {});
  const DatasetBaseColumns = getDatasetBaseColumns((id) => {});

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <PlatformCard
        cardTitle={'Project Overview'}
        cardDescription={'Explore project overview.'}
        className={'col-span-2'}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Runs</h3>
          </div>

          <DataTable
            columns={RunsBaseColumns}
            data={runs}
            onRowClick={(row) => navigate(`/run/${row.id}`)}
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Datasets</h3>
          </div>
          <DataTable
            columns={DatasetBaseColumns}
            data={datasets}
            onRowClick={(row) => navigate(`/datasets/${row.id}`)}
          />
        </div>
      </PlatformCard>
      <PlatformCard cardTitle={'Team Overview'}>
        <FormProvider {...methods}>
          <form onSubmit={submit} className="space-y-4">
            <AddProjectMember />
          </form>
        </FormProvider>
        <ProjectMembers projectMembers={members} />
      </PlatformCard>
    </div>
  );
}
