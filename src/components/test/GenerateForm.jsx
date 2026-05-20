// src/components/test/GenerateForm.jsx
// Shared by teacher and student. Role prop determines which webhook to call.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { WEBHOOKS } from '../../config/webhooks';
import { LANGUAGES, CEFR_LEVELS, DIFFICULTY_LEVELS } from '../../config/languages';
import useAppStore from '../../store/useAppStore';
import Button from '../ui/Button';

export default function GenerateForm({ role }) {
  const { user, setCurrentTest } = useAppStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    language: 'fr',
    cefr_level: 'B1',
    topic: '',
    num_questions: 10,
    difficulty: 'Medium',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teacherResult, setTeacherResult] = useState(null); // { test_id, form_link }
  const [copied, setCopied] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        ...form,
        num_questions: Number(form.num_questions),
        user_email: user.email,
        user_role: role,
      };
      const webhook = role === 'teacher' ? WEBHOOKS.TEACHER_GENERATE : WEBHOOKS.STUDENT_GENERATE;
      const res = await axios.post(webhook, payload);
      const data = res.data;

      if (role === 'teacher') {
        setTeacherResult(data); // { test_id, form_link }
      } else {
        // Student: store full test and navigate
        setCurrentTest(data);
        navigate(`/student/test/${data.test_id}`);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(teacherResult.form_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Show result for teacher after generation
  if (teacherResult) {
    return (
      <div className="space-y-5 animate-slide-up">
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 text-emerald-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="font-medium text-emerald-800 dark:text-emerald-300">Test generated successfully</span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Test ID</p>
          <p className="font-mono text-sm text-zinc-900 dark:text-zinc-100 mb-4">{teacherResult.test_id}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Google Form Link</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={teacherResult.form_link}
              className="flex-1 font-mono text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded px-3 py-2 text-zinc-700 dark:text-zinc-300 min-w-0"
            />
            <Button variant="secondary" size="sm" onClick={copyLink}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={() => window.open(teacherResult.form_link, '_blank')}
          >
            Open Form ↗
          </Button>
          <Button
            variant="outline"
            onClick={() => { setTeacherResult(null); setForm({ language: 'fr', cefr_level: 'B1', topic: '', num_questions: 10, difficulty: 'Medium' }); }}
          >
            Generate Another
          </Button>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Share this Google Form link with your students. Responses will be collected automatically.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Language">
          <Select value={form.language} onChange={(v) => set('language', v)}>
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
          </Select>
        </Field>

        <Field label="CEFR Level">
          <Select value={form.cefr_level} onChange={(v) => set('cefr_level', v)}>
            {CEFR_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </Select>
        </Field>

        <Field label="Topic / Focus Area" className="sm:col-span-2">
          <input
            type="text"
            required
            placeholder="e.g. past tense verbs, travel vocabulary"
            value={form.topic}
            onChange={(e) => set('topic', e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </Field>

        <Field label="Number of Questions">
          <input
            type="number"
            min={5}
            max={30}
            value={form.num_questions}
            onChange={(e) => set('num_questions', e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <p className="text-xs text-zinc-400 mt-1">Min 5 · Max 30</p>
        </Field>

        <Field label="Difficulty">
          <Select value={form.difficulty} onChange={(v) => set('difficulty', v)}>
            {DIFFICULTY_LEVELS.map((d) => <option key={d} value={d}>{d}</option>)}
          </Select>
        </Field>
      </div>

      <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full sm:w-auto">
        {loading ? 'Generating…' : 'Generate Test'}
      </Button>
    </form>
  );
}

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function Select({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-accent"
    >
      {children}
    </select>
  );
}
