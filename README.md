# TestGen AI — PWA

AI-powered language test generation for teachers and students.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in environment variables
cp .env.example .env

# 3. Configure Firebase
# Edit src/config/firebase.js OR set VITE_FIREBASE_* env vars

# 4. Add your webhook URLs
# Edit src/config/webhooks.js

# 5. Add user roles
# Edit src/config/roles.js — add teacher and student emails

# 6. Run dev server
npm run dev
```

## Configuration Files

| File | Purpose |
|---|---|
| `src/config/webhooks.js` | All N8N webhook URLs |
| `src/config/firebase.js` | Firebase credentials |
| `src/config/roles.js` | Teacher + student email lists |
| `src/config/languages.js` | Supported languages + CEFR levels |
| `.env` | Firebase env vars (preferred for prod) |

## Build & Deploy

```bash
npm run build       # Production build → dist/
npm run preview     # Preview production build locally
```

Deploy the `dist/` folder to Vercel. The `vercel.json` handles SPA routing (no 404 on refresh).

## PWA Icons

Replace the placeholder icons in `public/` with your real branded icons:
- `pwa-192x192.png`
- `pwa-512x512.png`
- `apple-touch-icon.png`
- `favicon.ico`

Use https://realfavicongenerator.net to generate all sizes from one source image.

## Project Structure

```
src/
├── config/         ← All configurable values live here
├── store/          ← Zustand state (auth, test, results, theme)
├── hooks/          ← useAuth, useRole
├── components/
│   ├── layout/     ← Navbar, BottomNav, ProtectedRoute
│   ├── ui/         ← Button, Card, Badge, ThemeToggle
│   └── test/       ← GenerateForm, MCQQuestion, Timer, ResultChart
└── pages/
    ├── Landing.jsx
    ├── Onboarding.jsx
    ├── teacher/    ← Dashboard, Generate, TestView
    └── student/    ← Dashboard, Generate, TakeTest, Results
```

## Role Detection

V1 uses a static email list in `src/config/roles.js`. Add emails there.  
Unknown emails land on `/onboarding` with instructions.

## Webhook Payloads

### Teacher / Student Generate
```json
{
  "language": "fr",
  "cefr_level": "B1",
  "topic": "past tense",
  "num_questions": 10,
  "difficulty": "Medium",
  "user_email": "user@example.com",
  "user_role": "teacher"
}
```

### Student Evaluate
```json
{
  "test_id": "abc123",
  "user_email": "student@example.com",
  "answers": { "1": "B", "2": "A" },
  "time_taken_seconds": 240
}
```
