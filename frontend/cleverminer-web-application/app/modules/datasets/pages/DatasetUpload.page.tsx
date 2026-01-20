import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileSpreadsheet, Upload, Loader2, FileText } from 'lucide-react';

import { Button } from '@/shared/components/ui/atoms/button';
import { Input } from '@/shared/components/ui/atoms/input';
import { Label } from '@/shared/components/ui/atoms/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/molecules/card';
import { useUploadDatasetMutation } from '../hooks/datasets.hook';

type FormValues = {
  name: string;
};

export default function DatasetUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { mutate, isPending } = useUploadDatasetMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    if (!selectedFile) {
      alert('Please select a CSV file.');
      return;
    }

    mutate({
      name: data.name,
      file: selectedFile,
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dataset Upload</h1>
        <p className="text-muted-foreground">Upload new dataset to the platform</p>
      </div>
      <Card className="w-full border shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <FileSpreadsheet className="text-primary h-6 w-6" />
            </div>
            <div>
              <CardTitle>Upload Dataset</CardTitle>
              <CardDescription>Add a new CSV file to your analytical workspace.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Dataset Name</Label>
              <Input
                id="name"
                placeholder="e.g. Titanic Passengers 2024"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>CSV Data File</Label>
              <div className="flex w-full items-center justify-center">
                <label
                  htmlFor="dropzone-file"
                  className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${selectedFile ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'} `}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    {selectedFile ? (
                      <>
                        <FileText className="mb-3 h-10 w-10 text-green-600" />
                        <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="mb-3 h-10 w-10 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          <span className="text-primary font-semibold">Click to upload</span> or
                          drag and drop
                        </p>
                        <p className="mt-1 text-xs text-gray-400">CSV files only (max 50MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setSelectedFile(file);
                    }}
                  />
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full font-medium"
              size="lg"
              disabled={isPending || !selectedFile}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Uploading...' : 'Upload Dataset'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
