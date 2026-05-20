// src/hooks/useRole.js
import useAppStore from '../store/useAppStore';

export function useRole() {
  const role = useAppStore((s) => s.role);
  return {
    role,
    isTeacher: role === 'teacher',
    isStudent: role === 'student',
    isUnknown: role === 'unknown',
  };
}
