import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import type { Member } from '@/modules/projects/domain/member.type';

type ProjectMembersProps = {
  members: Member[];
};

export default function ProjectTeamMembers({ members }: ProjectMembersProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Team Members</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary h-auto p-0 hover:bg-transparent">
          + Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.map((member, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="text-sm leading-none font-medium">{member.name}</p>
                <p className="text-muted-foreground text-xs">{member.role}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
