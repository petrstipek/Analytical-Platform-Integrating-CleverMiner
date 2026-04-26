import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/molecules/card';
import type { ReactNode } from 'react';

export default function RuleDetail({ children }: { children: ReactNode }) {
  return (
    <Card className="flex flex-col overflow-hidden lg:h-[90vh]">
      <CardHeader className="flex shrink-0 flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Rule Detail</CardTitle>
        <CardDescription>Find more about selected rule.</CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto">{children}</CardContent>
    </Card>
  );
}
