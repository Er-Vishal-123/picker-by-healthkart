
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Warehouse, Users, Heart } from 'lucide-react';

interface LoginFormProps {
  onLogin: (userData: { id: string; name: string; role: 'picker' | 'supervisor' }) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'picker' | 'supervisor'>('picker');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId && name) {
      onLogin({ id: employeeId, name, role });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-16 h-16 bg-white/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/10 rounded-full animate-bounce"></div>
      <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-orange-400/30 rounded-full animate-ping"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Warehouse className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
            Picker by HealthKart
          </CardTitle>
          <div className="flex items-center justify-center gap-1 mt-2">
            <Heart className="h-4 w-4 text-emerald-500 fill-current" />
            <p className="text-gray-600">Streamline Your Warehouse</p>
            <Heart className="h-4 w-4 text-emerald-500 fill-current" />
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Package className="h-4 w-4 text-emerald-600" />
                Employee ID
              </Label>
              <Input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter your ID"
                className="h-12 text-lg border-2 focus:border-emerald-500 bg-gradient-to-r from-white to-emerald-50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Users className="h-4 w-4 text-teal-600" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="h-12 text-lg border-2 focus:border-teal-500 bg-gradient-to-r from-white to-teal-50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Warehouse className="h-4 w-4 text-cyan-600" />
                Role
              </Label>
              <Select value={role} onValueChange={(value: 'picker' | 'supervisor') => setRole(value)}>
                <SelectTrigger className="h-12 text-lg border-2 bg-gradient-to-r from-white to-cyan-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="picker" className="text-lg py-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-emerald-600" />
                      Picker
                    </div>
                  </SelectItem>
                  <SelectItem value="supervisor" className="text-lg py-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-teal-600" />
                      Supervisor
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              type="submit"
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white border-0 shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105"
            >
              Sign In to HealthKart Warehouse
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
