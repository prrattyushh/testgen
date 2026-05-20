// src/config/webhooks.js
// ─────────────────────────────────────────────
// EDIT THIS FILE TO UPDATE WEBHOOK ENDPOINTS
// ─────────────────────────────────────────────

export const WEBHOOKS = {
  // Workflow 1 — Teacher test generation
  TEACHER_GENERATE: "https://YOUR_N8N_INSTANCE/webhook/teacher-generate",

  // Workflow 2 — Google Form creation (called after teacher generation)
  TEACHER_CREATE_FORM: "https://YOUR_N8N_INSTANCE/webhook/create-form",

  // Workflow 4 — Student test generation (separate sheet)
  STUDENT_GENERATE: "https://YOUR_N8N_INSTANCE/webhook/student-generate",

  // Workflow 5 — Student answer evaluation + AI recommendation
  STUDENT_EVALUATE: "https://YOUR_N8N_INSTANCE/webhook/student-evaluate",

  // Workflow 3 — Teacher weekly report (triggered manually from dashboard)
  TEACHER_REPORT: "https://YOUR_N8N_INSTANCE/webhook/teacher-report",
};
