
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Database, 
  Users, 
  BarChart3, 
  Workflow, 
  FileText,
  LogOut,
  Activity,
  Building2,
  ClipboardList,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import WMSIntegration from './admin/WMSIntegration';
import WorkflowManager from './admin/WorkflowManager';
import AdminReports from './admin/AdminReports';
import UserManagement from './admin/UserManagement';
import WorkAssignmentOverview from './admin/WorkAssignmentOverview';
import { useTaskAssignments } from '@/hooks/useTaskAssignments';
import { useRealTimePickers } from '@/hooks/useRealTimePickers';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';

interface AdminDashboardProps {
  user: { id: string; name: string; role: 'admin' };
  onLogout: () => void;
}

const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { taskAssignments, isLoading: tasksLoading } = useTaskAssignments();
  const { pickers, isLoading: pickersLoading } = useRealTimePickers();
  const { metrics, isLoading: metricsLoading } = usePerformanceMetrics();

  // Calculate dashboard statistics
  const totalTasks = taskAssignments.length;
  const pendingTasks = taskAssignments.filter(t => t.status === 'assigned').length;
  const completedTasks = taskAssignments.filter(t => t.status === 'completed').length;
  const overdueTasks = taskAssignments.filter(t => 
    t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed'
  ).length;

  const activePickers = pickers.filter(p => p.status === 'active').length;
  const totalPickers = pickers.length;
  const idlePickers = pickers.filter(p => p.status === 'idle').length;

  const avgEfficiency = metrics.length > 0 
    ? metrics.reduce((sum, m) => sum + (m.efficiency_score || 0), 0) / metrics.length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-900 text-white p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
              <Settings className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Control Center</h1>
              <p className="text-slate-300">Picker by HealthKart - System Administration</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-300">Administrator</p>
              <p className="font-semibold">{user.name}</p>
            </div>
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
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-lg rounded-xl p-2">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="wms" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
              <Database className="h-4 w-4" />
              WMS Integration
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
              <Workflow className="h-4 w-4" />
              Workflow
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
              <ClipboardList className="h-4 w-4" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Total Tasks</p>
                        <p className="text-3xl font-bold">{totalTasks}</p>
                        <p className="text-blue-200 text-xs">{pendingTasks} pending</p>
                      </div>
                      <ClipboardList className="h-8 w-8 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Active Pickers</p>
                        <p className="text-3xl font-bold">{activePickers}</p>
                        <p className="text-green-200 text-xs">of {totalPickers} total</p>
                      </div>
                      <Activity className="h-8 w-8 text-green-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Avg Efficiency</p>
                        <p className="text-3xl font-bold">{avgEfficiency.toFixed(1)}%</p>
                        <p className="text-purple-200 text-xs">System wide</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">Overdue Tasks</p>
                        <p className="text-3xl font-bold">{overdueTasks}</p>
                        <p className="text-orange-200 text-xs">Need attention</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-orange-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Real-time System Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Picker Status Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pickersLoading ? (
                      <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-12 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {pickers.slice(0, 5).map((picker) => (
                          <div key={picker.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                picker.status === 'active' ? 'bg-green-500' :
                                picker.status === 'idle' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                              <div>
                                <p className="font-semibold text-gray-900">{picker.name}</p>
                                <p className="text-sm text-gray-600">
                                  {picker.currentPicklist ? `Working: ${picker.currentPicklist}` : 'Available'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Progress</p>
                                <p className="font-semibold">{picker.completed}/{picker.totalAssigned}</p>
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

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">Database Connection</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">Real-time Updates</span>
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="font-medium">WMS Integration</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">Task Processing</span>
                        <Badge className="bg-blue-100 text-blue-800">Normal</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wms">
            <WMSIntegration />
          </TabsContent>

          <TabsContent value="workflow">
            <WorkflowManager />
          </TabsContent>

          <TabsContent value="assignments">
            <WorkAssignmentOverview />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="reports">
            <AdminReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
