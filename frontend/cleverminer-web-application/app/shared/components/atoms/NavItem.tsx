import { NavLink } from 'react-router';

export default function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'text-sm font-medium transition-colors',
          'hover:text-foreground',
          isActive ? 'text-foreground' : 'text-muted-foreground',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  );
}
