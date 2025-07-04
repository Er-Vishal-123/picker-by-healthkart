
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AuthForm from '@/components/AuthForm';
import PickerDashboard from '@/components/PickerDashboard';
import SupervisorDashboard from '@/components/SupervisorDashboard';
import AdminDashboard from '@/components/AdminDashboard';

const Index = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to landing page
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
    role: profile.role as 'picker' | 'supervisor' | 'admin'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {profile.role === 'picker' ? (
        <PickerDashboard user={userWithRole} onLogout={handleLogout} />
      ) : profile.role === 'admin' ? (
        <AdminDashboard user={userWithRole} onLogout={handleLogout} />
      ) : (
        <SupervisorDashboard user={userWithRole} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;
