import { NavLink } from 'react-router-dom';

const items = [
  ['Dashboard', '/dashboard'],
  ['Projects', '/projects'],
  ['Blockers', '/blockers'],
  ['Reports', '/reports'],
  ['Integrations', '/integrations'],
  ['Settings', '/settings'],
] as const;

export function Sidebar() {
  return (
    <aside className="sidebar">
      {items.map(([label, href]) => (
        <NavLink key={label} to={href} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          {label}
        </NavLink>
      ))}
    </aside>
  );
}
