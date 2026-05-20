// src/App.jsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAppStore from './store/useAppStore';
import { useAuth } from './hooks/useAuth';
import { RequireAuth, RequireRole, RequireUnknown } from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';

// Pages
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherGenerate from './pages/teacher/Generate';
import TeacherTestView from './pages/teacher/TestView';
import StudentDashboard from './pages/student/Dashboard';
import StudentGenerate from './pages/student/Generate';
import TakeTest from './pages/student/TakeTest';
import Results from './pages/student/Results';

function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-body">
      <Navbar />
      <main className="pt-0 md:pt-14 pb-16 md:pb-0 px-4 sm:px-6 max-w-6xl mx-auto py-6 md:py-10">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  const { initTheme } = useAppStore();
  useAuth(); // sets up Firebase auth listener

  useEffect(() => {
    initTheme();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />

        {/* Onboarding — only for unknown role */}
        <Route
          path="/onboarding"
          element={
            <RequireAuth>
              <RequireUnknown>
                <Onboarding />
              </RequireUnknown>
            </RequireAuth>
          }
        />

        {/* Teacher routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <RequireAuth>
              <RequireRole role="teacher">
                <AppShell><TeacherDashboard /></AppShell>
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/teacher/generate"
          element={
            <RequireAuth>
              <RequireRole role="teacher">
                <AppShell><TeacherGenerate /></AppShell>
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/teacher/test/:id"
          element={
            <RequireAuth>
              <RequireRole role="teacher">
                <AppShell><TeacherTestView /></AppShell>
              </RequireRole>
            </RequireAuth>
          }
        />

        {/* Student routes */}
        <Route
          path="/student/dashboard"
          element={
            <RequireAuth>
              <RequireRole role="student">
                <AppShell><StudentDashboard /></AppShell>
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/student/generate"
          element={
            <RequireAuth>
              <RequireRole role="student">
                <AppShell><StudentGenerate /></AppShell>
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/student/test/:id"
          element={
            <RequireAuth>
              <RequireRole role="student">
                <AppShell><TakeTest /></AppShell>
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/student/results/:id"
          element={
            <RequireAuth>
              <RequireRole role="student">
                <AppShell><Results /></AppShell>
              </RequireRole>
            </RequireAuth>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
