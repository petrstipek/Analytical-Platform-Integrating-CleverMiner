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
import { ModulePagesHeader, PlatformCard } from '@/shared/components/molecules';

export default function DatasetUploadPage() {
  const { mutate, isPending } = useUploadDatasetMutation();

  return (
    <div>
      <ModulePagesHeader
        title={'Dataset Upload'}
        description={'Upload new dataset to the platform'}
      />
      <DatasetUploadCard isPending={isPending} onSubmit={(data) => mutate(data)} />
    </div>
  );
}
