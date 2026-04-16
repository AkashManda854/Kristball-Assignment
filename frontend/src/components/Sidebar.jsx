import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/purchases', label: 'Purchases' },
  { to: '/transfers', label: 'Transfers' },
  { to: '/assignments', label: 'Assignments' },
];

export default function Sidebar() {
  const { user } = useAuth();

  const allowedRoutesByRole = {
    ADMIN: navItems,
    BASE_COMMANDER: navItems,
    LOGISTICS_OFFICER: navItems.filter((item) => item.to === '/purchases' || item.to === '/transfers'),
  };

  const items = allowedRoutesByRole[user?.role] ?? navItems;

  return (
    <aside className="w-full lg:w-72 shrink-0 rounded-3xl border border-white/10 bg-steel/80 shadow-panel backdrop-blur px-5 py-6">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.4em] text-brass/90">Operational Control</div>
        <h1 className="mt-3 text-2xl font-semibold text-white">Military Asset Management</h1>
        <p className="mt-2 text-sm text-sand/70">{user?.name} • {user?.role?.replaceAll('_', ' ')}</p>
      </div>

      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `block rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-brass text-ink' : 'text-sand/80 hover:bg-white/5 hover:text-white'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
