import { Button } from '@/shared/components/ui/atoms/button';

export function Topbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="text-muted-foreground text-sm">Analytical Platform</div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          User
        </Button>
      </div>
    </header>
  );
}
