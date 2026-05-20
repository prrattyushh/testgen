// src/components/test/Timer.jsx
import { useState, useEffect, useRef } from 'react';

export default function Timer({ durationSeconds, onExpire }) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const warningThreshold = Math.min(60, durationSeconds * 0.1);
  const warned = useRef(false);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire?.();
      return;
    }
    const id = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, [remaining, onExpire]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const isWarning = remaining <= warningThreshold;

  return (
    <div className={`flex items-center gap-1.5 font-mono text-sm font-medium ${isWarning ? 'text-red-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className={isWarning ? 'animate-pulse' : ''}>{timeStr}</span>
    </div>
  );
}
