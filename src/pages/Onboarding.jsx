// src/pages/Onboarding.jsx
// Shown when role is 'unknown'. Lets user select teacher or student.
// In V1 this is informational — actual role assignment is done by adding
// the email to src/config/roles.js manually.
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

export default function Onboarding() {
  const { user } = useAppStore();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Account not recognised
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Your email <span className="font-mono text-zinc-700 dark:text-zinc-300">{user?.email}</span> isn't on the access list yet.
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-6 text-left space-y-4">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">To get access:</p>
          <ol className="text-sm text-zinc-500 dark:text-zinc-400 space-y-2 list-decimal list-inside">
            <li>Contact your TestGen administrator</li>
            <li>Ask them to add <span className="font-mono text-zinc-700 dark:text-zinc-300">{user?.email}</span> to the roles list</li>
            <li>Sign in again once your role has been assigned</li>
          </ol>
        </div>

        <Button variant="outline" onClick={handleSignOut} className="w-full">
          Sign out and try a different account
        </Button>
      </div>
    </div>
  );
}
