import { Collapsible } from '@radix-ui/react-collapsible';
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/molecules/collapsible';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/molecules/card';
import { ChevronDownIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type PlatformCollapsibleProps = {
  children: ReactNode;
  collapsedTitle?: string;
  collapsedDescription?: string;
  revealedTitle?: string;
};

export default function PlatformCollapsible({
  children,
  collapsedTitle,
  collapsedDescription,
  revealedTitle = collapsedTitle,
}: PlatformCollapsibleProps) {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Card className="bg-background/80 rounded-2xl border shadow-xl ring-1 ring-black/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex flex-row space-x-4">
              <CardTitle className="text-xl font-semibold">{collapsedTitle}</CardTitle>
            </div>
            <CardDescription className="flex flex-row items-center">
              {collapsedDescription}
              <ChevronDownIcon className="ml-2 h-4 w-4 transition-transform data-[state=open]:rotate-180" />
            </CardDescription>
          </CardHeader>
        </Card>
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up mt-2 overflow-hidden">
        <Card className="bg-background/80 rounded-2xl border shadow-xl ring-1 ring-black/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold">{revealedTitle}</CardTitle>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
