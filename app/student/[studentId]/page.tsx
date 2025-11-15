import StudentDetails from '@/components/StudentDetails';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function StudentDetailsPage({ params }: { params: { studentId: string } }) {
  return (
    <ProtectedRoute allowedRoles={['teacher', 'centre']}>
      <StudentDetails studentId={decodeURIComponent(params.studentId)} />
    </ProtectedRoute>
  );
}


