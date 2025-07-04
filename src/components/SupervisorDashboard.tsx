
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
  Settings as SettingsIcon,
  UserPlus,
  Activity,
  PieChart
} from 'lucide-react';
import PerformanceDashboard from './supervisor/PerformanceDashboard';
import PredictiveAlerts from './supervisor/PredictiveAlerts';
import InventoryHeatmap from './supervisor/InventoryHeatmap';
import DynamicAssignment from './supervisor/DynamicAssignment';
import ChatSystem from './supervisor/ChatSystem';
import NotificationCenter from './supervisor/NotificationCenter';
import Settings from './Settings';
import TaskAssignmentModal from './supervisor/TaskAssignmentModal';
import CategoryDistribution from './supervisor/CategoryDistribution';
import { useRealTimePickers } from '@/hooks/useRealTimePickers';
import { useTaskAssignments } from '@/hooks/useTaskAssignments';
import { useCategoryPerformance } from '@/hooks/useCategoryPerformance';

interface SupervisorDashboardProps {
  user: { id: string; name: string; role: 'picker' | 'supervisor' };
  onLogout: () => void;
}

const SupervisorDashboard = ({ user, onLogout }: SupervisorDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  const { pickers, isLoading: pickersLoading } = useRealTimePickers();
  const { taskAssignments, createTaskAssignment, isCreating } = useTaskAssignments();
  const { categoryPerformance } = useCategoryPerformance();

  const activePickers = pickers.filter(p => p.status === 'active').length;
  const idlePickers = pickers.filter(p => p.status === 'idle').length;
  const offlinePickers = pickers.filter(p => p.status === 'offline').length;
  const overloadedPickers = pickers.filter(p => p.inProgress > 2).length;

  const totalTasks = taskAssignments.length;
  const pendingTasks = taskAssignments.filter(t => t.status === 'assigned').length;
  const completedTasks = taskAssignments.filter(t => t.status === 'completed').length;

  const handleTaskAssignment = (task: any) => {
    createTaskAssignment(task);
  };

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
              onClick={() => setIsTaskModalOpen(true)}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Assign Task
            </Button>
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
          <TabsList className="grid w-full grid-cols-8 bg-white shadow-lg rounded-xl p-2">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="category" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <PieChart className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <AlertTriangle className="h-4 w-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="assignment" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              Assignment
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Map className="h-4 w-4" />
              Heatmap
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
            <div className="space-y-6">
              {/* Real-time Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Active Pickers</p>
                        <p className="text-3xl font-bold">{activePickers}</p>
                        <p className="text-blue-200 text-xs">Real-time</p>
                      </div>
                      <Activity className="h-8 w-8 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Idle Pickers</p>
                        <p className="text-3xl font-bold">{idlePickers}</p>
                        <p className="text-green-200 text-xs">Available</p>
                      </div>
                      <Clock className="h-8 w-8 text-green-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Total Tasks</p>
                        <p className="text-3xl font-bold">{totalTasks}</p>
                        <p className="text-purple-200 text-xs">{pendingTasks} pending</p>
                      </div>
                      <Package className="h-8 w-8 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">Overloaded</p>
                        <p className="text-3xl font-bold">{overloadedPickers}</p>
                        <p className="text-orange-200 text-xs">Need attention</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-orange-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Real-time Picker Status */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Real-time Picker Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pickersLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pickers.map((picker) => (
                        <div key={picker.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${
                              picker.status === 'active' ? 'bg-green-500' :
                              picker.status === 'idle' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{picker.name}</h4>
                              <p className="text-sm text-gray-600">
                                {picker.currentPicklist ? `Working on ${picker.currentPicklist}` : 'No active tasks'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="text-sm text-gray-600">In Progress</p>
                              <p className="font-semibold">{picker.inProgress}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Completed</p>
                              <p className="font-semibold">{picker.completed}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Efficiency</p>
                              <p className="font-semibold">{picker.efficiency}%</p>
                            </div>
                            <Badge className={
                              picker.status === 'active' ? 'bg-green-100 text-green-800' :
                              picker.status === 'idle' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {picker.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceDashboard pickers={pickers} />
          </TabsContent>

          <TabsContent value="category">
            <CategoryDistribution />
          </TabsContent>

          <TabsContent value="alerts">
            <PredictiveAlerts pickers={pickers} />
          </TabsContent>

          <TabsContent value="heatmap">
            <InventoryHeatmap />
          </TabsContent>

          <TabsContent value="assignment">
            <DynamicAssignment pickers={pickers} setPickers={() => {}} />
          </TabsContent>

          <TabsContent value="chat">
            <ChatSystem pickers={pickers} />
          </TabsContent>

          <TabsContent value="settings">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>

      <TaskAssignmentModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAssign={handleTaskAssignment}
        pickers={pickers}
        isLoading={isCreating}
      />
    </div>
  );
};

export default SupervisorDashboard;
