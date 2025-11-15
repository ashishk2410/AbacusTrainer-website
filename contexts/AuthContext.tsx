'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserByEmail } from '@/lib/firestore';
import { User } from '@/lib/types';

// Helper to check if env vars are available (same as in firebase.ts)
function hasEnvVars(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  return !!(apiKey && authDomain && projectId && storageBucket);
}

interface AuthContextType {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    
    try {
      // Immediately set loading to false if we can't initialize
      // This prevents the app from hanging
      if (typeof window === 'undefined') {
        // Server-side: don't try to initialize Firebase
        if (mounted) {
          setLoading(false);
        }
        return () => {
          mounted = false;
        };
      }
      // Check if Firebase is configured before setting up listener
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      if (!apiKey) {
        console.warn('Firebase environment variables not configured. Auth features will be disabled.');
        if (mounted) {
          setLoading(false);
        }
        return () => {
          mounted = false;
        };
      }

      // Only call onAuthStateChanged if Firebase is properly configured
      // Check if auth object is valid before using it
      try {
        // Try to access auth properties safely
        if (!auth || typeof auth !== 'object') {
          throw new Error('Auth object is not available');
        }
        
        // Check if onAuthStateChanged exists and is a function
        if (typeof (auth as any).onAuthStateChanged !== 'function') {
          throw new Error('onAuthStateChanged is not available');
        }
      } catch (authError) {
        console.warn('Firebase auth object is not properly initialized:', authError);
        if (mounted) {
          setLoading(false);
        }
        return () => {
          mounted = false;
        };
      }

      let unsubscribe: (() => void) | undefined;
      try {
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (!mounted) return;
          
          setUser(firebaseUser);
          if (firebaseUser && firebaseUser.email) {
            try {
              const data = await getUserByEmail(firebaseUser.email);
              if (mounted) {
                setUserData(data);
                if (!data) {
                  console.warn(`User document not found in Firestore for email: ${firebaseUser.email}`);
                }
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
              if (mounted) {
                setUserData(null);
              }
            }
          } else {
            if (mounted) {
              setUserData(null);
            }
          }
          if (mounted) {
            setLoading(false);
          }
        });

        return () => {
          mounted = false;
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
          }
        };
      } catch (authSetupError) {
        console.error('Error setting up auth state listener:', authSetupError);
        if (mounted) {
          setLoading(false);
        }
        return () => {
          mounted = false;
        };
      }
    } catch (error) {
      console.error('Error in AuthProvider useEffect:', error);
      if (mounted) {
        setLoading(false);
      }
      return () => {
        mounted = false;
      };
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Check if Firebase is properly configured before attempting login
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      
      if (!apiKey || !authDomain || !projectId) {
        const error: any = new Error('Firebase environment variables are not configured. Please set them in Netlify environment variables.');
        error.code = 'auth/configuration-error';
        throw error;
      }
      
      // Verify auth object is properly initialized
      // Since auth is a Proxy, we need to check it differently
      if (!auth || typeof auth !== 'object') {
        const error: any = new Error('Firebase authentication is not properly initialized.');
        error.code = 'auth/configuration-error';
        throw error;
      }
      
      // Try to access a property to verify the Proxy is working
      try {
        // Access a property to trigger the Proxy getter
        const testProp = (auth as any).app;
        if (!testProp) {
          // If env vars are available, auth should have an app property
          // If it doesn't, it means we're using the mock
          if (hasEnvVars()) {
            console.warn('[Auth] Env vars available but auth object seems to be mock');
          }
        }
      } catch (testError) {
        console.error('[Auth] Error accessing auth properties:', testError);
      }
      
      // Only call Firebase function if we have valid env vars
      await signInWithEmailAndPassword(auth, email, password);
      // User data will be set by onAuthStateChanged
      // Wait a bit for the user data to be fetched
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error: any) {
      // Re-throw to be handled by the component
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local state even if Firebase logout fails
      setUserData(null);
      setUser(null);
    }
  };

  // If there's a critical error, still render children but with limited functionality
  // This ensures the app doesn't completely break
  return (
    <AuthContext.Provider value={{ user, userData, loading, login, logout }}>
      {error ? (
        <>
          {children}
          {/* Silently handle error - don't break the UI */}
        </>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

