
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Workflow, 
  Play, 
  Pause, 
  Settings, 
  Clock,
  CheckCircle,
  ArrowRight,
  Users
} from 'lucide-react';

const WorkflowManager = () => {
  const [workflows, setWorkflows] = useState([
    {
      id: '1',
      name: 'Standard Picking Workflow',
      status: 'active',
      description: 'Default workflow for regular order picking',
      steps: [
        'Receive Order',
        'Generate Pick List',
        'Assign to Picker',
        'Pick Items',
        'Quality Check',
        'Pack & Ship'
      ],
      assignedPickers: 12,
      completionTime: '25 min avg',
      successRate: 98.5
    },
    {
      id: '2',
      name: 'Express Order Workflow',
      status: 'active',
      description: 'Fast-track workflow for priority orders',
      steps: [
        'Priority Queue',
        'Instant Assignment',
        'Express Picking',
        'Quick Pack',
        'Priority Ship'
      ],
      assignedPickers: 5,
      completionTime: '12 min avg',
      successRate: 99.2
    },
    {
      id: '3',
      name: 'Bulk Order Workflow',
      status: 'paused',
      description: 'Workflow for large quantity orders',
      steps: [
        'Bulk Allocation',
        'Team Assignment',
        'Batch Picking',
        'Consolidation',
        'Quality Review',
        'Bulk Ship'
      ],
      assignedPickers: 8,
      completionTime: '45 min avg',
      successRate: 97.8
    }
  ]);

  const handleWorkflowToggle = (id: string) => {
    setWorkflows(workflows.map(w => 
      w.id === id 
        ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
        : w
    ));
  };

  return (
    <div className="space-y-6">
      {/* Workflow Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Active Workflows</p>
                <p className="text-3xl font-bold">{workflows.filter(w => w.status === 'active').length}</p>
              </div>
              <Workflow className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Pickers</p>
                <p className="text-3xl font-bold">{workflows.reduce((sum, w) => sum + w.assignedPickers, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Avg Completion</p>
                <p className="text-3xl font-bold">27</p>
                <p className="text-blue-200 text-xs">minutes</p>
              </div>
              <Clock className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Success Rate</p>
                <p className="text-3xl font-bold">98.5%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{workflow.name}</CardTitle>
                <Badge className={
                  workflow.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }>
                  {workflow.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{workflow.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Workflow Steps */}
              <div className="space-y-2">
                <p className="font-semibold text-sm">Workflow Steps:</p>
                <div className="flex flex-wrap gap-1">
                  {workflow.steps.map((step, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {step}
                      </span>
                      {index < workflow.steps.length - 1 && (
                        <ArrowRight className="h-3 w-3 mx-1 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-600">Assigned Pickers</p>
                  <p className="font-semibold">{workflow.assignedPickers}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Completion Time</p>
                  <p className="font-semibold">{workflow.completionTime}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Success Rate</p>
                  <p className="font-semibold text-green-600">{workflow.successRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Status</p>
                  <p className={`font-semibold ${
                    workflow.status === 'active' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {workflow.status === 'active' ? 'Running' : 'Paused'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4">
                <Button
                  size="sm"
                  onClick={() => handleWorkflowToggle(workflow.id)}
                  className={
                    workflow.status === 'active'
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }
                >
                  {workflow.status === 'active' ? (
                    <>
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </>
                  )}
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-1" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New Workflow */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Create New Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Design a custom workflow for your warehouse operations</p>
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                Create Workflow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowManager;
