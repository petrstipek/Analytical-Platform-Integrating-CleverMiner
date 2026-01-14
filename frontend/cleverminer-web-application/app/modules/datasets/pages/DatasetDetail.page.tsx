import { DatasetAnalysisView } from '@/modules/datasets/components/organisms';
import { useParams } from 'react-router';

export default function DatasetDetailPage() {
  const { id } = useParams();
  return <DatasetAnalysisView datasetId={Number(id)} />;
}
