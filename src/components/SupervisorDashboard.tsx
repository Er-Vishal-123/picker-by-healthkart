
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Clock,
  Package,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'picker' | 'supervisor';
}

interface PickerStatus {
  id: string;
  name: string;
  currentPicklist: string | null;
  totalAssigned: number;
  completed: number;
  inProgress: number;
  exceptions: number;
  efficiency: number;
  lastActivity: string;
  status: 'active' | 'idle' | 'offline';
}

interface SupervisorDashboardProps {
  user: User;
  onLogout: () => void;
}

const SupervisorDashboard = ({ user, onLogout }: SupervisorDashboardProps) => {
  const [pickers, setPickers] = useState<PickerStatus[]>([]);
  const [selectedPicker, setSelectedPicker] = useState<string | null>(null);

  useEffect(() => {
    // Mock picker data
    const mockPickers: PickerStatus[] = [
      {
        id: 'PKR001',
        name: 'John Smith',
        currentPicklist: 'ORD-2024-001',
        totalAssigned: 8,
        completed: 5,
        inProgress: 2,
        exceptions: 1,
        efficiency: 92,
        lastActivity: '2 min ago',
        status: 'active'
      },
      {
        id: 'PKR002',
        name: 'Sarah Johnson',
        currentPicklist: 'ORD-2024-003',
        totalAssigned: 6,
        completed: 4,
        inProgress: 1,
        exceptions: 1,
        efficiency: 88,
        lastActivity: '5 min ago',
        status: 'active'
      },
      {
        id: 'PKR003',
        name: 'Mike Chen',
        currentPicklist: null,
        totalAssigned: 10,
        completed: 8,
        inProgress: 0,
        exceptions: 2,
        efficiency: 95,
        lastActivity: '15 min ago',
        status: 'idle'
      },
      {
        id: 'PKR004',
        name: 'Lisa Brown',
        currentPicklist: 'ORD-2024-005',
        totalAssigned: 7,
        completed: 3,
        inProgress: 3,
        exceptions: 1,
        efficiency: 85,
        lastActivity: '1 min ago',
        status: 'active'
      }
    ];
    setPickers(mockPickers);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'idle': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'offline': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalCompleted = pickers.reduce((sum, picker) => sum + picker.completed, 0);
  const totalInProgress = pickers.reduce((sum, picker) => sum + picker.inProgress, 0);
  const totalExceptions = pickers.reduce((sum, picker) => sum + picker.exceptions, 0);
  const avgEfficiency = Math.round(pickers.reduce((sum, picker) => sum + picker.efficiency, 0) / pickers.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Supervisor Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {user.name}</p>
            </div>
          </div>
          
          <Button
            onClick={onLogout}
            variant="outline"
            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Completed Today</p>
                  <p className="text-3xl font-bold">{totalCompleted}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">In Progress</p>
                  <p className="text-3xl font-bold">{totalInProgress}</p>
                </div>
                <Package className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Exceptions</p>
                  <p className="text-3xl font-bold">{totalExceptions}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Avg Efficiency</p>
                  <p className="text-3xl font-bold">{avgEfficiency}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Picker Status Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Picker Status Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Picker</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Current Order</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Completed</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">In Progress</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Exceptions</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Efficiency</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {pickers.map((picker) => (
                    <tr 
                      key={picker.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedPicker(picker.id === selectedPicker ? null : picker.id)}
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-gray-900">{picker.name}</p>
                          <p className="text-sm text-gray-500">{picker.id}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(picker.status)}>
                          {picker.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {picker.currentPicklist ? (
                          <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {picker.currentPicklist}
                          </span>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="font-semibold text-green-600">{picker.completed}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="font-semibold text-blue-600">{picker.inProgress}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="font-semibold text-red-600">{picker.exceptions}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`font-bold text-lg ${getEfficiencyColor(picker.efficiency)}`}>
                          {picker.efficiency}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">{picker.lastActivity}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Picker View */}
        {selectedPicker && (
          <Card className="mt-6 shadow-lg border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <CardTitle>
                Detailed View: {pickers.find(p => p.id === selectedPicker)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Performance Today</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Orders Completed:</span>
                      <span className="font-semibold">{pickers.find(p => p.id === selectedPicker)?.completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Efficiency Rate:</span>
                      <span className="font-semibold">{pickers.find(p => p.id === selectedPicker)?.efficiency}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Exception Rate:</span>
                      <span className="font-semibold text-red-600">
                        {Math.round((pickers.find(p => p.id === selectedPicker)?.exceptions || 0) / 
                        (pickers.find(p => p.id === selectedPicker)?.totalAssigned || 1) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Current Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className={getStatusColor(pickers.find(p => p.id === selectedPicker)?.status || '')}>
                        {pickers.find(p => p.id === selectedPicker)?.status?.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Order:</span>
                      <span className="font-mono text-xs">
                        {pickers.find(p => p.id === selectedPicker)?.currentPicklist || 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Activity:</span>
                      <span>{pickers.find(p => p.id === selectedPicker)?.lastActivity}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full text-sm">
                      Send Message
                    </Button>
                    <Button variant="outline" className="w-full text-sm">
                      Reassign Orders
                    </Button>
                    <Button variant="outline" className="w-full text-sm text-red-600 hover:text-red-700">
                      View Exceptions
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SupervisorDashboard;
