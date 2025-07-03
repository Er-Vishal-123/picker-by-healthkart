
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';
import PickerDashboard from '@/components/PickerDashboard';
import SupervisorDashboard from '@/components/SupervisorDashboard';

const Index = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthForm />;
  }

  const userWithRole = {
    id: profile.id,
    name: profile.full_name,
    role: profile.role
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {profile.role === 'picker' ? (
        <PickerDashboard user={userWithRole} onLogout={() => {}} />
      ) : (
        <SupervisorDashboard user={userWithRole} onLogout={() => {}} />
      )}
    </div>
  );
};

export default Index;
