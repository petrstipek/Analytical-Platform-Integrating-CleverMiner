import * as React from 'react';
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from 'lucide-react';

import { NavMain } from '@/shared/components/ui/organisms/navigation/nav-main';
import { NavProjects } from '@/shared/components/ui/organisms/navigation/nav-projects';
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

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Tasks',
      url: '/tasks',
      icon: SquareTerminal,
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
      icon: Bot,
      items: [
        {
          title: 'New project',
          url: '/projects/new-project',
        },
      ],
    },
    {
      title: 'Runs',
      url: '#',
      icon: BookOpen,
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
