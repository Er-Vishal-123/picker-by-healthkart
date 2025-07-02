
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Layers, Package, MapPin, CheckCircle, Clock } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'picker' | 'supervisor';
}

interface Picklist {
  id: string;
  orderNumber: string;
  priority: 'high' | 'medium' | 'low';
  totalItems: number;
  pickedItems: number;
  estimatedTime: string;
  assignedTime: string;
}

interface BatchPickingProps {
  onBack: () => void;
  user: User;
  picklists: Picklist[];
  isOnline: boolean;
}

interface BatchItem {
  id: string;
  sku: string;
  name: string;
  location: string;
  orders: {
    orderNumber: string;
    quantity: number;
    priority: 'high' | 'medium' | 'low';
  }[];
  totalQuantity: number;
  picked: boolean;
}

const BatchPicking = ({ onBack, user, picklists, isOnline }: BatchPickingProps) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [batchMode, setBatchMode] = useState<'select' | 'picking'>('select');
  const [currentBatch, setCurrentBatch] = useState<BatchItem[]>([]);

  // Mock batch items grouped by location
  const mockBatchItems: BatchItem[] = [
    {
      id: 'BI001',
      sku: 'SKU-12345',
      name: 'HealthKart Whey Protein 1kg',
      location: 'A1-B2-01',
      orders: [
        { orderNumber: 'ORD-2024-001', quantity: 2, priority: 'high' },
        { orderNumber: 'ORD-2024-003', quantity: 1, priority: 'medium' }
      ],
      totalQuantity: 3,
      picked: false
    },
    {
      id: 'BI002',
      sku: 'SKU-67890',
      name: 'Multivitamin Tablets',
      location: 'A1-B2-05',
      orders: [
        { orderNumber: 'ORD-2024-002', quantity: 1, priority: 'low' },
        { orderNumber: 'ORD-2024-003', quantity: 2, priority: 'medium' }
      ],
      totalQuantity: 3,
      picked: false
    },
    {
      id: 'BI003',
      sku: 'SKU-11111',
      name: 'Protein Bar 12-Pack',
      location: 'B1-A3-12',
      orders: [
        { orderNumber: 'ORD-2024-001', quantity: 1, priority: 'high' },
        { orderNumber: 'ORD-2024-002', quantity: 1, priority: 'low' }
      ],
      totalQuantity: 2,
      picked: false
    }
  ];

  const handleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleStartBatch = () => {
    if (selectedOrders.length >= 2) {
      setCurrentBatch(mockBatchItems);
      setBatchMode('picking');
    }
  };

  const handleItemPicked = (itemId: string) => {
    setCurrentBatch(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, picked: true } : item
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const groupedByLocation = currentBatch.reduce((acc, item) => {
    const zone = item.location.split('-')[0];
    if (!acc[zone]) acc[zone] = [];
    acc[zone].push(item);
    return acc;
  }, {} as Record<string, BatchItem[]>);

  if (batchMode === 'picking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setBatchMode('select')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Selection
              </Button>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Batch Picking Mode</h1>
                <p className="text-sm text-gray-600">{selectedOrders.length} orders selected</p>
              </div>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Progress Overview */}
          <Card className="shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Batch Progress</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {currentBatch.filter(item => item.picked).length} / {currentBatch.length} items picked
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentBatch.filter(item => item.picked).length / currentBatch.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-blue-800">Total Items</h4>
                  <p className="text-2xl font-bold text-blue-600">{currentBatch.length}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-green-800">Picked</h4>
                  <p className="text-2xl font-bold text-green-600">{currentBatch.filter(item => item.picked).length}</p>
                </div>
                <div className="bg-orange-100 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-orange-800">Remaining</h4>
                  <p className="text-2xl font-bold text-orange-600">{currentBatch.filter(item => !item.picked).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grouped by Location */}
          <div className="space-y-6">
            {Object.entries(groupedByLocation).map(([zone, items]) => (
              <Card key={zone} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Zone {zone}
                    <Badge variant="outline" className="ml-2">
                      {items.length} items
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div 
                        key={item.id} 
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          item.picked 
                            ? 'bg-green-100 border-green-200' 
                            : 'bg-white border-gray-200 hover:border-orange-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{item.name}</h4>
                              {item.picked && <CheckCircle className="h-5 w-5 text-green-500" />}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                              <div>
                                <p className="text-gray-600">SKU: <span className="font-mono">{item.sku}</span></p>
                                <p className="text-gray-600">Location: <span className="font-semibold">{item.location}</span></p>
                              </div>
                              <div>
                                <p className="text-gray-600">Total Quantity: <span className="font-semibold">{item.totalQuantity}</span></p>
                                <p className="text-gray-600">For {item.orders.length} orders</p>
                              </div>
                            </div>
                            
                            {/* Order Breakdown */}
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-2">Required for orders:</p>
                              <div className="flex flex-wrap gap-2">
                                {item.orders.map((order, index) => (
                                  <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                    <span className="text-xs font-mono">{order.orderNumber}</span>
                                    <span className="text-xs">({order.quantity}x)</span>
                                    <Badge className={`${getPriorityColor(order.priority)} text-xs`}>
                                      {order.priority}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="ml-4">
                            <Button
                              onClick={() => handleItemPicked(item.id)}
                              disabled={item.picked}
                              className={`${
                                item.picked 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white'
                              }`}
                            >
                              {item.picked ? '✅ Picked' : '📦 Pick Item'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Complete Batch */}
          {currentBatch.every(item => item.picked) && (
            <Card className="shadow-lg mt-6 border-2 border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Batch Picking Complete!</h3>
                <p className="text-green-700 mb-4">All items have been picked successfully</p>
                <Button 
                  onClick={onBack}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  🎉 Complete & Return to Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Batch/Multi-Order Picking</h1>
              <p className="text-sm text-gray-600">Pick multiple orders efficiently</p>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Selection Instructions */}
        <Card className="shadow-lg mb-6 border-2 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How Batch Picking Works</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Select 2 or more orders to pick together</li>
                  <li>• Items are grouped by bin location for efficient routing</li>
                  <li>• Pick the total quantity needed for all selected orders</li>
                  <li>• System will guide you through zone-by-zone picking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Selection */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Select Orders for Batch Picking
              </div>
              <Badge variant="outline">
                {selectedOrders.length} selected
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 mb-6">
              {picklists.map((picklist) => (
                <div 
                  key={picklist.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedOrders.includes(picklist.id)
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-200 bg-white'
                  }`}
                  onClick={() => handleOrderSelection(picklist.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(picklist.id)}
                          onChange={() => handleOrderSelection(picklist.id)}
                          className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                        />
                        <h4 className="font-semibold text-gray-900">{picklist.orderNumber}</h4>
                        <Badge className={getPriorityColor(picklist.priority)}>
                          {picklist.priority.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 ml-7">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span>{picklist.totalItems} items</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{picklist.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>Assigned: {picklist.assignedTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Batch Benefits */}
            {selectedOrders.length >= 2 && (
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-green-800 mb-2">Batch Picking Benefits:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
                  <div>
                    <strong>Time Saved:</strong> ~25% faster than individual picking
                  </div>
                  <div>
                    <strong>Steps Reduced:</strong> Optimized routing between zones
                  </div>
                  <div>
                    <strong>Efficiency:</strong> Single trip for multiple orders
                  </div>
                </div>
              </div>
            )}

            {/* Start Batch Button */}
            <Button
              onClick={handleStartBatch}
              disabled={selectedOrders.length < 2}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white h-12"
            >
              <Layers className="h-5 w-5 mr-2" />
              {selectedOrders.length < 2 
                ? 'Select at least 2 orders to start batch picking'
                : `Start Batch Picking (${selectedOrders.length} orders)`
              }
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BatchPicking;
