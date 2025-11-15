import ProfilePage from '@/components/ProfilePage';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Profile() {
  return (
    <ProtectedRoute allowedRoles={['teacher', 'centre']}>
      <ProfilePage />
    </ProtectedRoute>
  );
}


