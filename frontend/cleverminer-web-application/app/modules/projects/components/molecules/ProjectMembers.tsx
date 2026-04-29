import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';
import { Button } from '@/shared/components/ui/atoms/button';
import { Avatar, AvatarFallback } from '@/shared/components/ui/atoms/avatar';
import type { ProjectMember } from '@/modules/projects/domain/member.type';
import { X } from 'lucide-react';
import { useMe } from '@/modules/auth/api/queries/auth.queries';
import { useNavigate } from 'react-router';

type ProjectMembersProps = {
  projectMembers: ProjectMember[];
  onRemoveMember: (memberId: number) => void;
  isAdmin: boolean;
};

export default function ProjectMembers({
  projectMembers,
  onRemoveMember,
  isAdmin,
}: ProjectMembersProps) {
  const { data: me } = useMe();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Team Members</CardTitle>
        {!isAdmin && (
          <Button
            variant={'destructive'}
            onClick={() => {
              onRemoveMember(me?.id!);
              navigate('/projects');
            }}
          >
            Leave Project
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {projectMembers.map((member: ProjectMember) => (
          <div key={member.user_id} className="flex items-center justify-between">
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
            {isAdmin && member.user_id !== me?.id && (
              <button
                onClick={() => onRemoveMember(member.user_id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
