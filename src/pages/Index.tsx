
import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import PickerDashboard from '@/components/PickerDashboard';
import SupervisorDashboard from '@/components/SupervisorDashboard';

const Index = () => {
  const [user, setUser] = useState<{ id: string; name: string; role: 'picker' | 'supervisor' } | null>(null);

  const handleLogin = (userData: { id: string; name: string; role: 'picker' | 'supervisor' }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {user.role === 'picker' ? (
        <PickerDashboard user={user} onLogout={handleLogout} />
      ) : (
        <SupervisorDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;
