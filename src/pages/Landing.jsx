// src/pages/Landing.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function Landing() {
  const { user, role, signIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if already signed in
  useEffect(() => {
    if (user && role) {
      if (role === 'teacher') navigate('/teacher/dashboard', { replace: true });
      else if (role === 'student') navigate('/student/dashboard', { replace: true });
      else if (role === 'unknown') navigate('/onboarding', { replace: true });
    }
  }, [user, role, navigate]);

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signIn();
    } catch (err) {
      setError('Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
      {/* Top bar */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2 font-heading font-semibold text-zinc-900 dark:text-zinc-100">
          <span className="w-6 h-6 rounded bg-accent flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.636-6.364l.707.707M6 20l1-1M18 20l-1-1M12 12a4 4 0 00-4-4" />
            </svg>
          </span>
          TestGen AI
        </div>
        <ThemeToggle />
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-lg w-full space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-light dark:bg-indigo-950 rounded text-xs font-medium text-accent dark:text-indigo-300">
              <span className="w-1.5 h-1.5 rounded-full bg-accent dark:bg-indigo-400" />
              AI-Powered Language Testing
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight tracking-tight">
              Generate tests.<br />
              <span className="text-accent">Track progress.</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
              Create MCQ language tests for any CEFR level in seconds. For teachers and self-study students.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded px-4 py-3 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm font-medium text-zinc-700 dark:text-zinc-300 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <svg className="animate-spin w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <GoogleIcon />
            )}
            {loading ? 'Signing in…' : 'Continue with Google'}
          </button>

          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Used exclusively for authentication. Your data is never shared.
          </p>
        </div>
      </div>

      {/* Features strip */}
      <div className="border-t border-zinc-100 dark:border-zinc-800 px-6 py-8">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { label: 'Languages', value: '23' },
            { label: 'CEFR Levels', value: 'A1–C2' },
            { label: 'Questions per test', value: '5–30' },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-mono text-xl font-semibold text-zinc-900 dark:text-zinc-100">{s.value}</div>
              <div className="text-xs text-zinc-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
