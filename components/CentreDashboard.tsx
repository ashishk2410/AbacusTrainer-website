'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getUsersByRole, 
  getStudentsByTeacherEmail,
  createTeacherInvite,
  updateStudentTeacher,
  getPendingInvitesByTeacher
} from '@/lib/firestore';
import { User, TeacherInvite } from '@/lib/types';
import { getFriendlyErrorMessage } from '@/lib/errorMessages';
import Link from 'next/link';

export default function CentreDashboard() {
  const { userData } = useAuth();
  const [teachers, setTeachers] = useState<User[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [pendingInvites, setPendingInvites] = useState<TeacherInvite[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // Default to list view
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!userData?.email) return;
    
    setLoading(true);
    try {
      const teachersList = await getUsersByRole('teacher');
      setTeachers(teachersList);
      
      // Load pending invites - use email or user_id as fallback
      const invites = await Promise.all(
        teachersList
          .filter(teacher => teacher.email || teacher.user_id) // Filter out teachers without email/user_id
          .map(teacher => getPendingInvitesByTeacher(teacher.email || teacher.user_id))
      );
      setPendingInvites(invites.flat());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.email || !userData?.firebaseUid) return;

    setInviteLoading(true);
    setInviteSuccess('');
    
    try {
      await createTeacherInvite(inviteEmail, userData.firebaseUid, userData.email);
      setInviteSuccess(`Invite sent to ${inviteEmail}`);
      setInviteEmail('');
      await loadData();
    } catch (error: any) {
      console.error('Error sending invite:', error);
      alert(getFriendlyErrorMessage(error));
    } finally {
      setInviteLoading(false);
    }
  };

  const handleTeacherClick = async (teacher: User) => {
    setSelectedTeacher(teacher);
    try {
      const teacherEmail = teacher.email || teacher.user_id;
      const teacherStudents = await getStudentsByTeacherEmail(teacherEmail);
      setStudents(teacherStudents);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  // Sort teachers by name
  const getSortedTeachers = (): User[] => {
    const sorted = [...teachers].sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      return sortOrder === 'asc' 
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
    return sorted;
  };

  // Paginate teachers
  const getPaginatedTeachers = (): User[] => {
    const sorted = getSortedTeachers();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sorted.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(teachers.length / itemsPerPage);
  const paginatedTeachers = getPaginatedTeachers();

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
          Centre Dashboard
        </h1>

        {/* Add Teacher Button */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => {
              setShowAddTeacher(!showAddTeacher);
              if (showAddTeacher) {
                setInviteEmail('');
                setInviteSuccess('');
              }
            }}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
              color: 'white',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <i className={`fas ${showAddTeacher ? 'fa-minus' : 'fa-plus'}`}></i>
            {showAddTeacher ? 'Cancel' : 'Add Teacher'}
          </button>
        </div>

        {/* Add Teacher Section - Hidden by default */}
        {showAddTeacher && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
              Add Teacher
            </h2>
            <form onSubmit={handleInviteTeacher}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Teacher email address"
                  required
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '2px solid #E5E7EB',
                    fontSize: '1rem'
                  }}
                />
                <button
                  type="submit"
                  disabled={inviteLoading}
                  style={{
                    padding: '0.75rem 2rem',
                    borderRadius: '0.5rem',
                    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                    color: 'white',
                    fontWeight: 700,
                    border: 'none',
                    cursor: inviteLoading ? 'not-allowed' : 'pointer',
                    opacity: inviteLoading ? 0.7 : 1
                  }}
                >
                  {inviteLoading ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
              {inviteSuccess && (
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  background: '#D1FAE5',
                  color: '#065F46'
                }}>
                  {inviteSuccess}
                </div>
              )}
            </form>
          </div>
        )}

        {/* Teachers List */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              Teachers ({teachers.length})
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
          {viewMode === 'list' ? (
            // List View
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5E7EB', background: '#F9FAFB' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Email</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Pending Invites</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, color: '#374151' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTeachers.map(teacher => {
                    const teacherEmail = teacher.email || teacher.user_id;
                    const teacherInvites = pendingInvites.filter(inv => inv.teacherEmail === teacherEmail);
                    const isSelected = (selectedTeacher?.email || selectedTeacher?.user_id) === teacherEmail;
                    return (
                      <tr
                        key={teacherEmail}
                        onClick={() => handleTeacherClick(teacher)}
                        style={{
                          borderBottom: '1px solid #E5E7EB',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          background: isSelected ? '#F3F4F6' : 'white'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = '#F9FAFB';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'white';
                          }
                        }}
                      >
                        <td style={{ padding: '1rem', fontWeight: 600, color: '#1F2937' }}>
                          {teacher.name || 'N/A'}
                        </td>
                        <td style={{ padding: '1rem', color: '#6B7280', fontSize: '0.875rem' }}>
                          {teacherEmail}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {teacherInvites.length > 0 ? (
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              background: '#FEF3C7',
                              color: '#92400E',
                              fontWeight: 600,
                              fontSize: '0.875rem'
                            }}>
                              {teacherInvites.length} pending
                            </span>
                          ) : (
                            <span style={{ color: '#9CA3AF' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTeacherClick(teacher);
                            }}
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '0.5rem',
                              background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.875rem',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            View Students
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            // Grid View
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {paginatedTeachers.map(teacher => {
                const teacherEmail = teacher.email || teacher.user_id;
                const teacherInvites = pendingInvites.filter(inv => inv.teacherEmail === teacherEmail);
                const isSelected = (selectedTeacher?.email || selectedTeacher?.user_id) === teacherEmail;
                return (
                  <div
                    key={teacherEmail}
                    onClick={() => handleTeacherClick(teacher)}
                    style={{
                      padding: '1.5rem',
                      borderRadius: '0.75rem',
                      border: isSelected ? '3px solid #7C3AED' : '2px solid #E5E7EB',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: isSelected ? '#F3F4F6' : 'white'
                    }}
                  >
                    <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{teacher.name || 'N/A'}</h3>
                    <p style={{ color: '#6B7280', marginBottom: '0.5rem' }}>{teacherEmail}</p>
                    {teacherInvites.length > 0 && (
                      <div style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        background: '#FEF3C7',
                        color: '#92400E',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        marginTop: '0.5rem'
                      }}>
                        {teacherInvites.length} pending invite(s)
                      </div>
                    )}
                  </div>
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

        {/* Students by Teacher */}
        {selectedTeacher && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                Students under {selectedTeacher.name || 'N/A'} ({students.length})
              </h2>
              <button
                onClick={() => setSelectedTeacher(null)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #E5E7EB',
                  background: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Close
              </button>
            </div>
            {students.length === 0 ? (
              <p style={{ color: '#6B7280', textAlign: 'center', padding: '2rem' }}>
                No students assigned to this teacher yet.
              </p>
            ) : viewMode === 'list' ? (
              // List View
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E5E7EB', background: '#F9FAFB' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Name</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Level</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, color: '#374151' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr
                        key={student.email || student.user_id}
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
                          {student.email || student.user_id}
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
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <Link
                            href={`/student/${encodeURIComponent(student.email || student.user_id)}`}
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
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // Grid View
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {students.map(student => (
                  <Link
                    key={student.email || student.user_id}
                    href={`/student/${encodeURIComponent(student.email || student.user_id)}`}
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
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{student.name || 'N/A'}</h3>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      {student.email || student.user_id}
                    </p>
                    {student.teacher_assigned_level && (
                      <p style={{ fontSize: '0.875rem' }}>
                        Level: {student.teacher_assigned_level}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

