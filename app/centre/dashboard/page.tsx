import CentreDashboard from '@/components/CentreDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CentreDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['centre']}>
      <CentreDashboard />
    </ProtectedRoute>
  );
}


