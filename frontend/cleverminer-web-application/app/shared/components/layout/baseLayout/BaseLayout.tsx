import { Outlet } from 'react-router';
import { Topbar } from '../Topbar';

export default function BaseLayout() {
  return (
    <div className="flex h-screen">
      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="bg-muted/30 flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
