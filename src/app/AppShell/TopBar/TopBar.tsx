import { ProjectSwitcher } from './ProjectSwitcher';
import { GlobalSearch } from './GlobalSearch';
import { NotificationsBell } from './NotificationsBell';
import { UserMenu } from './UserMenu';

export function TopBar() {
  return (
    <header className="topbar">
      <div className="logo">BMS</div>
      <ProjectSwitcher />
      <GlobalSearch />
      <NotificationsBell />
      <UserMenu />
    </header>
  );
}
