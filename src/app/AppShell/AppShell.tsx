import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar/TopBar';
import { Sidebar } from './Sidebar/Sidebar';

export function AppShell() {
  return (
    <div className="layout-root">
      <TopBar />
      <div className="layout-body">
        <Sidebar />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
