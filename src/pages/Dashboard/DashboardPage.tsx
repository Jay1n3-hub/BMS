import { KPIBar } from './components/KPIBar';
import { ProjectHealthGrid } from './components/ProjectHealthGrid';
import { AtRiskTasksTable } from './components/AtRiskTasksTable';

export function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <KPIBar />
      <ProjectHealthGrid />
      <AtRiskTasksTable />
    </div>
  );
}
