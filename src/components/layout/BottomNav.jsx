// src/components/layout/BottomNav.jsx — mobile only
import { Link, useLocation } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';

export default function BottomNav() {
  const { user, role } = useAppStore();
  const location = useLocation();

  if (!user) return null;

  const dashboardPath = role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
  const generatePath = role === 'teacher' ? '/teacher/generate' : '/student/generate';

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex">
      <BottomNavItem
        to={dashboardPath}
        active={isActive(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard')}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        }
        label="Dashboard"
      />
      <BottomNavItem
        to={generatePath}
        active={isActive(generatePath)}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
          </svg>
        }
        label="Generate"
      />
    </nav>
  );
}

function BottomNavItem({ to, active, icon, label }) {
  return (
    <Link
      to={to}
      className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs transition-colors ${
        active
          ? 'text-accent'
          : 'text-zinc-400 dark:text-zinc-500'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
