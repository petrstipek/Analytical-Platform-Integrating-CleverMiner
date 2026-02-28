import NavigationTile from '@/shared/components/atoms/NavigationTile';
import { useNavigate } from 'react-router';
import { DatabaseZap, Grip, Pickaxe, UserRound } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-10 px-6 py-12">
      <div className="text-center">
        <p className="mb-3 text-xs tracking-widest text-stone-400 uppercase">Welcome back</p>
        <h1 className="text-3xl font-semibold text-stone-800">What are you working on?</h1>
      </div>
      <div className="grid w-full max-w-2xl grid-cols-2 gap-4">
        <NavigationTile
          label="Datasets"
          description="Browse and manage your data sources"
          icon={<DatabaseZap />}
          accent="#2D6BE4"
          onClick={() => navigate('/datasets')}
        />
        <NavigationTile
          label="Projects"
          description="Organise work into projects"
          icon={<UserRound />}
          accent="#16A37F"
          onClick={() => navigate('/projects')}
        />
        <NavigationTile
          label="Tasks"
          description="Track and complete pending work"
          icon={<Grip />}
          accent="#9B5CF6"
          onClick={() => navigate('/tasks')}
        />
        <NavigationTile
          label="Data Mining Runs"
          description="Monitor and trigger mining jobs"
          icon={<Pickaxe />}
          accent="#E4820D"
          onClick={() => navigate('/runs')}
        />
      </div>
    </div>
  );
}
