
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Users, Package, Clock, ArrowRight, Shuffle } from 'lucide-react';

interface PickerStatus {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'offline';
  currentPicklist: string | null;
  totalAssigned: number;
  completed: number;
  inProgress: number;
  efficiency: number;
}

interface DynamicAssignmentProps {
  pickers: PickerStatus[];
  setPickers: (pickers: PickerStatus[]) => void;
}

const DynamicAssignment = ({ pickers, setPickers }: DynamicAssignmentProps) => {
  const [selectedPicker, setSelectedPicker] = useState<string | null>(null);
  const [reassignmentMode, setReassignmentMode] = useState(false);

  const availablePickers = pickers.filter(p => p.status !== 'offline');
  const idlePickers = pickers.filter(p => p.status === 'idle');
  const busyPickers = pickers.filter(p => p.status === 'active' && p.inProgress > 2);

  const pendingOrders = [
    { id: 'ORD-2024-010', priority: 'high', items: 15, estimatedTime: '25 min', zone: 'A1' },
    { id: 'ORD-2024-011', priority: 'medium', items: 8, estimatedTime: '15 min', zone: 'B2' },
    { id: 'ORD-2024-012', priority: 'high', items: 22, estimatedTime: '40 min', zone: 'C1' },
    { id: 'ORD-2024-013', priority: 'low', items: 5, estimatedTime: '10 min', zone: 'A3' },
    { id: 'ORD-2024-014', priority: 'medium', items: 12, estimatedTime: '20 min', zone: 'B1' },
  ];

  const handleAutoAssign = () => {
    // Simulate auto-assignment logic
    console.log('Auto-assigning orders based on picker availability and location');
  };

  const handleReassign = (fromPicker: string, toPicker: string) => {
    // Simulate reassignment logic
    console.log(`Reassigning from ${fromPicker} to ${toPicker}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Assignment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Available Pickers</p>
                <p className="text-3xl font-bold">{availablePickers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Idle Pickers</p>
                <p className="text-3xl font-bold">{idlePickers.length}</p>
              </div>
              <Clock className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Overloaded</p>
                <p className="text-3xl font-bold">{busyPickers.length}</p>
              </div>
              <Package className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Pending Orders</p>
                <p className="text-3xl font-bold">{pendingOrders.length}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Assignment Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shuffle className="h-5 w-5" />
              Smart Assignment Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleAutoAssign}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Auto-Assign All Pending Orders
            </Button>
            
            <Button 
              onClick={() => setReassignmentMode(!reassignmentMode)}
              variant="outline"
              className="w-full border-2 hover:bg-gray-50"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              {reassignmentMode ? 'Exit' : 'Enter'} Reassignment Mode
            </Button>

            <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-4 rounded-lg">
              <h4 className="font-semibold text-emerald-800 mb-2">AI Recommendations</h4>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Assign high-priority orders to Mike Chen (highest efficiency)</li>
                <li>• Move 2 orders from Lisa Brown to idle pickers</li>
                <li>• Group Zone A orders for better routing</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Workload Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pickers.map((picker) => (
                <div key={picker.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{picker.name}</p>
                    <p className="text-sm text-gray-600">{picker.inProgress} in progress, {picker.completed} completed</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          picker.inProgress <= 1 ? 'bg-green-500' :
                          picker.inProgress <= 3 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, (picker.inProgress / 5) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{picker.efficiency}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Orders Queue */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Pending Orders Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Priority</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Items</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Est. Time</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Zone</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Suggested Picker</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((order, index) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50">
                    <td className="py-4 px-4 font-mono text-sm">{order.id}</td>
                    <td className="py-4 px-4 text-center">
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center font-semibold">{order.items}</td>
                    <td className="py-4 px-4 text-center text-sm text-gray-600">{order.estimatedTime}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
                        {order.zone}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-sm">
                      {idlePickers.length > 0 ? idlePickers[index % idlePickers.length]?.name || 'Auto-assign' : 'No available picker'}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                        Assign
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicAssignment;
