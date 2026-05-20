// src/components/layout/Navbar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import useAppStore from '../../store/useAppStore';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, role } = useAppStore();
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const dashboardPath = role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
  const generatePath = role === 'teacher' ? '/teacher/generate' : '/student/generate';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <header className="hidden md:flex fixed top-0 inset-x-0 z-40 h-14 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto w-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to={dashboardPath} className="flex items-center gap-2 font-heading font-semibold text-zinc-900 dark:text-zinc-100">
          <span className="w-6 h-6 rounded bg-accent flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.636-6.364l.707.707M6 20l1-1M18 20l-1-1M12 12a4 4 0 00-4-4" />
            </svg>
          </span>
          TestGen
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <NavLink to={dashboardPath} active={location.pathname.includes('dashboard')}>Dashboard</NavLink>
          <NavLink to={generatePath} active={location.pathname.includes('generate')}>Generate</NavLink>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex items-center gap-2.5">
            {user.photoURL && (
              <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full" referrerPolicy="no-referrer" />
            )}
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{user.displayName?.split(' ')[0]}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-3 py-1.5 text-sm rounded transition-colors ${
        active
          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium'
          : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
      }`}
    >
      {children}
    </Link>
  );
}
