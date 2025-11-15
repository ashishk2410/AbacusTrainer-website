import StudentsList from '@/components/StudentsList';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function StudentsPage() {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <StudentsList />
    </ProtectedRoute>
  );
}


