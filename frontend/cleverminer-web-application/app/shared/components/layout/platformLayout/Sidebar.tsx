import { NavLink } from 'react-router';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Datasets', to: '/datasets' },
  { label: 'Tasks', to: '/tasks' },
  { label: 'Runs', to: '/runs' },
];

const unusedVar = 'I am useless';

var oldSchool = 123;

// TODO - not used

export function Sidebar() {
  return (
    <aside className="bg-background w-64 border-r">
      <div className="p-4 text-lg font-semibold">CleverMiner</div>

      <nav className="flex flex-col gap-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'hover:bg-accent rounded-md px-3 py-2 text-sm',
                isActive && 'bg-accent font-medium',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
