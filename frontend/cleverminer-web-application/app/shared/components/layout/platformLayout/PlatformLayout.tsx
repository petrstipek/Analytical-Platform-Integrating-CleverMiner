import { Outlet } from 'react-router';
import { Topbar } from '../Topbar';
import { Sidebar } from './Sidebar';

export default function PlatformLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="bg-muted/30 flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
