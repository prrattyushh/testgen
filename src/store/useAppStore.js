// src/store/useAppStore.js
import { create } from 'zustand'

const useAppStore = create((set) => ({
  // Auth
  user: null,
  role: null, // 'teacher' | 'student' | 'unknown' | null
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),

  // Current test being taken (student)
  currentTest: null,
  setCurrentTest: (test) => set({ currentTest: test }),

  // Student answers in progress
  answers: {},
  setAnswer: (questionNum, answer) =>
    set((state) => ({ answers: { ...state.answers, [questionNum]: answer } })),
  clearAnswers: () => set({ answers: {} }),

  // Results after submission
  lastResult: null,
  setLastResult: (result) => set({ lastResult: result }),

  // Theme
  darkMode: false,
  toggleDarkMode: () => set((state) => {
    const next = !state.darkMode;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('testgen-dark', next ? '1' : '0');
    return { darkMode: next };
  }),
  initTheme: () => {
    const saved = localStorage.getItem('testgen-dark');
    const dark = saved === '1';
    document.documentElement.classList.toggle('dark', dark);
    set({ darkMode: dark });
  },
}))

export default useAppStore
