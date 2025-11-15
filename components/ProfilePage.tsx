'use client'

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { userData, user } = useAuth();
  const router = useRouter();

  if (!userData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '180px 20px 40px', background: '#F9FAFB' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 800, 
          marginBottom: '2rem',
          marginTop: '0',
          color: '#1F2937',
          fontFamily: 'var(--font-secondary)'
        }}>
          My Profile
        </h1>

        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '2px solid #E5E7EB' }}>
              <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 700
                }}>
                  {userData.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', color: '#1F2937' }}>
                  {userData.name || 'N/A'}
                </h2>
                <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                  {userData.email || userData.user_id}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280', marginBottom: '0.5rem' }}>
                  Role
                </label>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  background: '#F3F4F6',
                  color: '#1F2937',
                  fontWeight: 600,
                  textTransform: 'capitalize'
                }}>
                  {userData.role || 'N/A'}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280', marginBottom: '0.5rem' }}>
                  Plan
                </label>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  background: '#F3F4F6',
                  color: '#1F2937',
                  fontWeight: 600,
                  textTransform: 'capitalize'
                }}>
                  {userData.plan_name || 'N/A'}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280', marginBottom: '0.5rem' }}>
                  Plan Status
                </label>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  background: userData.plan_status === 'active' ? '#D1FAE5' : '#FEE2E2',
                  color: userData.plan_status === 'active' ? '#065F46' : '#991B1B',
                  fontWeight: 600,
                  textTransform: 'capitalize'
                }}>
                  {userData.plan_status || 'N/A'}
                </div>
              </div>

              {userData.subscription_expiry && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280', marginBottom: '0.5rem' }}>
                    Subscription Expiry
                  </label>
                  <div style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    background: '#F3F4F6',
                    color: '#1F2937'
                  }}>
                    {new Date(userData.subscription_expiry).toLocaleDateString()}
                  </div>
                </div>
              )}

              {user && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280', marginBottom: '0.5rem' }}>
                    Account Created
                  </label>
                  <div style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    background: '#F3F4F6',
                    color: '#1F2937'
                  }}>
                    {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            onClick={() => router.back()}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: '2px solid #E5E7EB',
              background: 'white',
              color: '#374151',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Back
          </button>
          <button
            onClick={() => router.push(userData.role === 'centre' ? '/centre/dashboard' : '/teacher/dashboard')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
              color: 'white',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

