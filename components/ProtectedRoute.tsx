'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setRedirecting(true);
        router.push('/login');
        return;
      }
      
      if (user && !userData) {
        // User is authenticated but userData is still loading
        // Wait a bit more for userData to load
        return;
      }
      
      if (userData && !allowedRoles.includes(userData.role)) {
        setRedirecting(true);
        router.push('/login');
        return;
      }
    }
  }, [user, userData, loading, allowedRoles, router]);

  // Show loading while auth state is being determined
  if (loading || redirecting) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FECA57 50%, #48DBFB 100%)',
        padding: '180px 20px 40px'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>Loading...</div>
        </div>
      </div>
    );
  }

  // If user is authenticated but userData is still null, show loading
  // This can happen if the user document doesn't exist in Firestore
  if (user && !userData) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F9FAFB',
        padding: '180px 20px 40px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#1F2937' }}>
            Account Not Found
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
            Your account information could not be found. Please contact support.
          </p>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
              color: 'white',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // If no user, show loading (redirect will happen)
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FECA57 50%, #48DBFB 100%)',
        padding: '180px 20px 40px'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>Redirecting...</div>
        </div>
      </div>
    );
  }

  // Check role access
  if (userData && !allowedRoles.includes(userData.role)) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F9FAFB',
        padding: '180px 20px 40px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#1F2937' }}>
            Access Denied
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
            Your account does not have permission to access this page.
          </p>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
              color: 'white',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
}

