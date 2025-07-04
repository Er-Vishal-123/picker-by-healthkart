
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  Package
} from 'lucide-react';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';
import { useTaskAssignments } from '@/hooks/useTaskAssignments';
import { useCategoryPerformance } from '@/hooks/useCategoryPerformance';

const AdminReports = () => {
  const [dateRange, setDateRange] = useState('last_7_days');
  const { metrics } = usePerformanceMetrics();
  const { taskAssignments } = useTaskAssignments();
  const { categoryPerformance } = useCategoryPerformance();

  const reportCategories = [
    {
      id: 'performance',
      title: 'Performance Reports',
      description: 'Detailed analysis of picker and team performance',
      icon: TrendingUp,
      reports: [
        { name: 'Daily Performance Summary', type: 'daily', format: 'PDF' },
        { name: 'Weekly Efficiency Report', type: 'weekly', format: 'Excel' },
        { name: 'Monthly Performance Analysis', type: 'monthly', format: 'PDF' },
        { name: 'Picker Comparison Report', type: 'comparison', format: 'Excel' }
      ]
    },
    {
      id: 'operations',
      title: 'Operations Reports',
      description: 'Operational metrics and workflow analysis',
      icon: BarChart3,
      reports: [
        { name: 'Task Assignment Analysis', type: 'tasks', format: 'PDF' },
        { name: 'Workflow Efficiency Report', type: 'workflow', format: 'Excel' },
        { name: 'SLA Compliance Report', type: 'sla', format: 'PDF' },
        { name: 'Resource Utilization', type: 'resources', format: 'Excel' }
      ]
    },
    {
      id: 'inventory',
      title: 'Inventory Reports',
      description: 'Stock levels, category performance, and picking accuracy',
      icon: Package,
      reports: [
        { name: 'Category Performance Report', type: 'category', format: 'PDF' },
        { name: 'Picking Accuracy Analysis', type: 'accuracy', format: 'Excel' },
        { name: 'Stock Movement Report', type: 'movement', format: 'PDF' },
        { name: 'Exception Analysis', type: 'exceptions', format: 'Excel' }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & Insights',
      description: 'Advanced analytics and predictive insights',
      icon: PieChart,
      reports: [
        { name: 'Predictive Performance Model', type: 'predictive', format: 'PDF' },
        { name: 'Trend Analysis Report', type: 'trends', format: 'Excel' },
        { name: 'Capacity Planning Report', type: 'capacity', format: 'PDF' },
        { name: 'ROI Analysis', type: 'roi', format: 'Excel' }
      ]
    }
  ];

  const handleGenerateReport = (reportType: string, format: string) => {
    console.log(`Generating ${reportType} report in ${format} format`);
  };

  const handleExportData = (dataType: string) => {
    console.log(`Exporting ${dataType} data`);
  };

  return (
    <div className="space-y-6">
      {/* Report Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Reports</p>
                <p className="text-3xl font-bold">16</p>
                <p className="text-blue-200 text-xs">Available</p>
              </div>
              <FileText className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Data Points</p>
                <p className="text-3xl font-bold">{metrics.length + taskAssignments.length}</p>
                <p className="text-green-200 text-xs">Collected</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Categories</p>
                <p className="text-3xl font-bold">{categoryPerformance.length}</p>
                <p className="text-purple-200 text-xs">Tracked</p>
              </div>
              <PieChart className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Avg Efficiency</p>
                <p className="text-3xl font-bold">
                  {metrics.length > 0 
                    ? (metrics.reduce((sum, m) => sum + (m.efficiency_score || 0), 0) / metrics.length).toFixed(1)
                    : '0'}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white shadow-lg rounded-xl p-2">
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="export">Data Export</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <div className="space-y-6">
            {/* Date Range Selector */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Report Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <label className="font-medium">Date Range:</label>
                  <select
                    className="px-3 py-2 border rounded-md"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last_7_days">Last 7 Days</option>
                    <option value="last_30_days">Last 30 Days</option>
                    <option value="this_month">This Month</option>
                    <option value="last_month">Last Month</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Report Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reportCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card key={category.id} className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5" />
                        {category.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.reports.map((report, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{report.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {report.format}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {report.type}
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleGenerateReport(report.type, report.format)}
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Generate
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Daily Performance Summary', frequency: 'Daily at 6:00 AM', status: 'active', nextRun: 'Tomorrow 6:00 AM' },
                  { name: 'Weekly Efficiency Report', frequency: 'Every Monday', status: 'active', nextRun: 'Monday 8:00 AM' },
                  { name: 'Monthly Analysis', frequency: 'First day of month', status: 'paused', nextRun: 'Next month' },
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{schedule.name}</p>
                      <p className="text-sm text-gray-600">{schedule.frequency}</p>
                      <p className="text-xs text-gray-500">Next run: {schedule.nextRun}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        schedule.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }>
                        {schedule.status.toUpperCase()}
                      </Badge>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                  </div>
                ))}
                <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule New Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Raw Data Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Performance Metrics', count: metrics.length, type: 'metrics' },
                  { name: 'Task Assignments', count: taskAssignments.length, type: 'tasks' },
                  { name: 'Category Performance', count: categoryPerformance.length, type: 'categories' },
                  { name: 'User Activity Logs', count: 1247, type: 'logs' },
                ].map((dataType, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{dataType.name}</p>
                      <p className="text-sm text-gray-600">{dataType.count} records</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleExportData(dataType.type)}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Format</label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option value="csv">CSV</option>
                    <option value="excel">Excel (.xlsx)</option>
                    <option value="json">JSON</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Compression</label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option value="none">None</option>
                    <option value="zip">ZIP</option>
                    <option value="gzip">GZIP</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="includeHeaders" defaultChecked />
                  <label htmlFor="includeHeaders" className="text-sm">Include column headers</label>
                </div>
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
