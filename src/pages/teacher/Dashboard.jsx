// src/pages/teacher/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { WEBHOOKS } from '../../config/webhooks';
import useAppStore from '../../store/useAppStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function TeacherDashboard() {
  const { user } = useAppStore();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch teacher's past tests
    axios.get(`${WEBHOOKS.TEACHER_GENERATE}?email=${encodeURIComponent(user?.email)}`)
      .then((res) => setTests(res.data?.tests || []))
      .catch(() => setTests([]))
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
            {user?.displayName ? `Welcome back, ${user.displayName.split(' ')[0]}` : 'Your generated tests'}
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/teacher/generate')}>
          + Generate Test
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1,2,3].map((i) => (
            <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
          ))}
        </div>
      ) : tests.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-zinc-400 dark:text-zinc-500 space-y-2">
            <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">No tests generated yet</p>
            <Button variant="primary" size="sm" onClick={() => navigate('/teacher/generate')}>
              Generate your first test
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tests.map((test) => (
            <Card
              key={test.test_id}
              onClick={() => navigate(`/teacher/test/${test.test_id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2">
                  <Badge variant="accent">{test.cefr_level}</Badge>
                  <Badge>{test.language}</Badge>
                </div>
                <span className="font-mono text-xs text-zinc-400">{test.test_id}</span>
              </div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">{test.topic}</p>
              <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 mt-3">
                <span>{test.num_questions} questions · {test.difficulty}</span>
                <span>{test.date ? new Date(test.date).toLocaleDateString() : '—'}</span>
              </div>
              {test.response_count !== undefined && (
                <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                  {test.response_count} student responses
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
