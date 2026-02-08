import React, { useMemo, useState } from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/organisms/table';
import { Button } from '@/shared/components/ui/atoms/button';
import { Input } from '@/shared/components/ui/atoms/input';
import { Search, ChevronLeft, ChevronRight, Inbox, Download } from 'lucide-react';
import { ProceduresType } from '@/shared/domain/procedures.type';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/atoms/select';
import { Card, CardContent } from '@/shared/components/ui/molecules/card';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showSearch?: boolean;
  onRowClick?: (row: TData) => void;
  exportData?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  showSearch = false,
  onRowClick,
  exportData,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const procedureColumn = table.getColumn('procedure');
  const showProcedureFilter = !!procedureColumn;
  const procedureOptions = useMemo(() => Object.values(ProceduresType), []);
  const selectedProcedure =
    (procedureColumn?.getFilterValue() as ProceduresType | undefined) ?? 'all';

  return (
    <div className="space-y-4">
      {(showSearch || showProcedureFilter || exportData) && (
        <Card>
          <CardContent className="flex items-center px-5">
            <div className="flex flex-1 flex-row gap-3">
              {showSearch && (
                <div className="relative w-full sm:max-w-sm">
                  <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                  <Input
                    placeholder="Filter tasks by name..."
                    value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                      table.getColumn('name')?.setFilterValue(event.target.value)
                    }
                    className="bg-white pl-9"
                  />
                </div>
              )}

              {showProcedureFilter && (
                <div className="w-full sm:w-[260px]">
                  <Select
                    value={selectedProcedure}
                    onValueChange={(value) => {
                      if (value === 'all') procedureColumn.setFilterValue(undefined);
                      else procedureColumn!.setFilterValue(value);
                    }}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Filter by procedure" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="all">All procedures</SelectItem>
                      {procedureOptions.map((procedure) => (
                        <SelectItem key={procedure} value={procedure}>
                          {procedure}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            {exportData && (
              <Button variant="secondary" onClick={exportData}>
                Export data <Download />
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="overflow-hidden rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-cleverminer-three">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-slate-200">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-10 text-xs font-semibold tracking-wider text-white uppercase"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row.original)}
                  data-state={row.getIsSelected() && 'selected'}
                  className="cursor-pointer transition-colors hover:bg-slate-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="text-muted-foreground flex flex-col items-center justify-center">
                    <Inbox className="mb-2 h-8 w-8 opacity-20" />
                    <p>No results found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-muted-foreground text-sm">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
