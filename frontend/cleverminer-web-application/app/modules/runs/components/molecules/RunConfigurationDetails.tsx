import {
  Collapsible,
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
import { ProcedureBadge } from '@/shared/components/atoms/ProcedureBadge';
import { ProceduresType } from '@/shared/domain/procedures.type';

type RunConfigurationDetailsProps = {
  children: ReactNode;
  procedure?: ProceduresType;
};

export default function RunConfigurationDetails({
  children,
  procedure,
}: RunConfigurationDetailsProps) {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Card className="w-full cursor-pointer select-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex flex-row space-x-4">
              <CardTitle>Run Configuration details</CardTitle>
              {procedure && <ProcedureBadge procedure={procedure} />}
            </div>
            <CardDescription className="flex flex-row items-center">
              Explore the configuration this task was mined with.{' '}
              <ChevronDownIcon className="ml-2 h-4 w-4 transition-transform data-[state=open]:rotate-180" />
            </CardDescription>
          </CardHeader>
        </Card>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <Card>
          <CardHeader>
            <CardTitle>Run configuration</CardTitle>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
