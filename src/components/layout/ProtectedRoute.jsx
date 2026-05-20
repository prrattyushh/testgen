// src/components/layout/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';

export function RequireAuth({ children }) {
  const { user, role } = useAppStore();
  if (user === null && role === null) {
    // Still loading auth — show nothing briefly
    return null;
  }
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export function RequireRole({ role: requiredRole, children }) {
  const { user, role } = useAppStore();
  if (!user) return <Navigate to="/" replace />;
  if (role === 'unknown') return <Navigate to="/onboarding" replace />;
  if (role !== requiredRole) {
    // Wrong role — redirect to their correct dashboard
    return <Navigate to={role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace />;
  }
  return children;
}

export function RequireUnknown({ children }) {
  const { user, role } = useAppStore();
  if (!user) return <Navigate to="/" replace />;
  if (role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
  if (role === 'student') return <Navigate to="/student/dashboard" replace />;
  return children;
}
