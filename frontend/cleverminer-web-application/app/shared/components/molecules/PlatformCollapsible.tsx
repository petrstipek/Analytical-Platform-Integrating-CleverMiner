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
  collapsedTitle?: ReactNode;
  collapsedDescription?: ReactNode;
  revealedTitle?: ReactNode;
};

export default function PlatformCollapsible({
  children,
  collapsedTitle,
  collapsedDescription,
  revealedTitle = collapsedTitle,
}: PlatformCollapsibleProps) {
  return (
    <Collapsible>
      <Card className="bg-background/80 rounded-2xl border shadow-xl ring-1 ring-black/5">
        <CollapsibleTrigger asChild>
          <CardHeader className="group flex cursor-pointer flex-row items-center justify-between">
            <div className="flex flex-row space-x-4">
              <CardTitle className="text-xl font-semibold">{collapsedTitle}</CardTitle>
            </div>
            <CardDescription className="flex flex-row items-center">
              {collapsedDescription}
              <ChevronDownIcon className="ml-2 h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up mt-2 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold">{revealedTitle}</CardTitle>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
