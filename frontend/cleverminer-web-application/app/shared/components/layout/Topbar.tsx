import * as React from 'react';
import { Link } from 'react-router';
import { Button } from '@/shared/components/ui/atoms/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/molecules/sheet';
import { Separator } from '@/shared/components/ui/atoms/separator';
import { Menu } from 'lucide-react';
import { MobileNavLink, NavItem } from '@/shared/components/atoms';

type NavItemDef = {
  to: string;
  label: string;
  description?: string;
};

const NAV_PRIMARY: NavItemDef[] = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features', description: 'Task wizard, datasets, runs' },
  { to: '/docs', label: 'Docs', description: 'API + concepts + procedures' },
  { to: '/pricing', label: 'Pricing', description: 'Personal / Team / Enterprise' },
  { to: '/about', label: 'About', description: 'Project & research context' },
];

export function Topbar() {
  return (
    <header className="bg-background/70 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="group flex items-center gap-2">
            <div className="ring-border relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl ring-1">
              <div className="from-primary/90 to-primary/40 absolute inset-0 bg-gradient-to-br" />
              <span className="text-primary-foreground relative text-xs font-semibold">CM</span>
            </div>

            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight">
                  CleverMiner Analytical Platform
                </span>
              </div>
              <span className="text-muted-foreground hidden text-[11px] sm:block">
                GUHA tasks • datasets • runs
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_PRIMARY.map((item) => (
            <NavItem key={item.to} to={item.to} label={item.label} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Separator orientation="vertical" className="mx-1 hidden h-7 md:block" />

          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/login">Log in</Link>
          </Button>

          <Button asChild className="relative overflow-hidden">
            <Link to="/register">
              <span className="relative z-10">Create account</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-[70%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[70%]" />
            </Link>
          </Button>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[320px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-2">
                  {NAV_PRIMARY.map((item) => (
                    <MobileNavLink key={item.to} to={item.to} label={item.label} />
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="flex flex-col items-center gap-3">
                  <Button asChild variant="outline" className="w-[300px]">
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button asChild className="w-[300px]">
                    <Link to="/register">Create account</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
