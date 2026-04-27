import * as React from 'react';
import {
  LifeBuoy,
  Database,
  FolderDot,
  SquareCheckBig,
  CirclePlay,
  Github,
  HomeIcon,
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
      title: 'Home',
      url: '/home',
      icon: HomeIcon,
    },
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
          url: '/datasets/upload',
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
      title: 'Platform Docs',
      url: 'https://cleverminer-docs.stipekdevs.cz/docs/platform-introduction',
      icon: LifeBuoy,
    },
    {
      title: 'CleverMiner Docs',
      url: 'https://www.cleverminer.org/doc/index.html',
      icon: LifeBuoy,
    },
    {
      title: 'Support',
      url: 'https://github.com/petrstipek/Analytical-Platform-Integrating-CleverMiner/issues',
      icon: Github,
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
      avatar: undefined,
    };
  }, [me]);

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="shadow-cleverminer-one rounded-xl shadow-2xl [&_[data-sidebar=sidebar]]:p-0"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a>
                <div className="ring-border relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-white" />
                  <span className="text-cleverminer-one relative text-xs font-semibold">CM</span>
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
        <span className="text-muted-foreground px-2 pb-2 text-xs group-data-[collapsible=icon]:hidden">
          v{__APP_VERSION__}
        </span>
      </SidebarFooter>
    </Sidebar>
  );
}
