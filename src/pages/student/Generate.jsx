// src/pages/student/Generate.jsx
import GenerateForm from '../../components/test/GenerateForm';

export default function StudentGenerate() {
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-heading text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Generate Test
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          AI will generate a personalised MCQ test. You'll take it right here.
        </p>
      </div>
      <GenerateForm role="student" />
    </div>
  );
}
