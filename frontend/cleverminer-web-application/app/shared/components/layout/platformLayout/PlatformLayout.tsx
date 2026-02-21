import { Outlet } from 'react-router';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/organisms/sidebar';
import { PlatformSiteHeader } from '@/shared/components/ui/organisms/site-header';
import { AppSidebar } from '@/shared/components/ui/organisms/navigation/app-sidebar';

export default function PlatformLayout() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <div className="flex flex-1 rounded-xl">
          <AppSidebar />
          <SidebarInset className="flex flex-col">
            <PlatformSiteHeader />
            <main className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
