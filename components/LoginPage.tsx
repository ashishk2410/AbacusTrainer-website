'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getFriendlyErrorMessage } from '@/lib/errorMessages';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'centre' | 'teacher'>('teacher');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, userData, loading: authLoading } = useAuth();
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

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FF6B6B 0%, #FECA57 50%, #48DBFB 100%)',
      padding: '180px 20px 40px'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        maxWidth: '450px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/images/logo.svg" alt="Abacus Trainer" style={{ height: '60px', marginBottom: '1rem' }} />
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 800, 
            color: '#1F2937',
            marginBottom: '0.5rem',
            fontFamily: 'var(--font-secondary)'
          }}>
            Login
          </h1>
          <p style={{ color: '#6B7280' }}>Access your Centre or Teacher dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 600,
              color: '#374151'
            }}>
              Login As
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setRole('centre')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: `2px solid ${role === 'centre' ? '#7C3AED' : '#E5E7EB'}`,
                  background: role === 'centre' ? '#7C3AED' : 'white',
                  color: role === 'centre' ? 'white' : '#374151',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Centre
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: `2px solid ${role === 'teacher' ? '#7C3AED' : '#E5E7EB'}`,
                  background: role === 'teacher' ? '#7C3AED' : 'white',
                  color: role === 'teacher' ? 'white' : '#374151',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Teacher
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
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
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '2px solid #E5E7EB',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
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
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '2px solid #E5E7EB',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '0.75rem',
              borderRadius: '0.5rem',
              background: '#FEE2E2',
              color: '#DC2626',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

