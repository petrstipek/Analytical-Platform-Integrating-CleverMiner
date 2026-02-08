import { Label } from '@radix-ui/react-label';
import type { AddProjectMemberFormValues } from '@/modules/projects/utils/project-validation';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/shared/components/ui/atoms/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/atoms/select';
import { ProjectRole } from '@/modules/projects/domain/project.type';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';
import { Button } from '@/shared/components/ui/atoms/button';

export default function AddProjectMember() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<AddProjectMemberFormValues>();

  const role = watch('role');
  const projectRoles = Object.values(ProjectRole);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Add Member</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Member email</Label>
            <Input {...register('email')} placeholder="petr@example.com" />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Member Role</Label>
            <Select
              value={role}
              onValueChange={(val) =>
                setValue('role', val as ProjectRole, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select procedure..." />
              </SelectTrigger>
              <SelectContent>
                {projectRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button type="submit">Add member</Button>
        </div>
      </CardContent>
    </Card>
  );
}
