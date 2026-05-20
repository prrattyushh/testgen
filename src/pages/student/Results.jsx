// src/pages/student/Results.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';
import ResultChart from '../../components/test/ResultChart';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function Results() {
  const { lastResult } = useAppStore();
  const navigate = useNavigate();

  if (!lastResult) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-zinc-400 dark:text-zinc-500 text-sm">No results to show.</p>
        <Button variant="outline" onClick={() => navigate('/student/generate')}>Generate a test</Button>
      </div>
    );
  }

  const { score, total, percentage, topic_breakdown, wrong_answers, ai_recommendations } = lastResult;
  const passed = percentage >= 60;

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-slide-up">
      <h1 className="font-heading text-xl font-semibold text-zinc-900 dark:text-zinc-100">Results</h1>

      {/* Score card */}
      <Card className="text-center py-8">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 mb-4 ${
          passed
            ? 'border-emerald-400 text-emerald-500'
            : 'border-red-400 text-red-500'
        }`}>
          <span className="font-mono text-2xl font-bold">{percentage}%</span>
        </div>
        <div className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          {score} / {total}
        </div>
        <Badge variant={passed ? 'success' : 'error'} className="text-sm px-3 py-1">
          {passed ? 'Pass' : 'Fail'}
        </Badge>
      </Card>

      {/* Topic breakdown */}
      {topic_breakdown && Object.keys(topic_breakdown).length > 0 && (
        <Card>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-4">
            Topic Breakdown
          </p>
          <ResultChart topicBreakdown={topic_breakdown} />
          <div className="mt-3 space-y-2">
            {Object.entries(topic_breakdown).map(([topic, stats]) => (
              <div key={topic} className="flex items-center justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">{topic}</span>
                <span className="font-mono text-zinc-800 dark:text-zinc-200">
                  {stats.correct}/{stats.total}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Wrong answers */}
      {wrong_answers?.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Review Wrong Answers
          </p>
          {wrong_answers.map((item) => (
            <WrongAnswerCard key={item.question_number} item={item} />
          ))}
        </div>
      )}

      {/* AI recommendations */}
      {ai_recommendations && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 rounded bg-accent-light dark:bg-indigo-950 flex items-center justify-center">
              <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">AI Recommendations</span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{ai_recommendations}</p>
        </Card>
      )}

      <Button variant="primary" onClick={() => navigate('/student/generate')} className="w-full">
        Generate Another Test
      </Button>
    </div>
  );
}

function WrongAnswerCard({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm text-zinc-700 dark:text-zinc-300">
          Q{item.question_number}. {item.question_text?.slice(0, 60)}{item.question_text?.length > 60 ? '…' : ''}
        </span>
        <svg className={`w-4 h-4 text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 px-4 py-3 space-y-2 text-sm animate-slide-up">
          <p className="text-zinc-600 dark:text-zinc-400 mb-2">{item.question_text}</p>
          <div className="flex gap-4">
            <div>
              <span className="text-xs text-zinc-400 block mb-0.5">Your answer</span>
              <Badge variant="error">{item.your_answer}</Badge>
            </div>
            <div>
              <span className="text-xs text-zinc-400 block mb-0.5">Correct</span>
              <Badge variant="success">{item.correct_answer}</Badge>
            </div>
          </div>
          {item.explanation && (
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-2 leading-relaxed">{item.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
