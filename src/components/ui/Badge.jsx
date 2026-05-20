// src/components/ui/Badge.jsx
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    accent: 'bg-accent-light text-accent dark:bg-indigo-950 dark:text-indigo-300',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    error: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium font-mono ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
