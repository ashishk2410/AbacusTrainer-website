'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getFriendlyErrorMessage } from '@/lib/errorMessages';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, loginWithGoogle, userData, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && userData) {
      if (userData.role === 'centre') {
        router.push('/centre/dashboard');
      } else if (userData.role === 'teacher') {
        router.push('/teacher/dashboard');
      } else {
        setError('Your account does not have access to this portal. Only Centre and Teacher accounts can log in here.');
      }
    }
  }, [userData, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // The redirect will happen automatically via the useEffect above
      // when userData is updated by AuthContext
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
      // The redirect will happen automatically via the useEffect above
      // when userData is updated by AuthContext
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
      setGoogleLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 800, 
            color: '#1F2937',
            marginBottom: '0.5rem',
            fontFamily: 'var(--font-secondary)'
          }}>
            Login
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.85rem' }}>Access your Centre or Teacher dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 600,
              color: '#374151'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.6rem 0.7rem',
                borderRadius: '0.45rem',
                border: '2px solid #E5E7EB',
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 600,
              color: '#374151'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.6rem 0.7rem',
                borderRadius: '0.45rem',
                border: '2px solid #E5E7EB',
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '0.6rem 0.7rem',
              borderRadius: '0.5rem',
              background: '#FEE2E2',
              color: '#DC2626',
              marginBottom: '1.1rem',
              fontSize: '0.8rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            style={{
              width: '100%',
              padding: '0.7rem',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #6366f1, #f59e0b)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: 'none',
              cursor: loading || googleLoading ? 'not-allowed' : 'pointer',
              opacity: loading || googleLoading ? 0.7 : 1,
              transition: 'all 0.2s',
              marginBottom: '0.75rem'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          margin: '1.1rem 0',
          gap: '1rem'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
          <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          style={{
            width: '100%',
            padding: '0.7rem',
            borderRadius: '999px',
            background: 'white',
            color: '#374151',
            fontWeight: 600,
            fontSize: '0.95rem',
            border: '2px solid #E5E7EB',
            cursor: loading || googleLoading ? 'not-allowed' : 'pointer',
            opacity: loading || googleLoading ? 0.7 : 1,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}
        >
          {googleLoading ? (
            <>
              <span className="spinner" style={{
                width: '18px',
                height: '18px',
                border: '2px solid #E5E7EB',
                borderTopColor: '#6366f1',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite'
              }}></span>
              Signing in...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.348 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
}

