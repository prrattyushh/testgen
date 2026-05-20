// src/hooks/useAuth.js
import { useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { detectRole } from '../config/roles';
import useAppStore from '../store/useAppStore';

export function useAuth() {
  const { user, role, setUser, setRole } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setRole(detectRole(firebaseUser.email));
      } else {
        setUser(null);
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, [setUser, setRole]);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Sign in error:', err);
      throw err;
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
  };

  return { user, role, signIn, signOut: signOutUser };
}
