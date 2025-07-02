
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  MessageSquare,
  Map,
  LogOut,
  Settings as SettingsIcon
} from 'lucide-react';
import PerformanceDashboard from './supervisor/PerformanceDashboard';
import PredictiveAlerts from './supervisor/PredictiveAlerts';
import InventoryHeatmap from './supervisor/InventoryHeatmap';
import DynamicAssignment from './supervisor/DynamicAssignment';
import ChatSystem from './supervisor/ChatSystem';
import NotificationCenter from './supervisor/NotificationCenter';
import Settings from './Settings';

interface SupervisorDashboardProps {
  user: { id: string; name: string; role: 'picker' | 'supervisor' };
  onLogout: () => void;
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

const SupervisorDashboard = ({ user, onLogout }: SupervisorDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pickers, setPickers] = useState<PickerStatus[]>([
    {
      id: '1',
      name: 'Mike Chen',
      currentPicklist: 'PL-2024-001',
      totalAssigned: 45,
      completed: 40,
      inProgress: 5,
      exceptions: 1,
      efficiency: 92,
      lastActivity: '5 minutes ago',
      status: 'active',
      pickAccuracy: 99.5,
      timePerItem: 35,
      ordersPerHour: 10,
    },
    {
      id: '2',
      name: 'Lisa Brown',
      currentPicklist: 'PL-2024-002',
      totalAssigned: 38,
      completed: 30,
      inProgress: 8,
      exceptions: 2,
      efficiency: 79,
      lastActivity: '2 minutes ago',
      status: 'active',
      pickAccuracy: 98.2,
      timePerItem: 42,
      ordersPerHour: 8,
    },
    {
      id: '3',
      name: 'David Lee',
      currentPicklist: null,
      totalAssigned: 0,
      completed: 0,
      inProgress: 0,
      exceptions: 0,
      efficiency: 0,
      lastActivity: '10 minutes ago',
      status: 'idle',
      pickAccuracy: 0,
      timePerItem: 0,
      ordersPerHour: 0,
    },
    {
      id: '4',
      name: 'Emily White',
      currentPicklist: null,
      totalAssigned: 0,
      completed: 0,
      inProgress: 0,
      exceptions: 0,
      efficiency: 0,
      lastActivity: 'Offline',
      status: 'offline',
      pickAccuracy: 0,
      timePerItem: 0,
      ordersPerHour: 0,
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Picker by HealthKart</h1>
              <p className="text-blue-100">Supervisor Dashboard - Welcome {user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white hover:bg-opacity-20"
              onClick={() => setActiveTab('settings')}
            >
              <SettingsIcon className="h-5 w-5 mr-2" />
              Settings
            </Button>
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white shadow-lg rounded-xl p-2">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <AlertTriangle className="h-4 w-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Map className="h-4 w-4" />
              Heatmap
            </TabsTrigger>
            <TabsTrigger value="assignment" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              Assignment
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <SettingsIcon className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Warehouse Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add warehouse overview content here */}
                <p>Key metrics and insights about the warehouse operations.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceDashboard pickers={pickers} />
          </TabsContent>

          <TabsContent value="alerts">
            <PredictiveAlerts pickers={pickers} />
          </TabsContent>

          <TabsContent value="heatmap">
            <InventoryHeatmap />
          </TabsContent>

          <TabsContent value="assignment">
            <DynamicAssignment pickers={pickers} setPickers={setPickers} />
          </TabsContent>

          <TabsContent value="chat">
            <ChatSystem pickers={pickers} />
          </TabsContent>

          <TabsContent value="settings">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
