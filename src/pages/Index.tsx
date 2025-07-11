
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Users, Shield } from 'lucide-react';
import PickerDashboard from '@/components/PickerDashboard';
import SupervisorDashboard from '@/components/SupervisorDashboard';
import AdminDashboard from '@/components/AdminDashboard';

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<'picker' | 'supervisor' | 'admin' | null>(null);
  const [userName, setUserName] = useState('Demo User');

  const handleRoleSelect = (role: 'picker' | 'supervisor' | 'admin') => {
    setSelectedRole(role);
  };

  const handleLogout = () => {
    setSelectedRole(null);
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
              <Package className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Picker by HealthKart
            </CardTitle>
            <p className="text-gray-600">Select your role to continue</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button
                onClick={() => handleRoleSelect('picker')}
                className="w-full h-16 text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Package className="h-6 w-6 mr-3" />
                Picker Dashboard
              </Button>
              <Button
                onClick={() => handleRoleSelect('supervisor')}
                className="w-full h-16 text-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <Users className="h-6 w-6 mr-3" />
                Supervisor Dashboard
              </Button>
              <Button
                onClick={() => handleRoleSelect('admin')}
                className="w-full h-16 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Shield className="h-6 w-6 mr-3" />
                Admin Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = {
    id: 'demo-user',
    name: userName,
    role: selectedRole
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {selectedRole === 'picker' && (
        <PickerDashboard user={user as any} onLogout={handleLogout} />
      )}
      {selectedRole === 'supervisor' && (
        <SupervisorDashboard user={user as any} onLogout={handleLogout} />
      )}
      {selectedRole === 'admin' && (
        <AdminDashboard user={user as any} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;
