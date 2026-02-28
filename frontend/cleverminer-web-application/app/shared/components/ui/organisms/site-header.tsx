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
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink asChild>
              <BreadcrumbLink asChild>
                <Link to="/home">Home</Link>
              </BreadcrumbLink>
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
    </header>
  );
}
