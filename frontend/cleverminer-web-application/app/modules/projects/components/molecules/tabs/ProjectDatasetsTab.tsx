import { Database, FileText, Plus, UploadCloud } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

const MOCK_DATASETS = [
  { id: 1, name: 'Q1_Customer_Data.csv', size: '2.4 MB', uploaded: '2 mins ago' },
  { id: 2, name: 'Training_Set_V2.json', size: '145 KB', uploaded: '1 hour ago' },
  { id: 3, name: 'Legacy_Import_2024.xml', size: '12 MB', uploaded: 'Yesterday' },
];

export default function ProjectDatasetsTab() {
  return (
    <>
      <div className="space-y-2">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <UploadCloud className="h-5 w-5" /> Import Dataset
        </h3>
        <Card className="hover:bg-muted/40 border-2 border-dashed shadow-none transition-colors">
          <CardContent className="flex flex-col items-center justify-center space-y-4 py-10 text-center">
            <div className="bg-primary/10 rounded-full p-4">
              <Plus className="text-primary h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">Drag & drop your files here</p>
              <p className="text-muted-foreground text-sm">
                or <span className="text-primary cursor-pointer underline">browse files</span> to
                upload
              </p>
            </div>
            <p className="text-muted-foreground text-xs">Supports CSV</p>
            <Input type="file" className="hidden" />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Database className="h-5 w-5" /> Existing Datasets
          </h3>
          <Button variant="ghost" size="sm" className="h-8">
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {MOCK_DATASETS.map((dataset) => (
            <Card
              key={dataset.id}
              className="hover:border-primary/50 group cursor-pointer transition-all"
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-muted group-hover:bg-primary/10 group-hover:text-primary rounded-md p-2 transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="leading-none font-medium">{dataset.name}</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Size: {dataset.size} • Uploaded: {dataset.uploaded}
                    </p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  Select
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
