// src/config/roles.js
// ─────────────────────────────────────────────
// ADD TEACHER AND STUDENT EMAILS HERE FOR V1
// In production this will be replaced by a webhook/sheet lookup
// ─────────────────────────────────────────────

export const TEACHER_EMAILS = [
  // "teacher@school.com",
  // Add teacher emails here
];

export const STUDENT_EMAILS = [
  // "student@school.com",
  // Add student emails here
];

// Returns 'teacher' | 'student' | 'unknown'
export function detectRole(email) {
  if (TEACHER_EMAILS.includes(email)) return "teacher";
  if (STUDENT_EMAILS.includes(email)) return "student";
  return "unknown"; // → redirect to /onboarding
}
