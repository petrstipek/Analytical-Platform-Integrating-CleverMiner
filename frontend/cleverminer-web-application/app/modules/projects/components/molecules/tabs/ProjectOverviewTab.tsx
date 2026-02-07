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
import type { Dataset } from '@/modules/datasets/api/datasets.api';
import { DatasetColumns } from '@/modules/datasets/components/organisms/table/dataset.columns';
import { RunsColumnsSummarized } from '@/modules/runs/components/organisms/table/runs.columns';

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

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className={'col-span-2'}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Runs</h3>
            </div>

            <DataTable
              columns={RunsColumnsSummarized}
              data={runs}
              onRowClick={(row) => navigate(`/run/${row.id}`)}
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Datasets</h3>
            </div>
            <DataTable
              columns={DatasetColumns}
              data={datasets}
              onRowClick={(row) => navigate(`/datasets/${row.id}`)}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Team Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormProvider {...methods}>
            <form onSubmit={submit} className="space-y-4">
              <AddProjectMember />
            </form>
          </FormProvider>
          <ProjectMembers projectMembers={members} />
        </CardContent>
      </Card>
    </div>
  );
}
