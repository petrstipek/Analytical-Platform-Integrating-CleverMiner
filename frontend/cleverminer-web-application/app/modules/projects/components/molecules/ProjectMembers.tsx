import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';
import { Button } from '@/shared/components/ui/atoms/button';
import { Avatar, AvatarFallback } from '@/shared/components/ui/atoms/avatar';
import type { ProjectMember } from '@/modules/projects/domain/member.type';

type ProjectMembersProps = {
  projectMembers: ProjectMember[];
};

export default function ProjectMembers({ projectMembers }: ProjectMembersProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Team Members</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary h-auto p-0 hover:bg-transparent">
          + Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {projectMembers.map((member: ProjectMember) => (
          <div key={member.userId} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{member.username}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="text-sm leading-none font-medium">{member.username}</p>
                <p className="text-muted-foreground text-xs">{member.role}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
