import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../AppShell/AppShell';
import { LoginPage } from '../../pages/Auth/LoginPage';
import { DashboardPage } from '../../pages/Dashboard/DashboardPage';
import { ProjectsListPage } from '../../pages/Projects/ProjectsListPage';
import { ProjectDetailPage } from '../../pages/Projects/ProjectDetailPage';
import { BlockersPage } from '../../pages/Blockers/BlockersPage';
import { ReportsPage } from '../../pages/Reports/ReportsPage';
import { IntegrationsPage } from '../../pages/Integrations/IntegrationsPage';
import { SettingsPage } from '../../pages/Settings/SettingsPage';

export function Router() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsListPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/blockers" element={<BlockersPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
