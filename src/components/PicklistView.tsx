
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Scan, 
  Package, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Search,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PicklistItem {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  pickedQuantity: number;
  binLocation: string;
  alternateLocations: string[];
  status: 'pending' | 'picked' | 'not_found' | 'partial';
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

interface PicklistViewProps {
  picklist: Picklist;
  onBack: () => void;
  onComplete: () => void;
  isOnline: boolean;
}

const PicklistView = ({ picklist, onBack, onComplete, isOnline }: PicklistViewProps) => {
  const [items, setItems] = useState<PicklistItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [scanInput, setScanInput] = useState('');
  const [showAlternates, setShowAlternates] = useState(false);
  const [queuedActions, setQueuedActions] = useState<any[]>([]);

  useEffect(() => {
    // Mock picklist items
    const mockItems: PicklistItem[] = [
      {
        id: 'ITM001',
        sku: 'WH-001-BLU',
        productName: 'Wireless Headphones - Blue',
        quantity: 2,
        pickedQuantity: 0,
        binLocation: 'A1-B3-S2',
        alternateLocations: ['A1-B4-S1', 'A2-B1-S3'],
        status: 'pending'
      },
      {
        id: 'ITM002',
        sku: 'KB-MEC-001',
        productName: 'Mechanical Keyboard',
        quantity: 1,
        pickedQuantity: 0,
        binLocation: 'B2-C1-S4',
        alternateLocations: ['B2-C2-S1'],
        status: 'pending'
      },
      {
        id: 'ITM003',
        sku: 'MS-OPT-BLK',
        productName: 'Optical Mouse - Black',
        quantity: 3,
        pickedQuantity: 0,
        binLocation: 'A3-B2-S1',
        alternateLocations: ['A3-B3-S2', 'A4-B1-S1'],
        status: 'pending'
      },
      // ... more items
    ];
    setItems(mockItems);
  }, []);

  const currentItem = items[currentItemIndex];
  const completedItems = items.filter(item => item.status === 'picked').length;
  const progress = (completedItems / items.length) * 100;

  const handleScan = () => {
    if (!scanInput.trim()) return;
    
    const scannedSku = scanInput.trim().toUpperCase();
    const expectedSku = currentItem?.sku.toUpperCase();
    
    if (scannedSku === expectedSku) {
      handleItemPicked();
      toast({
        title: "Item Scanned Successfully! ✅",
        description: `${currentItem.productName} has been scanned.`,
      });
    } else {
      toast({
        title: "SKU Mismatch ❌",
        description: `Expected: ${expectedSku}, Scanned: ${scannedSku}`,
        variant: "destructive"
      });
    }
    setScanInput('');
  };

  const handleItemPicked = () => {
    if (!currentItem) return;
    
    const updatedItems = [...items];
    updatedItems[currentItemIndex] = {
      ...currentItem,
      status: 'picked',
      pickedQuantity: currentItem.quantity
    };
    setItems(updatedItems);
    
    // Queue action for sync
    const action = {
      type: 'ITEM_PICKED',
      picklistId: picklist.id,
      itemId: currentItem.id,
      timestamp: new Date().toISOString()
    };
    
    if (isOnline) {
      // Simulate API call
      console.log('Syncing to WMS:', action);
    } else {
      setQueuedActions(prev => [...prev, action]);
    }
    
    // Move to next item
    if (currentItemIndex < items.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    }
  };

  const handleItemNotFound = () => {
    if (!currentItem) return;
    
    const updatedItems = [...items];
    updatedItems[currentItemIndex] = {
      ...currentItem,
      status: 'not_found'
    };
    setItems(updatedItems);
    
    setShowAlternates(true);
    
    toast({
      title: "Item Marked as Not Found 🔍",
      description: "Check alternate locations or trigger cycle count.",
      variant: "destructive"
    });
  };

  const handleCycleCount = () => {
    toast({
      title: "Cycle Count Triggered 🔄",
      description: `Cycle count initiated for ${currentItem?.sku} at ${currentItem?.binLocation}`,
    });
    
    // Move to next item after triggering cycle count
    if (currentItemIndex < items.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    }
    setShowAlternates(false);
  };

  const handleCompletePicklist = () => {
    const allItemsPicked = items.every(item => item.status === 'picked');
    
    if (!allItemsPicked) {
      toast({
        title: "Incomplete Picklist ⚠️",
        description: "Some items are still pending. Please complete all items or mark them as not found.",
        variant: "destructive"
      });
      return;
    }
    
    onComplete();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'picked': return 'bg-green-100 text-green-800 border-green-200';
      case 'not_found': return 'bg-red-100 text-red-800 border-red-200';
      case 'partial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!currentItem && items.length > 0) {
    // All items processed - show completion screen
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                Picklist Complete! 🎉
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Order {picklist.orderNumber} has been successfully completed
              </p>
            </CardHeader>
            
            <CardContent className="text-center space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{completedItems}</p>
                  <p className="text-sm text-green-700">Items Picked</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">100%</p>
                  <p className="text-sm text-blue-700">Completion Rate</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="flex-1 h-12 text-lg"
                >
                  Back to Dashboard
                </Button>
                <Button
                  onClick={handleCompletePicklist}
                  className="flex-1 h-12 text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0"
                >
                  Complete Picklist
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="w-px h-6 bg-gray-300" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{picklist.orderNumber}</h1>
              <p className="text-sm text-gray-600">
                {completedItems} of {items.length} items picked ({Math.round(progress)}%)
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {!isOnline && queuedActions.length > 0 && (
              <Badge className="bg-orange-100 text-orange-800">
                {queuedActions.length} queued actions
              </Badge>
            )}
            <div className="w-full bg-gray-200 rounded-full h-2 w-32">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {currentItem && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Current Item Card */}
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-orange-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Item {currentItemIndex + 1} of {items.length}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">SKU</p>
                  <p className="text-2xl font-bold text-gray-900 font-mono">{currentItem.sku}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Product Name</p>
                  <p className="text-lg font-semibold text-gray-900">{currentItem.productName}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="text-xl font-bold text-blue-600">{currentItem.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bin Location</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <p className="text-lg font-bold text-orange-600 font-mono">{currentItem.binLocation}</p>
                    </div>
                  </div>
                </div>
                
                <Badge className={getStatusColor(currentItem.status)}>
                  {currentItem.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </CardContent>
            </Card>

            {/* Scanning and Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  Scan Item
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    placeholder="Scan barcode or enter SKU"
                    className="h-12 text-lg font-mono"
                    onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                  />
                  <Button
                    onClick={handleScan}
                    className="h-12 px-6 bg-blue-500 hover:bg-blue-600"
                  >
                    <Scan className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleItemPicked}
                    className="h-14 bg-green-500 hover:bg-green-600 text-white font-semibold"
                    disabled={currentItem.status === 'picked'}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Mark as Picked
                  </Button>
                  
                  <Button
                    onClick={handleItemNotFound}
                    variant="destructive"
                    className="h-14 font-semibold"
                    disabled={currentItem.status === 'not_found'}
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Not Found
                  </Button>
                </div>
                
                {showAlternates && (
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <h4 className="font-semibold text-orange-800">Alternate Locations</h4>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {currentItem.alternateLocations.map((location, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                            <MapPin className="h-4 w-4 text-orange-500" />
                            <span className="font-mono font-semibold">{location}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={handleCycleCount}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Trigger Cycle Count
                        </Button>
                        <Button
                          onClick={() => setShowAlternates(false)}
                          variant="outline"
                        >
                          Close
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Items Summary */}
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle>Picklist Items Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded border-2 transition-all ${
                    index === currentItemIndex
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.sku}</p>
                    <p className="text-sm text-gray-600">{item.productName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm">{item.binLocation}</span>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status === 'picked' ? '✓' : item.status === 'not_found' ? '✗' : '⏳'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PicklistView;
