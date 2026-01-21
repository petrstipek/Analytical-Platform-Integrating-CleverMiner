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
import { DatasetUploadCard } from '@/modules/datasets/components/molecules';

export default function DatasetUploadPage() {
  const { mutate, isPending } = useUploadDatasetMutation();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dataset Upload</h1>
        <p className="text-muted-foreground">Upload new dataset to the platform</p>
      </div>
      <DatasetUploadCard isPending={isPending} onSubmit={(data) => mutate(data)} />
    </div>
  );
}
