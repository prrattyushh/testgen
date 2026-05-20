// src/pages/teacher/TestView.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { WEBHOOKS } from '../../config/webhooks';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function TeacherTestView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    axios.get(`${WEBHOOKS.TEACHER_GENERATE}/${id}`)
      .then((res) => setTest(res.data))
      .catch(() => setTest(null))
      .finally(() => setLoading(false));
  }, [id]);

  const copyLink = async () => {
    if (!test?.form_link) return;
    await navigator.clipboard.writeText(test.form_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="h-48 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />;
  }

  if (!test) {
    return (
      <div className="text-center py-16 text-zinc-400 dark:text-zinc-500 space-y-3">
        <p>Test not found.</p>
        <Button variant="outline" onClick={() => navigate('/teacher/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/teacher/dashboard')} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="font-heading text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {test.topic || 'Test'}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="accent">{test.cefr_level}</Badge>
            <Badge>{test.language}</Badge>
            <span className="font-mono text-xs text-zinc-400">{id}</span>
          </div>
        </div>
      </div>

      {/* Form link */}
      {test.form_link && (
        <Card>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
            Google Form Link
          </p>
          <div className="flex gap-2 mb-3">
            <input
              readOnly
              value={test.form_link}
              className="flex-1 font-mono text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-3 py-2 text-zinc-700 dark:text-zinc-300 min-w-0"
            />
            <Button variant="secondary" size="sm" onClick={copyLink}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <Button variant="primary" onClick={() => window.open(test.form_link, '_blank')}>
            Open Form ↗
          </Button>
        </Card>
      )}

      {/* Stats */}
      <Card>
        <div className="grid grid-cols-3 gap-4 text-center">
          <Stat label="Questions" value={test.num_questions || '—'} />
          <Stat label="Difficulty" value={test.difficulty || '—'} />
          <Stat label="Responses" value={test.response_count ?? '—'} accent={!!test.response_count} />
        </div>
      </Card>

      <Button variant="outline" onClick={() => navigate('/teacher/generate')} className="w-full">
        Generate New Test
      </Button>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div>
      <div className={`font-mono text-xl font-semibold ${accent ? 'text-emerald-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
        {value}
      </div>
      <div className="text-xs text-zinc-400 mt-0.5">{label}</div>
    </div>
  );
}
