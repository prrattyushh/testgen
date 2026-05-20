// src/pages/student/TakeTest.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { WEBHOOKS } from '../../config/webhooks';
import useAppStore from '../../store/useAppStore';
import MCQQuestion from '../../components/test/MCQQuestion';
import Timer from '../../components/test/Timer';
import Button from '../../components/ui/Button';

const TIMER_OPTIONS = [
  { label: 'No timer', value: null },
  { label: '10 min', value: 600 },
  { label: '15 min', value: 900 },
  { label: '20 min', value: 1200 },
  { label: '30 min', value: 1800 },
];

export default function TakeTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, currentTest, setCurrentTest, answers, setAnswer, clearAnswers, setLastResult } = useAppStore();

  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timerDuration, setTimerDuration] = useState(null);
  const [timerExpired, setTimerExpired] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const startTimeRef = useRef(null);

  // Load test if not in store
  useEffect(() => {
    if (!currentTest || currentTest.test_id !== id) {
      // Fetch from webhook if navigated directly
      axios.get(`${WEBHOOKS.STUDENT_GENERATE}/${id}`)
        .then((res) => {
          setCurrentTest(res.data);
          clearAnswers();
        })
        .catch(() => navigate('/student/dashboard'));
    } else {
      clearAnswers();
    }
  }, [id]);

  const questions = currentTest?.questions || [];
  const current = questions[currentIdx];
  const total = questions.length;
  const answered = Object.keys(answers).length;

  const handleStart = () => {
    startTimeRef.current = Date.now();
    setStarted(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    const timeTaken = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0;
    try {
      const res = await axios.post(WEBHOOKS.STUDENT_EVALUATE, {
        test_id: id,
        user_email: user.email,
        answers,
        time_taken_seconds: timeTaken,
      });
      setLastResult(res.data);
      navigate(`/student/results/${res.data.result_id}`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Submission failed. Please try again.');
      setShowConfirm(false);
    } finally {
      setSubmitting(false);
    }
  };

  // Pre-start screen
  if (!started) {
    return (
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="font-heading text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {currentTest?.topic || 'Test'}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {total} questions · {currentTest?.cefr_level} · {currentTest?.language}
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-5 space-y-4">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Timer (optional)</p>
          <div className="grid grid-cols-3 gap-2">
            {TIMER_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setTimerDuration(opt.value)}
                className={`px-3 py-2 rounded text-sm border transition-colors ${
                  timerDuration === opt.value
                    ? 'border-accent bg-accent-light dark:bg-indigo-950 text-accent dark:text-indigo-300'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-400">Timer won't auto-submit — it'll warn you when time is up.</p>
        </div>

        <Button variant="primary" size="lg" onClick={handleStart} className="w-full">
          Start Test
        </Button>
      </div>
    );
  }

  // Confirm submit dialog
  if (showConfirm) {
    const unanswered = total - answered;
    return (
      <div className="max-w-md mx-auto space-y-5 animate-fade-in">
        <h2 className="font-heading text-lg font-semibold text-zinc-900 dark:text-zinc-100">Submit test?</h2>
        {unanswered > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
            {unanswered} question{unanswered > 1 ? 's' : ''} unanswered.
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        <p className="text-sm text-zinc-500 dark:text-zinc-400">You've answered {answered} of {total} questions. This can't be undone.</p>
        <div className="flex gap-3">
          <Button variant="primary" onClick={handleSubmit} loading={submitting} className="flex-1">
            Submit
          </Button>
          <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={submitting} className="flex-1">
            Go back
          </Button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const isLast = currentIdx === total - 1;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Question {currentIdx + 1} of {total}
            </span>
            {timerExpired && (
              <span className="text-xs text-red-500 font-medium">Time's up!</span>
            )}
          </div>
          {/* Progress bar */}
          <div className="w-48 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
            />
          </div>
        </div>
        {timerDuration && (
          <Timer
            durationSeconds={timerDuration}
            onExpire={() => setTimerExpired(true)}
          />
        )}
      </div>

      {/* Question */}
      <MCQQuestion
        question={current}
        selectedAnswer={answers[current.question_number]}
        onSelect={(opt) => setAnswer(current.question_number, opt)}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
        >
          ← Previous
        </Button>

        {isLast ? (
          <Button variant="primary" onClick={() => setShowConfirm(true)}>
            Submit Test
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => setCurrentIdx((i) => Math.min(total - 1, i + 1))}
          >
            Next →
          </Button>
        )}
      </div>

      {/* Question dots */}
      <div className="flex flex-wrap gap-1.5 pt-2">
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            className={`w-7 h-7 rounded text-xs font-mono font-medium transition-colors ${
              i === currentIdx
                ? 'bg-accent text-white'
                : answers[q.question_number]
                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
