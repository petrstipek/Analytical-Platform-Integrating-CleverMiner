import * as React from 'react';
import {
  Command,
  LifeBuoy,
  Send,
  Database,
  FolderDot,
  SquareCheckBig,
  CirclePlay,
} from 'lucide-react';

import { NavMain } from '@/shared/components/ui/organisms/navigation/nav-main';
import { NavSecondary } from '@/shared/components/ui/organisms/navigation/nav-secondary';
import { NavUser } from '@/shared/components/ui/organisms/navigation/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/organisms/sidebar';
import { useMe } from '@/modules/auth/api/queries/auth.queries';
import { useMemo } from 'react';

const data = {
  navMain: [
    {
      title: 'Tasks',
      url: '/tasks',
      icon: SquareCheckBig,
      isActive: true,
      items: [
        {
          title: 'New task',
          url: 'tasks/new-task',
        },
      ],
    },
    {
      title: 'Projects',
      url: '/projects',
      icon: FolderDot,
      items: [
        {
          title: 'New project',
          url: '/projects/new-project',
        },
      ],
    },
    {
      title: 'Datasets',
      url: '/datasets',
      icon: Database,
      items: [
        {
          title: 'New dataset',
          url: '/projects/new-project',
        },
      ],
    },
    {
      title: 'Runs',
      icon: CirclePlay,
      url: '/runs',
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: me, isPending, isError } = useMe();

  const user = useMemo(() => {
    if (!me) return null;
    return {
      name: me.username,
      email: me.email,
      avatar: '/avatars/shadcn.jpg',
    };
  }, [me]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">CleverMiner</span>
                  <span className="truncate text-xs">Data mining platform</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {isPending && (
          <NavUser
            user={{
              name: 'Loading…',
              email: '',
              avatar: '/avatars/shadcn.jpg',
            }}
          />
        )}

        {!isPending && user && <NavUser user={user} />}

        {!isPending && (isError || !user) && (
          <NavUser user={{ name: 'Guest', email: '', avatar: '/avatars/shadcn.jpg' }} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
