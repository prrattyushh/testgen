// src/pages/teacher/Generate.jsx
import GenerateForm from '../../components/test/GenerateForm';

export default function TeacherGenerate() {
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-heading text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Generate Test
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          AI will generate a Google Form MCQ test ready to share with students.
        </p>
      </div>
      <GenerateForm role="teacher" />
    </div>
  );
}
