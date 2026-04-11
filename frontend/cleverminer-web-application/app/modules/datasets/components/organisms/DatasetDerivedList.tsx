import { GitBranch, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/organisms/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/molecules/card';
import { Skeleton } from '@/shared/components/ui/molecules/skeleton';
import { useQuery } from '@tanstack/react-query';
import { getDatasetChildrenTransformations } from '@/modules/datasets/api/dataset-analysis.api';
import { DerivedChildDatasetRow } from '@/modules/datasets/components/molecules';

interface DatasetDerivedListProps {
  datasetId: string;
}

export default function DatasetDerivedList({ datasetId }: DatasetDerivedListProps) {
  const {
    data: childrenTransformationsData,
    isLoading: childrenTransformationsLoading,
    error: childrenTransformationsError,
  } = useQuery({
    queryKey: ['dataset-children-transformations', datasetId],
    queryFn: () => getDatasetChildrenTransformations(datasetId!),
    enabled: !!datasetId,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="text-muted-foreground h-4 w-4" />
          <div>
            <CardTitle className="text-base">Derived datasets</CardTitle>
            {childrenTransformationsData && (
              <CardDescription>
                {childrenTransformationsData.children.length === 0
                  ? 'No derived datasets yet'
                  : `${childrenTransformationsData.children.length} derived dataset${childrenTransformationsData.children.length > 1 ? 's' : ''}`}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {childrenTransformationsLoading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        )}

        {childrenTransformationsError && (
          <div className="border-destructive/30 bg-destructive/5 text-destructive flex items-start gap-2 rounded-md border px-3 py-2 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {childrenTransformationsError.message}
          </div>
        )}

        {!childrenTransformationsLoading &&
          !childrenTransformationsError &&
          childrenTransformationsData?.children.length === 0 && (
            <p className="text-muted-foreground py-6 text-center text-sm">
              No derived datasets have been created from this dataset yet.
            </p>
          )}

        {!childrenTransformationsLoading &&
          !childrenTransformationsError &&
          childrenTransformationsData &&
          childrenTransformationsData.children.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-5" />
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Ready</TableHead>
                  <TableHead>Dataset</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {childrenTransformationsData.children.map((child) => (
                  <DerivedChildDatasetRow key={child.dataset_id} child={child} />
                ))}
              </TableBody>
            </Table>
          )}
      </CardContent>
    </Card>
  );
}
