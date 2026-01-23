import { ScrollArea, ScrollBar } from '@/shared/components/ui/molecules/scroll-area';
import type { DatasetPreviewResponse } from '@/modules/datasets/api/types/clmGuidance.type';

type DatasetPreviewProps = {
  preview: DatasetPreviewResponse;
};

export default function DatasetPreview({ preview }: DatasetPreviewProps) {
  return (
    <ScrollArea className="h-[600px] w-full max-w-full min-w-0 rounded-md border">
      <div className="min-w-max">
        <table className="text-left text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50 font-semibold text-gray-700 shadow-sm">
            <tr>
              {preview.columns.map((col) => (
                <th key={col} className="border-b px-4 py-3 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {preview.data.map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-gray-50">
                {preview.columns.map((col) => (
                  <td
                    key={col}
                    className="max-w-[240px] truncate border-b px-4 py-2 whitespace-nowrap"
                  >
                    {row[col] ?? <span className="text-gray-300 italic">null</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
