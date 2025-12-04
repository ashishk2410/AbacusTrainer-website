'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getStudentsByTeacherEmail,
  getSessionsByStudentEmail
} from '@/lib/firestore';
import { User, Session } from '@/lib/types';
import { getFriendlyErrorMessage } from '@/lib/errorMessages';
import Link from 'next/link';

export default function StudentsList() {
  const { userData } = useAuth();
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [studentLastActive, setStudentLastActive] = useState<Record<string, Date | null>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 10;

  useEffect(() => {
    if (userData?.email || userData?.user_id) {
      loadData();
    }
  }, [userData]);

  const loadData = async () => {
    const teacherEmail = userData?.email || userData?.user_id;
    if (!teacherEmail) return;

    setLoading(true);
    try {
      const studentsList = await getStudentsByTeacherEmail(teacherEmail);
      setStudents(studentsList);

      // Load last active date for each student
      const lastActiveMap: Record<string, Date | null> = {};
      await Promise.all(
        studentsList.map(async (student) => {
          const studentEmail = student.email || student.user_id;
          try {
            const sessions = await getSessionsByStudentEmail(studentEmail);
            if (sessions.length > 0) {
              lastActiveMap[studentEmail] = new Date(sessions[0].date);
            } else {
              lastActiveMap[studentEmail] = null;
            }
          } catch (error) {
            lastActiveMap[studentEmail] = null;
          }
        })
      );
      setStudentLastActive(lastActiveMap);
    } catch (error: any) {
      console.error('Error loading data:', error);
      alert(getFriendlyErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateFromTimestamp = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toMillis) {
      return new Date(timestamp.toMillis()).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
    return 'N/A';
  };

  // Sort students by name
  const getSortedStudents = (): User[] => {
    const sorted = [...students].sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      return sortOrder === 'asc' 
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
    return sorted;
  };

  // Paginate students
  const getPaginatedStudents = (): User[] => {
    const sorted = getSortedStudents();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sorted.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(students.length / itemsPerPage);
  const paginatedStudents = getPaginatedStudents();

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        padding: '180px 0 40px', 
        background: '#F9FAFB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1F2937' }}>
            Loading students...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '180px 10% 40px', background: '#F9FAFB' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 800, 
          marginBottom: '2rem',
          marginTop: '0',
          color: '#1F2937',
          fontFamily: 'var(--font-secondary)'
        }}>
          My Students ({students.length})
        </h1>

        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              Students List
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  setCurrentPage(1); // Reset to first page when sorting changes
                }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #E5E7EB',
                  background: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className={`fas fa-sort-${sortOrder === 'asc' ? 'alpha-down' : 'alpha-up'}`}></i>
                Sort by Name
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '2px solid',
                  borderColor: viewMode === 'list' ? '#7C3AED' : '#E5E7EB',
                  background: viewMode === 'list' ? '#7C3AED' : 'white',
                  color: viewMode === 'list' ? 'white' : '#374151',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                <i className="fas fa-list" style={{ marginRight: '0.5rem' }}></i>
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '2px solid',
                  borderColor: viewMode === 'grid' ? '#7C3AED' : '#E5E7EB',
                  background: viewMode === 'grid' ? '#7C3AED' : 'white',
                  color: viewMode === 'grid' ? 'white' : '#374151',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                <i className="fas fa-th" style={{ marginRight: '0.5rem' }}></i>
                Grid
              </button>
            </div>
          </div>

          {students.length === 0 ? (
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '2rem' }}>
              No students assigned yet.
            </p>
          ) : viewMode === 'list' ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5E7EB', background: '#F9FAFB' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Email</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Joining Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Last Active</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Level</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, color: '#374151' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student) => {
                    const studentEmail = student.email || student.user_id;
                    const lastActive = studentLastActive[studentEmail];
                    return (
                      <tr
                        key={studentEmail}
                        style={{
                          borderBottom: '1px solid #E5E7EB',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#F9FAFB';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'white';
                        }}
                      >
                        <td style={{ padding: '1rem', fontWeight: 600, color: '#1F2937' }}>
                          {student.name || 'N/A'}
                        </td>
                        <td style={{ padding: '1rem', color: '#6B7280', fontSize: '0.875rem' }}>
                          {studentEmail}
                        </td>
                        <td style={{ padding: '1rem', color: '#6B7280', fontSize: '0.875rem' }}>
                          {formatDateFromTimestamp(student.createdAt)}
                        </td>
                        <td style={{ padding: '1rem', color: '#6B7280', fontSize: '0.875rem' }}>
                          {formatDate(lastActive)}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {student.teacher_assigned_level ? (
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              background: '#DBEAFE',
                              color: '#1E40AF',
                              fontWeight: 600,
                              fontSize: '0.875rem'
                            }}>
                              {student.teacher_assigned_level}
                            </span>
                          ) : (
                            <span style={{ color: '#9CA3AF' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {student.student_status ? (
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              background: student.student_status === 'active' ? '#D1FAE5' : '#FEE2E2',
                              color: student.student_status === 'active' ? '#065F46' : '#991B1B',
                              fontWeight: 600,
                              fontSize: '0.875rem'
                            }}>
                              {student.student_status}
                            </span>
                          ) : (
                            <span style={{ color: '#9CA3AF' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <Link
                            href={`/student/${encodeURIComponent(studentEmail)}`}
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '0.5rem',
                              background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                              color: 'white',
                              textDecoration: 'none',
                              fontWeight: 600,
                              fontSize: '0.875rem',
                              display: 'inline-block'
                            }}
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {paginatedStudents.map(student => {
                const studentEmail = student.email || student.user_id;
                const lastActive = studentLastActive[studentEmail];
                return (
                  <Link
                    key={studentEmail}
                    href={`/student/${encodeURIComponent(studentEmail)}`}
                    style={{
                      display: 'block',
                      padding: '1.5rem',
                      borderRadius: '0.75rem',
                      border: '2px solid #E5E7EB',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#7C3AED';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.125rem' }}>
                      {student.name || 'N/A'}
                    </h3>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                      {studentEmail}
                    </p>
                    <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                      <div>Joined: {formatDateFromTimestamp(student.createdAt)}</div>
                      <div>Last Active: {formatDate(lastActive)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', marginTop: '0.75rem' }}>
                      {student.teacher_assigned_level && (
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          background: '#DBEAFE',
                          color: '#1E40AF',
                          fontWeight: 600
                        }}>
                          Level: {student.teacher_assigned_level}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #E5E7EB'
            }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #E5E7EB',
                  background: currentPage === 1 ? '#F3F4F6' : 'white',
                  color: currentPage === 1 ? '#9CA3AF' : '#374151',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 600
                }}
              >
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              <span style={{ padding: '0.5rem 1rem', color: '#6B7280', fontWeight: 600 }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #E5E7EB',
                  background: currentPage === totalPages ? '#F3F4F6' : 'white',
                  color: currentPage === totalPages ? '#9CA3AF' : '#374151',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: 600
                }}
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


