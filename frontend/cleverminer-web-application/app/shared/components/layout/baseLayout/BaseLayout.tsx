import { Outlet } from 'react-router';
import { Topbar } from '../Topbar';
import Footer from '@/shared/components/layout/Footer';

export default function BaseLayout() {
  return (
    <div className="flex h-screen">
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="bg-muted/30 flex flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
