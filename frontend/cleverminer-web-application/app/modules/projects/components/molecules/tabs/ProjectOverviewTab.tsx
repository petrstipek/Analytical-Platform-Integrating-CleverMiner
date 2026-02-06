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
import { Button } from '@/shared/components/ui/atoms/button';

type ProjectOverviewTabProps = {
  members: ProjectMember[];
  onAddMember: (payload: AddProjectMemberType) => void;
  projectId: number;
};

export default function ProjectOverviewTab({
  members,
  onAddMember,
  projectId,
}: ProjectOverviewTabProps) {
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Team</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormProvider {...methods}>
          <form onSubmit={submit} className="space-y-4">
            <AddProjectMember />
            <Button type="submit">Add member</Button>
          </form>
        </FormProvider>
        <ProjectMembers projectMembers={members} />
      </CardContent>
    </Card>
  );
}
