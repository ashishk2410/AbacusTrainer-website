import TeacherDashboard from '@/components/TeacherDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function TeacherDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <TeacherDashboard />
    </ProtectedRoute>
  );
}


