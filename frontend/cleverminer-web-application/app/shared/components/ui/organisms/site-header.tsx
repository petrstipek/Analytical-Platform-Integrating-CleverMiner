import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/atoms/breadcrumb';
import { Separator } from '@/shared/components/ui/atoms/separator';
import { SidebarTrigger } from '@/shared/components/ui/organisms/sidebar';
import { Link, useLocation } from 'react-router';
import React from 'react';

export function PlatformSiteHeader() {
  const location = useLocation();

  const pathNames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="flex h-16 shrink-0 items-center px-4">
      <div className="border-border/40 bg-background/80 flex items-center gap-4 rounded-full border px-3 py-3 shadow-sm backdrop-blur-sm">
        <SidebarTrigger className="-ml-1 size-7" />
        <Separator orientation="vertical" className="h-4 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link to="/home">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {pathNames
              .filter((value) => value !== 'home')
              .map((value, index, filtered) => {
                const last = index === filtered.length - 1;
                const to = `/${pathNames.slice(0, pathNames.indexOf(value) + 1).join('/')}`;
                const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
                return (
                  <React.Fragment key={to}>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      {last ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild className="hidden md:block">
                          <Link to={to}>{label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
