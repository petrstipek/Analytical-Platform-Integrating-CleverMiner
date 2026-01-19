import { DatasetAnalysisView } from '@/modules/datasets/components/organisms';
import { useParams } from 'react-router';

export default function DatasetDetailPage() {
  const { datasetId } = useParams();
  return <DatasetAnalysisView datasetId={Number(datasetId)} />;
}
