'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getStudentsByTeacherEmail,
  getPendingInvitesByTeacher,
  getAllInvitesByTeacher,
  updateInviteStatus
} from '@/lib/firestore';
import { User, TeacherInvite } from '@/lib/types';
import { getFriendlyErrorMessage } from '@/lib/errorMessages';
import Link from 'next/link';

export default function TeacherDashboard() {
  const { userData } = useAuth();
  const [students, setStudents] = useState<User[]>([]);
  const [pendingInvites, setPendingInvites] = useState<TeacherInvite[]>([]);
  const [allInvites, setAllInvites] = useState<TeacherInvite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use email or user_id (which is the email in Firestore)
    if (userData?.email || userData?.user_id) {
      loadData();
    }
  }, [userData]);

  const loadData = async () => {
    // Use email from userData or fallback to user_id (which is the email)
    const teacherEmail = userData?.email || userData?.user_id;
    
    if (!teacherEmail) {
      console.warn('Cannot load data: userData.email and userData.user_id are missing', userData);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Loading data for teacher:', teacherEmail, 'Full userData:', userData);
      const [studentsList, invites, allInvitesList] = await Promise.all([
        getStudentsByTeacherEmail(teacherEmail),
        getPendingInvitesByTeacher(teacherEmail),
        getAllInvitesByTeacher(teacherEmail)
      ]);
      console.log('Loaded students:', studentsList.length, studentsList);
      console.log('Loaded invites:', invites.length, invites);
      setStudents(studentsList);
      setPendingInvites(invites);
      setAllInvites(allInvitesList);
    } catch (error: any) {
      console.error('Error loading data:', error);
      alert(getFriendlyErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await updateInviteStatus(inviteId, 'accepted');
      await loadData();
    } catch (error: any) {
      console.error('Error accepting invite:', error);
      alert(getFriendlyErrorMessage(error));
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    try {
      await updateInviteStatus(inviteId, 'declined');
      await loadData();
    } catch (error: any) {
      console.error('Error declining invite:', error);
      alert(getFriendlyErrorMessage(error));
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        padding: '180px 20px 40px', 
        background: '#F9FAFB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1F2937' }}>
            Loading dashboard...
          </div>
          <div style={{ color: '#6B7280' }}>Please wait while we fetch your data.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '180px 20px 40px', background: '#F9FAFB' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 800, 
          marginBottom: '2rem',
          marginTop: '0',
          color: '#1F2937',
          fontFamily: 'var(--font-secondary)'
        }}>
          Teacher Dashboard
        </h1>

        {/* Pending Invites Notification */}
        {pendingInvites.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
            padding: '1.5rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            border: '2px solid #F59E0B'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              <i className="fas fa-bell" style={{ marginRight: '0.5rem' }}></i>
              Pending Invites ({pendingInvites.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingInvites.map(invite => (
                <div
                  key={invite.inviteId}
                  style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 600 }}>Invitation from {invite.centreEmail}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      Expires: {new Date(invite.expiresAt.toMillis()).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleAcceptInvite(invite.inviteId)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        background: '#10B981',
                        color: 'white',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDeclineInvite(invite.inviteId)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        background: '#EF4444',
                        color: 'white',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            color: 'white'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {students.length}
            </div>
            <div style={{ fontSize: '1.125rem', opacity: 0.9 }}>Total Students</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #10B981, #059669)',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            color: 'white'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {allInvites.length}
            </div>
            <div style={{ fontSize: '1.125rem', opacity: 0.9 }}>Codes Shared</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            color: 'white'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {allInvites.filter(inv => inv.status === 'accepted').length}
            </div>
            <div style={{ fontSize: '1.125rem', opacity: 0.9 }}>Codes Used</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/teacher/students"
              style={{
                padding: '1rem 2rem',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="fas fa-users"></i>
              View All Students ({students.length})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

