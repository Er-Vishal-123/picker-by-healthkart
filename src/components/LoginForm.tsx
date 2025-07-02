
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Warehouse, Users } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <Warehouse className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
            PickPal Warehouse
          </CardTitle>
          <p className="text-gray-600 mt-2">Sign in to start picking</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="text-sm font-medium text-gray-700">
                Employee ID
              </Label>
              <Input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter your ID"
                className="h-12 text-lg border-2 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="h-12 text-lg border-2 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Role</Label>
              <Select value={role} onValueChange={(value: 'picker' | 'supervisor') => setRole(value)}>
                <SelectTrigger className="h-12 text-lg border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="picker" className="text-lg py-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Picker
                    </div>
                  </SelectItem>
                  <SelectItem value="supervisor" className="text-lg py-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Supervisor
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              type="submit"
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white border-0 shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
