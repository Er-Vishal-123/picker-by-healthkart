
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
  XCircle,
  MessageCircle,
  Bell,
  BarChart3,
  MapPin,
  RefreshCw,
  Send,
  Zap,
  Activity,
  Target,
  Timer,
  Database
} from 'lucide-react';
import PerformanceDashboard from './supervisor/PerformanceDashboard';
import InventoryHeatmap from './supervisor/InventoryHeatmap';
import PredictiveAlerts from './supervisor/PredictiveAlerts';
import DynamicAssignment from './supervisor/DynamicAssignment';
import ChatSystem from './supervisor/ChatSystem';
import NotificationCenter from './supervisor/NotificationCenter';

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
  pickAccuracy: number;
  timePerItem: number;
  ordersPerHour: number;
}

interface SupervisorDashboardProps {
  user: User;
  onLogout: () => void;
}

const SupervisorDashboard = ({ user, onLogout }: SupervisorDashboardProps) => {
  const [pickers, setPickers] = useState<PickerStatus[]>([]);
  const [selectedPicker, setSelectedPicker] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'heatmap' | 'alerts' | 'assignment' | 'chat' | 'notifications'>('overview');

  useEffect(() => {
    // Enhanced mock picker data with performance metrics
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
        status: 'active',
        pickAccuracy: 98.5,
        timePerItem: 45,
        ordersPerHour: 12
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
        status: 'active',
        pickAccuracy: 96.2,
        timePerItem: 52,
        ordersPerHour: 10
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
        status: 'idle',
        pickAccuracy: 99.1,
        timePerItem: 38,
        ordersPerHour: 15
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
        status: 'active',
        pickAccuracy: 94.8,
        timePerItem: 58,
        ordersPerHour: 9
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
  const avgPickAccuracy = Math.round(pickers.reduce((sum, picker) => sum + picker.pickAccuracy, 0) / pickers.length * 10) / 10;
  const avgTimePerItem = Math.round(pickers.reduce((sum, picker) => sum + picker.timePerItem, 0) / pickers.length);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'performance':
        return <PerformanceDashboard pickers={pickers} />;
      case 'heatmap':
        return <InventoryHeatmap />;
      case 'alerts':
        return <PredictiveAlerts pickers={pickers} />;
      case 'assignment':
        return <DynamicAssignment pickers={pickers} setPickers={setPickers} />;
      case 'chat':
        return <ChatSystem pickers={pickers} />;
      case 'notifications':
        return <NotificationCenter pickers={pickers} />;
      default:
        return renderOverviewTab();
    }
  };

  const renderOverviewTab = () => (
    <>
      {/* Enhanced Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Completed Today</p>
                <p className="text-3xl font-bold">{totalCompleted}</p>
                <p className="text-xs text-green-200 mt-1">↑ 12% from yesterday</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">In Progress</p>
                <p className="text-3xl font-bold">{totalInProgress}</p>
                <p className="text-xs text-blue-200 mt-1">Real-time tracking</p>
              </div>
              <Package className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Exceptions</p>
                <p className="text-3xl font-bold">{totalExceptions}</p>
                <p className="text-xs text-orange-200 mt-1">Need attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Avg Efficiency</p>
                <p className="text-3xl font-bold">{avgEfficiency}%</p>
                <p className="text-xs text-purple-200 mt-1">Team performance</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-lg border-2 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pick Accuracy</p>
                <p className="text-2xl font-bold text-emerald-600">{avgPickAccuracy}%</p>
              </div>
              <Target className="h-6 w-6 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-2 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Time/Item</p>
                <p className="text-2xl font-bold text-blue-600">{avgTimePerItem}s</p>
              </div>
              <Timer className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-2 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Pickers</p>
                <p className="text-2xl font-bold text-purple-600">{pickers.filter(p => p.status === 'active').length}</p>
              </div>
              <Activity className="h-6 w-6 text-purple-600" />
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
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Performance</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Accuracy</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Time/Item</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {pickers.map((picker) => (
                  <tr 
                    key={picker.id} 
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-cyan-50 cursor-pointer transition-all duration-200"
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
                      <span className={`font-bold text-lg ${getEfficiencyColor(picker.efficiency)}`}>
                        {picker.efficiency}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-semibold text-emerald-600">{picker.pickAccuracy}%</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-semibold text-blue-600">{picker.timePerItem}s</span>
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
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Supervisor Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {user.name} - HealthKart Warehouse</p>
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

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'performance', label: 'Performance', icon: TrendingUp },
              { id: 'heatmap', label: 'Inventory Map', icon: MapPin },
              { id: 'alerts', label: 'Smart Alerts', icon: AlertTriangle },
              { id: 'assignment', label: 'Assignment', icon: RefreshCw },
              { id: 'chat', label: 'Team Chat', icon: MessageCircle },
              { id: 'notifications', label: 'Notifications', icon: Bell }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SupervisorDashboard;
