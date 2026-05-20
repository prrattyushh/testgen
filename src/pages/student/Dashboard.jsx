// src/pages/student/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { WEBHOOKS } from '../../config/webhooks';
import useAppStore from '../../store/useAppStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function StudentDashboard() {
  const { user } = useAppStore();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${WEBHOOKS.STUDENT_GENERATE}?email=${encodeURIComponent(user?.email)}`)
      .then((res) => setAttempts(res.data?.attempts || []))
      .catch(() => setAttempts([]))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {user?.displayName ? `Welcome back, ${user.displayName.split(' ')[0]}` : 'Your test history'}
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/student/generate')}>
          + New Test
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2].map((i) => <div key={i} className="h-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />)}
        </div>
      ) : attempts.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-zinc-400 dark:text-zinc-500 space-y-2">
            <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-sm">No tests taken yet</p>
            <Button variant="primary" size="sm" onClick={() => navigate('/student/generate')}>
              Take your first test
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {attempts.map((attempt) => (
            <Card
              key={attempt.result_id}
              onClick={() => navigate(`/student/results/${attempt.result_id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="accent">{attempt.cefr_level}</Badge>
                  <Badge>{attempt.language}</Badge>
                </div>
                <span className={`font-mono text-sm font-semibold ${attempt.percentage >= 60 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {attempt.percentage}%
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mt-2">{attempt.topic}</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                {attempt.score}/{attempt.total} correct · {attempt.date ? new Date(attempt.date).toLocaleDateString() : ''}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
