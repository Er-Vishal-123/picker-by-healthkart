
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Package, Scan, MapPin, Clock, CheckCircle } from 'lucide-react';
import PicklistView from './PicklistView';
import { toast } from '@/hooks/use-toast';

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

interface PickerDashboardProps {
  user: User;
  onLogout: () => void;
}

const PickerDashboard = ({ user, onLogout }: PickerDashboardProps) => {
  const [picklists, setPicklists] = useState<Picklist[]>([]);
  const [selectedPicklist, setSelectedPicklist] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Simulate loading picklists assigned to the user
    const mockPicklists: Picklist[] = [
      {
        id: 'PL001',
        orderNumber: 'ORD-2024-001',
        priority: 'high',
        totalItems: 15,
        pickedItems: 0,
        estimatedTime: '25 min',
        assignedTime: '09:30 AM'
      },
      {
        id: 'PL002',
        orderNumber: 'ORD-2024-002',
        priority: 'medium',
        totalItems: 8,
        pickedItems: 3,
        estimatedTime: '15 min',
        assignedTime: '10:15 AM'
      },
      {
        id: 'PL003',
        orderNumber: 'ORD-2024-003',
        priority: 'low',
        totalItems: 22,
        pickedItems: 0,
        estimatedTime: '40 min',
        assignedTime: '11:00 AM'
      }
    ];
    setPicklists(mockPicklists);

    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handlePicklistSelect = (picklistId: string) => {
    setSelectedPicklist(picklistId);
  };

  const handlePicklistComplete = (picklistId: string) => {
    setPicklists(prev => 
      prev.map(pl => 
        pl.id === picklistId 
          ? { ...pl, pickedItems: pl.totalItems }
          : pl
      )
    );
    setSelectedPicklist(null);
    toast({
      title: "Picklist Completed! 🎉",
      description: `Order ${picklists.find(pl => pl.id === picklistId)?.orderNumber} has been completed successfully.`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (selectedPicklist) {
    const picklist = picklists.find(pl => pl.id === selectedPicklist);
    if (picklist) {
      return (
        <PicklistView
          picklist={picklist}
          onBack={() => setSelectedPicklist(null)}
          onComplete={() => handlePicklistComplete(selectedPicklist)}
          isOnline={isOnline}
        />
      );
    }
  }

  const completedCount = picklists.filter(pl => pl.pickedItems === pl.totalItems).length;
  const inProgressCount = picklists.filter(pl => pl.pickedItems > 0 && pl.pickedItems < pl.totalItems).length;
  const pendingCount = picklists.filter(pl => pl.pickedItems === 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Welcome, {user.name}</h1>
              <p className="text-sm text-gray-600">Picker ID: {user.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOnline ? '🟢 Online' : '🔴 Offline'}
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
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Picklists</p>
                  <p className="text-3xl font-bold">{picklists.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Completed</p>
                  <p className="text-3xl font-bold">{completedCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">In Progress</p>
                  <p className="text-3xl font-bold">{inProgressCount}</p>
                </div>
                <Scan className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Pending</p>
                  <p className="text-3xl font-bold">{pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Picklists */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Assigned Picklists</h2>
          <div className="grid gap-4">
            {picklists.map((picklist) => (
              <Card 
                key={picklist.id} 
                className="hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200 cursor-pointer"
                onClick={() => handlePicklistSelect(picklist.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{picklist.orderNumber}</h3>
                        <Badge className={getPriorityColor(picklist.priority)}>
                          {picklist.priority.toUpperCase()}
                        </Badge>
                        {picklist.pickedItems === picklist.totalItems && (
                          <Badge className="bg-green-500 text-white">COMPLETED</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span>{picklist.pickedItems}/{picklist.totalItems} items</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{picklist.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>Assigned: {picklist.assignedTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(picklist.pickedItems / picklist.totalItems) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs">{Math.round((picklist.pickedItems / picklist.totalItems) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="ml-4 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white border-0"
                      disabled={picklist.pickedItems === picklist.totalItems}
                    >
                      {picklist.pickedItems === picklist.totalItems ? 'Completed' : 'Start Picking'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickerDashboard;
