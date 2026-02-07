import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/molecules/card';
import { AccordionContent, AccordionTrigger } from '@/shared/components/ui/molecules/accordion';
import { Badge } from '@/shared/components/ui/atoms/badge';
import type { Task } from '@/modules/tasks/domain/task.type';
import { formatDate } from '@/shared/utils/formatDate';
import { CedentDetail, QuantifiersDetail } from '@/modules/tasks/components/molecules';
import { Accordion, AccordionItem } from '@radix-ui/react-accordion';
import { Button } from '@/shared/components/ui/atoms/button';
import { Link } from 'react-router';
import { PROCEDURE_STYLES } from '@/shared/components/styles/procedures-styling';

type Props = { task: Task };

function attrsCount(node: any): number {
  if (!node) return 0;
  if (Array.isArray(node.attributes)) return node.attributes.length;
  return 0;
}

function pickSummary(task: Task) {
  const p: any = task.params ?? {};
  const bits: string[] = [];

  if (p.target) bits.push(`Target: ${p.target}`);

  if (p.target_candidates) bits.push(`Target candidates: ${p.target_candidates.length}`);

  if (p.cond) bits.push(`Cond attrs: ${attrsCount(p.cond)}`);
  if (p.ante) bits.push(`Ante attrs: ${attrsCount(p.ante)}`);
  if (p.succ) bits.push(`Succ attrs: ${attrsCount(p.succ)}`);

  if (p.set1?.attributes?.length > 0) bits.push(`Set1 attrs: ${attrsCount(p.set1)}`);
  if (p.set2?.attributes?.length > 0) bits.push(`Set2 attrs: ${attrsCount(p.set2)}`);

  const q = p.quantifiers;
  if (q && typeof q === 'object') {
    const filled = Object.entries(q).filter(([, v]) => v !== null && v !== undefined);
    if (filled.length) bits.push(`Quantifiers: ${filled.length}`);
  }
  return bits.join(' • ');
}

export default function TasksForList({ task }: Props) {
  const summary = pickSummary(task);
  const { bg, text } = PROCEDURE_STYLES[task.procedure];

  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <AccordionTrigger className="p-0 hover:no-underline">
          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex-1 space-y-1 text-left">
              <div className="flex items-center gap-2">
                <div className="font-medium">{task.name}</div>
                <Badge
                  variant="secondary"
                  className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${bg} ${text}`}
                >
                  {task.procedure}
                </Badge>
              </div>

              <p className="text-muted-foreground line-clamp-1 text-sm">
                {summary || 'No parameters summary'}
              </p>

              <p className="text-muted-foreground text-xs">
                Dataset #{task.dataset} • Updated {formatDate(String(task.updated_at))}
              </p>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="pt-4">
          <div className="space-y-3">
            <div className="grid gap-2 text-sm md:grid-cols-3">
              <div className="space-y-4">
                <div className="text-muted-foreground text-xs">Procedure</div>
                <div className="font-medium">{task.procedure}</div>
                <div className="text-muted-foreground text-xs">Dataset</div>
                <div className="font-medium">#{task.dataset}</div>
              </div>
              <div className="space-y-4">
                <div className="text-muted-foreground text-xs">Created</div>
                <div className="font-medium">{formatDate(String(task.created_at))}</div>
                <div className="text-muted-foreground text-xs">Updated</div>
                <div className="font-medium">{formatDate(String(task.updated_at))}</div>
              </div>
              <div className="space-y-4">
                <Link to={`/tasks/${task.id}`} className="flex items-center gap-2" replace={true}>
                  <Button className="flex w-full">Task Detail</Button>
                </Link>
                <Button className="w-full bg-red-500 text-white" variant="outline">
                  Remove Task
                </Button>
              </div>
            </div>

            <div>
              <div className="text-muted-foreground mb-2 text-xs">Parameters</div>
              <pre className="max-h-[500px] overflow-auto rounded-md p-3 text-xs leading-relaxed">
                <div className="flex flex-col gap-4">
                  <QuantifiersDetail data={task.params.quantifiers} />
                  <CedentDetail title={'Antecedent'} data={task.params.ante} color="blue" />
                  <CedentDetail title={'Succedent'} data={task.params.succ} color="green" />
                  <CedentDetail title={'Condition'} data={task.params.cond} />
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="raw-json" className="border-0">
                      <AccordionTrigger className="py-2 text-xs">Raw JSON</AccordionTrigger>
                      <AccordionContent>
                        <pre className="bg-muted/40 overflow-auto rounded-md p-3 text-xs leading-relaxed">
                          {JSON.stringify(task.params ?? {}, null, 2)}
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                {(task.params.set1?.attributes?.length > 0 ||
                  task.params.set2?.attributes?.length > 0) && (
                  <div className="grid grid-cols-1 gap-6 border-t pt-6 md:grid-cols-2">
                    <CedentDetail title="Set 1" data={task.params.set1} />
                    <CedentDetail title="Set 2" data={task.params.set2} />
                  </div>
                )}
              </pre>
            </div>
          </div>
        </AccordionContent>
      </CardContent>
    </Card>
  );
}
