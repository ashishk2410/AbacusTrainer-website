'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getUserByEmail,
  getSessionsByStudentEmail,
  getSessionById,
  getStudentPlan,
  createOrUpdateStudentPlan,
  updateTaskInPlan
} from '@/lib/firestore';
import { User, Session, StudentPlan, Task, TaskStatus, TaskPriority } from '@/lib/types';
import { getFriendlyErrorMessage } from '@/lib/errorMessages';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StudentDetailsProps {
  studentId: string;
}

export default function StudentDetails({ studentId }: StudentDetailsProps) {
  const { userData } = useAuth();
  const [student, setStudent] = useState<User | null>(null);
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [plan, setPlan] = useState<StudentPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [viewFormat, setViewFormat] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('monthly');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [loadingSessionDetails, setLoadingSessionDetails] = useState(false);
  const [sessionPage, setSessionPage] = useState(1);
  const [sessionSortOrder, setSessionSortOrder] = useState<'asc' | 'desc'>('desc');
  const [questionPage, setQuestionPage] = useState(1);
  const [questionSortOrder, setQuestionSortOrder] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 10;
  
  // Initialize default date range: year start to today
  const getDefaultDates = () => {
    const today = new Date();
    const yearStart = new Date(today.getFullYear(), 0, 1);
    return {
      start: yearStart.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    };
  };
  
  const defaultDates = getDefaultDates();
  const [startDate, setStartDate] = useState<string>(defaultDates.start);
  const [endDate, setEndDate] = useState<string>(defaultDates.end);
  const [taskForm, setTaskForm] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    targetDate: '',
    achievableDate: '',
    status: 'not_started',
    completionPercent: 0
  });

  useEffect(() => {
    loadData();
  }, [studentId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentData, sessionsData] = await Promise.all([
        getUserByEmail(studentId),
        getSessionsByStudentEmail(studentId)
      ]);
      
      setStudent(studentData);
      setAllSessions(sessionsData);

      if (userData?.email) {
        const studentPlan = await getStudentPlan(studentId, userData.email);
        setPlan(studentPlan);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      if (error.code === 'permission-denied') {
        alert('Permission denied. Please ensure Firestore security rules allow teachers to read student data. See FIRESTORE_SECURITY_RULES.md for required rules.');
      } else {
        alert(getFriendlyErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const getFilteredSessions = (): Session[] => {
    if (!startDate || !endDate) return [];
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the entire end date
    
    // Validate: max 1 year range
    const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
    if (end.getTime() - start.getTime() > oneYearInMs) {
      // Auto-adjust to 1 year from start date
      const adjustedEnd = new Date(start.getTime() + oneYearInMs);
      end.setTime(adjustedEnd.getTime());
      setEndDate(adjustedEnd.toISOString().split('T')[0]);
    }
    
    const filtered = allSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= start && sessionDate <= end;
    });
    
    // Sort by date
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sessionSortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  };

  // Paginate sessions
  const getPaginatedSessions = (): Session[] => {
    const filtered = getFilteredSessions();
    const startIndex = (sessionPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const filteredSessions = getFilteredSessions();
  const paginatedSessions = getPaginatedSessions();
  const sessionTotalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  
  const formatDateForXAxis = (date: Date, format: 'daily' | 'weekly' | 'monthly' | 'quarterly'): string => {
    switch (format) {
      case 'daily':
        // dd-mmm-yy
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const year = date.getFullYear().toString().slice(-2);
        return `${day}-${month}-${year}`;
      case 'weekly':
        // W1-25, W2-25 etc (week number-year)
        const weekNumber = getWeekNumber(date);
        const year2 = date.getFullYear().toString().slice(-2);
        return `W${weekNumber}-${year2}`;
      case 'monthly':
        // Jan-25, Feb-25 etc
        const month2 = date.toLocaleDateString('en-US', { month: 'short' });
        const year3 = date.getFullYear().toString().slice(-2);
        return `${month2}-${year3}`;
      case 'quarterly':
        // Q1, Q2, Q3, Q4
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        return `Q${quarter}`;
      default:
        return date.toLocaleDateString();
    }
  };
  
  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };
  
  const groupSessionsByViewFormat = (sessions: Session[]): Map<string, Session[]> => {
    const grouped = new Map<string, Session[]>();
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const key = formatDateForXAxis(sessionDate, viewFormat);
      
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(session);
    });
    
    return grouped;
  };

  const calculateAnalytics = () => {
    if (filteredSessions.length === 0) {
      return {
        avgAccuracy: 0,
        avgEfficiency: 0,
        totalSessions: 0,
        currentStreak: 0,
        avgScore: 0
      };
    }

    const avgAccuracy = filteredSessions.reduce((sum, s) => sum + s.accuracy, 0) / filteredSessions.length;
    const avgEfficiency = filteredSessions.reduce((sum, s) => sum + s.efficiency, 0) / filteredSessions.length;
    const avgScore = filteredSessions.reduce((sum, s) => sum + s.score, 0) / filteredSessions.length;
    const currentStreak = filteredSessions.length > 0 ? filteredSessions[0]?.streak || 0 : 0;

    return {
      avgAccuracy: Math.round(avgAccuracy), // Already 0 dp
      avgEfficiency: Math.round(avgEfficiency * 10) / 10,
      totalSessions: filteredSessions.length,
      currentStreak,
      avgScore: Math.round(avgScore)
    };
  };

  const getChartData = () => {
    const grouped = groupSessionsByViewFormat(filteredSessions);
    const chartData: Array<{ date: string; accuracy: number; efficiency: number; sortKey: number }> = [];
    
    // Create chart data with sort keys
    grouped.forEach((groupSessions, key) => {
      // Calculate average for the group
      const avgAccuracy = groupSessions.reduce((sum, s) => sum + s.accuracy, 0) / groupSessions.length;
      const avgEfficiency = groupSessions.reduce((sum, s) => sum + s.efficiency, 0) / groupSessions.length;
      
      // Use the earliest session date in the group as sort key
      const earliestDate = Math.min(...groupSessions.map(s => new Date(s.date).getTime()));
      
      chartData.push({
        date: key,
        accuracy: Math.round(avgAccuracy),
        efficiency: Math.round(avgEfficiency * 10) / 10,
        sortKey: earliestDate
      });
    });
    
    // Sort by date
    chartData.sort((a, b) => a.sortKey - b.sortKey);
    
    // Remove sortKey before returning
    return chartData.map(({ sortKey, ...rest }) => rest);
  };
  

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.email || !taskForm.title) return;

    try {
      const newTask: Task = {
        taskId: crypto.randomUUID(),
        title: taskForm.title!,
        description: taskForm.description || '',
        priority: taskForm.priority || 'MEDIUM',
        targetDate: taskForm.targetDate || new Date().toISOString(),
        achievableDate: taskForm.achievableDate || new Date().toISOString(),
        status: taskForm.status || 'not_started',
        completionPercent: taskForm.completionPercent || 0,
        remarks: taskForm.remarks,
        createdBy: userData.email,
        createdAt: { toMillis: () => Date.now() } as any,
        updatedAt: { toMillis: () => Date.now() } as any
      };

      await createOrUpdateStudentPlan(studentId, userData.email, newTask);
      await loadData();
      setShowTaskForm(false);
      setTaskForm({
        title: '',
        description: '',
        priority: 'MEDIUM',
        targetDate: '',
        achievableDate: '',
        status: 'not_started',
        completionPercent: 0
      });
    } catch (error: any) {
      console.error('Error adding task:', error);
      alert(getFriendlyErrorMessage(error));
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!plan || !userData?.email) return;

    try {
      await updateTaskInPlan(plan.planId, taskId, updates);
      await loadData();
    } catch (error: any) {
      console.error('Error updating task:', error);
      alert(getFriendlyErrorMessage(error));
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!student) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Student not found</div>;
  }

  const analytics = calculateAnalytics();
  const chartData = getChartData();

  return (
    <div style={{ minHeight: '100vh', padding: '180px 20px 40px', background: '#F9FAFB' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 800, 
          marginBottom: '0.5rem',
          marginTop: '0',
          color: '#1F2937',
          fontFamily: 'var(--font-secondary)'
        }}>
          {student.name}
        </h1>
        <p style={{ color: '#6B7280', marginBottom: '2rem' }}>{student.email || student.user_id}</p>

        {/* Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7C3AED' }}>
              {analytics.avgAccuracy}%
            </div>
            <div style={{ color: '#6B7280', marginTop: '0.5rem' }}>Average Accuracy</div>
          </div>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#EC4899' }}>
              {analytics.avgEfficiency}
            </div>
            <div style={{ color: '#6B7280', marginTop: '0.5rem' }}>Efficiency (prompts/min)</div>
          </div>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981' }}>
              {analytics.currentStreak}
            </div>
            <div style={{ color: '#6B7280', marginTop: '0.5rem' }}>Current Streak</div>
          </div>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#06B6D4' }}>
              {analytics.totalSessions}
            </div>
            <div style={{ color: '#6B7280', marginTop: '0.5rem' }}>Total Sessions</div>
          </div>
        </div>

        {/* Performance Chart */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              Performance Trends
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#6B7280', alignSelf: 'center', fontSize: '0.875rem', marginRight: '0.5rem' }}>View:</span>
                {(['daily', 'weekly', 'monthly', 'quarterly'] as const).map(period => (
                  <button
                    key={period}
                    onClick={() => setViewFormat(period)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: '2px solid',
                      borderColor: viewFormat === period ? '#7C3AED' : '#E5E7EB',
                      background: viewFormat === period ? '#7C3AED' : 'white',
                      color: viewFormat === period ? 'white' : '#374151',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textTransform: 'capitalize'
                    }}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>Date Range:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    setStartDate(newStart);
                    // Validate max 1 year range
                    if (endDate) {
                      const start = new Date(newStart);
                      const end = new Date(endDate);
                      const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
                      if (end.getTime() - start.getTime() > oneYearInMs) {
                        const adjustedEnd = new Date(start.getTime() + oneYearInMs);
                        setEndDate(adjustedEnd.toISOString().split('T')[0]);
                      }
                    }
                  }}
                  max={endDate || undefined}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #E5E7EB',
                    fontSize: '0.875rem'
                  }}
                />
                <span style={{ color: '#6B7280' }}>to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    const newEnd = e.target.value;
                    setEndDate(newEnd);
                    // Validate max 1 year range
                    if (startDate) {
                      const start = new Date(startDate);
                      const end = new Date(newEnd);
                      const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
                      if (end.getTime() - start.getTime() > oneYearInMs) {
                        const adjustedStart = new Date(end.getTime() - oneYearInMs);
                        setStartDate(adjustedStart.toISOString().split('T')[0]);
                      }
                    }
                  }}
                  min={startDate || undefined}
                  max={new Date().toISOString().split('T')[0]}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #E5E7EB',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="#7C3AED" strokeWidth={2} name="Accuracy %" />
                <Line type="monotone" dataKey="efficiency" stroke="#EC4899" strokeWidth={2} name="Efficiency" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
              No sessions found for the selected period.
            </div>
          )}
        </div>

        {/* Session List */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              Session History ({filteredSessions.length} sessions)
            </h2>
            <button
              onClick={() => {
                setSessionSortOrder(sessionSortOrder === 'asc' ? 'desc' : 'asc');
                setSessionPage(1); // Reset to first page when sorting changes
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
              <i className={`fas fa-sort-${sessionSortOrder === 'asc' ? 'numeric-down' : 'numeric-up'}`}></i>
              Sort by Date
            </button>
          </div>
          {filteredSessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
              No sessions found for the selected period.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5E7EB', background: '#F9FAFB' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Accuracy</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Efficiency (prompts/min)</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Score</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Questions</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSessions.map((session, index) => (
                    <tr
                      key={session.session_id || index}
                      onClick={async () => {
                        if (session.session_id) {
                          setLoadingSessionDetails(true);
                          try {
                            console.log('Fetching session details for:', session.session_id);
                            const fullSession = await getSessionById(session.session_id);
                            console.log('Fetched session:', fullSession);
                            console.log('Questions in fetched session:', fullSession?.questions);
                            console.log('Questions length:', fullSession?.questions?.length);
                            if (fullSession?.questions && fullSession.questions.length > 0) {
                              console.log('First question:', fullSession.questions[0]);
                            }
                            if (fullSession) {
                              setSelectedSession(fullSession);
                              setQuestionPage(1); // Reset question pagination when new session is selected
                            } else {
                              // Fallback to session from list if fetch fails
                              console.log('Using session from list as fallback');
                              setSelectedSession(session);
                            }
                          } catch (error) {
                            console.error('Error fetching session details:', error);
                            // Fallback to session from list
                            setSelectedSession(session);
                            setQuestionPage(1); // Reset question pagination when new session is selected
                          } finally {
                            setLoadingSessionDetails(false);
                          }
                        } else {
                          console.log('No session_id, using session from list');
                          setSelectedSession(session);
                          setQuestionPage(1); // Reset question pagination when new session is selected
                        }
                      }}
                      style={{
                        borderBottom: '1px solid #E5E7EB',
                        transition: 'background 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F9FAFB';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                      }}
                    >
                      <td style={{ padding: '1rem', fontWeight: 600, color: '#1F2937' }}>
                        {new Date(session.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td style={{ padding: '1rem', color: '#6B7280' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          background: session.accuracy >= 80 ? '#D1FAE5' : session.accuracy >= 60 ? '#FEF3C7' : '#FEE2E2',
                          color: session.accuracy >= 80 ? '#065F46' : session.accuracy >= 60 ? '#92400E' : '#991B1B',
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}>
                          {Math.round(session.accuracy)}%
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: '#6B7280' }}>
                        {session.efficiency.toFixed(1)}
                      </td>
                      <td style={{ padding: '1rem', color: '#6B7280', fontWeight: 600 }}>
                        {session.score || 0}
                      </td>
                      <td style={{ padding: '1rem', color: '#6B7280' }}>
                        {session.questions_attempted || 0}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          background: '#DBEAFE',
                          color: '#1E40AF',
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}>
                          {session.streak || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Session Pagination Controls */}
          {sessionTotalPages > 1 && (
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
                onClick={() => setSessionPage(prev => Math.max(1, prev - 1))}
                disabled={sessionPage === 1}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #E5E7EB',
                  background: sessionPage === 1 ? '#F3F4F6' : 'white',
                  color: sessionPage === 1 ? '#9CA3AF' : '#374151',
                  cursor: sessionPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 600
                }}
              >
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              <span style={{ padding: '0.5rem 1rem', color: '#6B7280', fontWeight: 600 }}>
                Page {sessionPage} of {sessionTotalPages}
              </span>
              <button
                onClick={() => setSessionPage(prev => Math.min(sessionTotalPages, prev + 1))}
                disabled={sessionPage === sessionTotalPages}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #E5E7EB',
                  background: sessionPage === sessionTotalPages ? '#F3F4F6' : 'white',
                  color: sessionPage === sessionTotalPages ? '#9CA3AF' : '#374151',
                  cursor: sessionPage === sessionTotalPages ? 'not-allowed' : 'pointer',
                  fontWeight: 600
                }}
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>

        {/* Session Details Full Screen */}
        {selectedSession && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: '#F9FAFB',
              zIndex: 1000,
              overflowY: 'auto',
              padding: '180px 20px 40px'
            }}
          >
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              {/* Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '2rem',
                background: 'white',
                padding: '1.5rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}>
                <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    Session Details
                  </h1>
                  <p style={{ color: '#6B7280' }}>
                    {new Date(selectedSession.date).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSession(null)}
                  style={{
                    background: '#EF4444',
                    border: 'none',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontWeight: 600
                  }}
                >
                  Close
                </button>
              </div>

              {/* Session Summary */}
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                marginBottom: '2rem'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Session Summary</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>Accuracy</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7C3AED' }}>
                      {Math.round(selectedSession.accuracy)}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>Efficiency (prompts/min)</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#EC4899' }}>
                      {selectedSession.efficiency.toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>Score</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981' }}>
                      {selectedSession.score || 0}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>Questions Attempted</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3B82F6' }}>
                      {selectedSession.questions_attempted || 0}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>Correct Answers</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669' }}>
                      {selectedSession.correctAnswers || 0}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>Streak</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7C3AED' }}>
                      {selectedSession.streak || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions List - Table View */}
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                    Questions ({selectedSession.questions?.length || 0})
                  </h2>
                  {selectedSession.questions && selectedSession.questions.length > 0 && (
                    <button
                      onClick={() => {
                        setQuestionSortOrder(questionSortOrder === 'asc' ? 'desc' : 'asc');
                        setQuestionPage(1); // Reset to first page when sorting changes
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
                      <i className={`fas fa-sort-${questionSortOrder === 'asc' ? 'numeric-down' : 'numeric-up'}`}></i>
                      Sort by Question #
                    </button>
                  )}
                </div>
                {loadingSessionDetails ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                    Loading session details...
                  </div>
                ) : selectedSession.questions && selectedSession.questions.length > 0 ? (
                  <>
                    {(() => {
                      // Sort and paginate questions
                      const sortedQuestions = [...selectedSession.questions].sort((a: any, b: any) => {
                        const numA = a.questionNumber || 0;
                        const numB = b.questionNumber || 0;
                        return questionSortOrder === 'asc' ? numA - numB : numB - numA;
                      });
                      const startIndex = (questionPage - 1) * itemsPerPage;
                      const endIndex = startIndex + itemsPerPage;
                      const paginatedQuestions = sortedQuestions.slice(startIndex, endIndex);
                      const questionTotalPages = Math.ceil(selectedSession.questions.length / itemsPerPage);
                      
                      return (
                        <>
                          <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ borderBottom: '2px solid #E5E7EB', background: '#F9FAFB' }}>
                                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>#</th>
                                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Status</th>
                                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Prompt/Question</th>
                                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Your Answer</th>
                                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Correct Answer</th>
                                </tr>
                              </thead>
                              <tbody>
                                {paginatedQuestions.map((question: any, idx: number) => {
                                  const index = startIndex + idx;
                          // Debug: Log question data
                          if (index === 0) {
                            console.log('Sample question data:', question);
                            console.log('Question keys:', Object.keys(question));
                          }
                          
                          // Determine question status based on actual data structure
                          // Handle both number and string values
                          const userAnswerRaw = question.userAnswer;
                          const correctSumRaw = question.correctSum;
                          const userAnswer = (userAnswerRaw !== undefined && userAnswerRaw !== null) ? Number(userAnswerRaw) : null;
                          const correctSum = (correctSumRaw !== undefined && correctSumRaw !== null) ? Number(correctSumRaw) : null;
                          
                          // Check if skipped - handle boolean, string, or undefined
                          const isSkipped = question.isSkipped === true || question.isSkipped === 'true' || question.isSkipped === 1;
                          const isAttempted = !isSkipped && (userAnswer !== null && userAnswer !== undefined && !isNaN(userAnswer));
                          const isCorrect = isAttempted && correctSum !== null && !isNaN(correctSum) && userAnswer === correctSum;
                          
                          // Debug first question
                          if (index === 0) {
                            console.log('Question processing:', {
                              userAnswerRaw,
                              userAnswer,
                              correctSumRaw,
                              correctSum,
                              isSkipped,
                              isAttempted,
                              isCorrect,
                              prompts: question.prompts
                            });
                          }
                          
                          // Build prompt from prompts array (e.g., [4, 5, -4, 7, -5] -> "4 + 5 - 4 + 7 - 5 = ?")
                          let prompt = 'Question';
                          if (question.prompts && Array.isArray(question.prompts) && question.prompts.length > 0) {
                            prompt = question.prompts.map((num: number, idx: number) => {
                              const numValue = Number(num);
                              if (idx === 0) {
                                return numValue.toString();
                              } else if (numValue >= 0) {
                                return ` + ${numValue}`;
                              } else {
                                return ` - ${Math.abs(numValue)}`;
                              }
                            }).join('') + ' = ?';
                          } else {
                            // Fallback to other possible field names
                            prompt = question.prompt || question.question || question.text || question.questionText || question.expression || `Question ${index + 1}`;
                          }
                          
                          const answer = userAnswer !== null && userAnswer !== undefined ? String(userAnswer) : '';
                          const correctAnswer = correctSum !== null && correctSum !== undefined ? String(correctSum) : '';

                          return (
                            <tr
                              key={index}
                              style={{
                                borderBottom: '1px solid #E5E7EB',
                                transition: 'background 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = isCorrect ? '#F0FDF4' : isSkipped ? '#FFFBEB' : '#FEF2F2';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                              }}
                            >
                              <td style={{ padding: '1rem', fontWeight: 600, color: '#1F2937' }}>
                                {index + 1}
                              </td>
                              <td style={{ padding: '1rem' }}>
                                <div style={{
                                  minWidth: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: isCorrect ? '#10B981' : isSkipped ? '#F59E0B' : '#EF4444',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 700,
                                  fontSize: '1rem'
                                }}>
                                  {isCorrect ? '✓' : isSkipped ? '?' : '✗'}
                                </div>
                              </td>
                              <td style={{ padding: '1rem', color: '#1F2937', fontWeight: 500 }}>
                                {prompt}
                              </td>
                              <td style={{ padding: '1rem' }}>
                                <div style={{ 
                                  fontSize: '0.875rem', 
                                  fontWeight: 600,
                                  color: isSkipped ? '#92400E' : isCorrect ? '#065F46' : '#991B1B',
                                  padding: '0.5rem 0.75rem',
                                  background: isSkipped ? '#FEF3C7' : isCorrect ? '#D1FAE5' : '#FEE2E2',
                                  borderRadius: '0.5rem',
                                  display: 'inline-block'
                                }}>
                                  {isSkipped ? 'Not Attempted' : answer || '—'}
                                </div>
                              </td>
                              <td style={{ padding: '1rem' }}>
                                {!isSkipped && (
                                  <div style={{ 
                                    fontSize: '0.875rem', 
                                    fontWeight: 600,
                                    color: '#059669',
                                    padding: '0.5rem 0.75rem',
                                    background: '#D1FAE5',
                                    borderRadius: '0.5rem',
                                    display: 'inline-block'
                                  }}>
                                    {correctAnswer || '—'}
                                  </div>
                                )}
                                {isSkipped && <span style={{ color: '#9CA3AF' }}>—</span>}
                              </td>
                            </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        
                        {/* Question Pagination Controls */}
                        {questionTotalPages > 1 && (
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
                              onClick={() => setQuestionPage(prev => Math.max(1, prev - 1))}
                              disabled={questionPage === 1}
                              style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                border: '2px solid #E5E7EB',
                                background: questionPage === 1 ? '#F3F4F6' : 'white',
                                color: questionPage === 1 ? '#9CA3AF' : '#374151',
                                cursor: questionPage === 1 ? 'not-allowed' : 'pointer',
                                fontWeight: 600
                              }}
                            >
                              <i className="fas fa-chevron-left"></i> Previous
                            </button>
                            <span style={{ padding: '0.5rem 1rem', color: '#6B7280', fontWeight: 600 }}>
                              Page {questionPage} of {questionTotalPages}
                            </span>
                            <button
                              onClick={() => setQuestionPage(prev => Math.min(questionTotalPages, prev + 1))}
                              disabled={questionPage === questionTotalPages}
                              style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                border: '2px solid #E5E7EB',
                                background: questionPage === questionTotalPages ? '#F3F4F6' : 'white',
                                color: questionPage === questionTotalPages ? '#9CA3AF' : '#374151',
                                cursor: questionPage === questionTotalPages ? 'not-allowed' : 'pointer',
                                fontWeight: 600
                              }}
                            >
                              Next <i className="fas fa-chevron-right"></i>
                            </button>
                          </div>
                        )}
                      </>
                    );
                    })()}
                  </>
                      ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                    {selectedSession.questions === undefined || selectedSession.questions === null 
                      ? 'Questions data not available. The session may not have question details stored.' 
                      : 'No questions available for this session.'}
                    <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
                      Session ID: {selectedSession.session_id}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Task Management */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Improvement Plan</h2>
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
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
              {showTaskForm ? 'Cancel' : '+ Add Task'}
            </button>
          </div>

          {showTaskForm && (
            <form onSubmit={handleAddTask} style={{
              padding: '1.5rem',
              background: '#F9FAFB',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Task Title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  required
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '2px solid #E5E7EB',
                    fontSize: '1rem'
                  }}
                />
                <textarea
                  placeholder="Description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  rows={3}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '2px solid #E5E7EB',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as TaskPriority })}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '2px solid #E5E7EB',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                  <input
                    type="date"
                    placeholder="Target Date"
                    value={taskForm.targetDate}
                    onChange={(e) => setTaskForm({ ...taskForm, targetDate: e.target.value })}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '2px solid #E5E7EB',
                      fontSize: '1rem'
                    }}
                  />
                  <input
                    type="date"
                    placeholder="Achievable Date"
                    value={taskForm.achievableDate}
                    onChange={(e) => setTaskForm({ ...taskForm, achievableDate: e.target.value })}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '2px solid #E5E7EB',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                    color: 'white',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Create Task
                </button>
              </div>
            </form>
          )}

          {/* Tasks List */}
          {plan && plan.tasks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {plan.tasks.map(task => (
                <div
                  key={task.taskId}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    border: '2px solid #E5E7EB',
                    background: '#F9FAFB'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{task.title}</h3>
                      <p style={{ color: '#6B7280', marginBottom: '0.75rem' }}>{task.description}</p>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          background: task.priority === 'HIGH' ? '#FEE2E2' : task.priority === 'MEDIUM' ? '#FEF3C7' : '#DBEAFE',
                          color: task.priority === 'HIGH' ? '#991B1B' : task.priority === 'MEDIUM' ? '#92400E' : '#1E40AF',
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}>
                          {task.priority}
                        </span>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          background: '#E5E7EB',
                          color: '#374151',
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}>
                          {task.status}
                        </span>
                      </div>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Progress</span>
                          <span style={{ fontSize: '0.875rem' }}>{task.completionPercent}%</span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '8px',
                          background: '#E5E7EB',
                          borderRadius: '9999px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${task.completionPercent}%`,
                            height: '100%',
                            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                            transition: 'width 0.3s'
                          }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={task.completionPercent}
                          onChange={(e) => handleUpdateTask(task.taskId, { completionPercent: parseInt(e.target.value) })}
                          style={{ flex: 1, minWidth: '200px' }}
                        />
                        <select
                          value={task.status}
                          onChange={(e) => handleUpdateTask(task.taskId, { status: e.target.value as TaskStatus })}
                          style={{
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            border: '2px solid #E5E7EB',
                            fontSize: '0.875rem'
                          }}
                        >
                          <option value="not_started">Not Started</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '2rem' }}>
              No tasks yet. Create one to get started!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

