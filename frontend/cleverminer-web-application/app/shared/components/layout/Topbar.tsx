import { Button } from "@/shared/components/ui/button";

export function Topbar() {
    return (
        <header className="h-14 border-b flex items-center justify-between px-4">
            <div className="text-sm text-muted-foreground">
                Analytical Platform
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                    User
                </Button>
            </div>
        </header>
    );
}
