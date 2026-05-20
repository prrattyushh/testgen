// src/components/test/MCQQuestion.jsx
const OPTIONS = ['A', 'B', 'C', 'D'];

export default function MCQQuestion({ question, selectedAnswer, onSelect }) {
  return (
    <div className="space-y-4 animate-slide-up">
      <p className="text-base font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed">
        {question.question_text}
      </p>
      <div className="space-y-2">
        {OPTIONS.map((opt) => {
          const text = question.options[opt];
          if (!text) return null;
          const selected = selectedAnswer === opt;
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded border transition-all ${
                selected
                  ? 'border-accent bg-accent-light dark:bg-indigo-950 text-accent dark:text-indigo-300'
                  : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
            >
              <span className={`w-7 h-7 rounded flex items-center justify-center text-sm font-mono font-medium shrink-0 ${
                selected
                  ? 'bg-accent text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
              }`}>
                {opt}
              </span>
              <span className="text-sm">{text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
