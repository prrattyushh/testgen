// src/components/ui/Card.jsx
export default function Card({ children, className = '', onClick }) {
  const base = 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-5';
  const interactive = onClick ? 'cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors' : '';
  return (
    <div className={`${base} ${interactive} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}
