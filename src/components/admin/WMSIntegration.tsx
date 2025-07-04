
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Plug,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WMSIntegration = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const { toast } = useToast();

  const [wmsConfig, setWmsConfig] = useState({
    system: 'SAP',
    apiEndpoint: '',
    apiKey: '',
    username: '',
    password: '',
    syncInterval: '15',
    autoSync: true,
  });

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionStatus('connecting');
    
    // Simulate connection process
    setTimeout(() => {
      setConnectionStatus('connected');
      setIsConnecting(false);
      toast({
        title: "WMS Connected",
        description: "Successfully connected to warehouse management system.",
      });
    }, 3000);
  };

  const handleDisconnect = () => {
    setConnectionStatus('disconnected');
    toast({
      title: "WMS Disconnected",
      description: "Disconnected from warehouse management system.",
    });
  };

  const handleSync = () => {
    toast({
      title: "Sync Started",
      description: "Synchronizing data with WMS...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            WMS Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-100' :
                connectionStatus === 'connecting' ? 'bg-yellow-100' :
                connectionStatus === 'error' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {connectionStatus === 'connected' ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : connectionStatus === 'connecting' ? (
                  <RefreshCw className="h-6 w-6 text-yellow-600 animate-spin" />
                ) : connectionStatus === 'error' ? (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                ) : (
                  <Plug className="h-6 w-6 text-gray-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {connectionStatus === 'connected' ? 'Connected to SAP WMS' :
                   connectionStatus === 'connecting' ? 'Connecting...' :
                   connectionStatus === 'error' ? 'Connection Error' : 'Not Connected'}
                </h3>
                <p className="text-sm text-gray-600">
                  {connectionStatus === 'connected' ? 'Last sync: 2 minutes ago' :
                   connectionStatus === 'connecting' ? 'Establishing connection...' :
                   'Configure and connect to your WMS'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={
                connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
                connectionStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
                connectionStatus === 'error' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }>
                {connectionStatus.toUpperCase()}
              </Badge>
              {connectionStatus === 'connected' ? (
                <Button onClick={handleDisconnect} variant="outline" size="sm">
                  Disconnect
                </Button>
              ) : (
                <Button 
                  onClick={handleConnect} 
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                >
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="configuration" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg rounded-xl p-2">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="mapping">Data Mapping</TabsTrigger>
          <TabsTrigger value="sync">Sync Settings</TabsTrigger>
          <TabsTrigger value="logs">Integration Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>WMS Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="system">WMS System</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={wmsConfig.system}
                      onChange={(e) => setWmsConfig({...wmsConfig, system: e.target.value})}
                    >
                      <option value="SAP">SAP EWM</option>
                      <option value="Oracle">Oracle WMS</option>
                      <option value="Manhattan">Manhattan Associates</option>
                      <option value="Infor">Infor WMS</option>
                      <option value="Custom">Custom API</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="endpoint">API Endpoint</Label>
                    <Input
                      id="endpoint"
                      placeholder="https://your-wms-api.com/v1"
                      value={wmsConfig.apiEndpoint}
                      onChange={(e) => setWmsConfig({...wmsConfig, apiEndpoint: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Enter API Key"
                      value={wmsConfig.apiKey}
                      onChange={(e) => setWmsConfig({...wmsConfig, apiKey: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="WMS Username"
                      value={wmsConfig.username}
                      onChange={(e) => setWmsConfig({...wmsConfig, username: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="WMS Password"
                      value={wmsConfig.password}
                      onChange={(e) => setWmsConfig({...wmsConfig, password: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="interval">Sync Interval (minutes)</Label>
                    <Input
                      id="interval"
                      type="number"
                      value={wmsConfig.syncInterval}
                      onChange={(e) => setWmsConfig({...wmsConfig, syncInterval: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoSync"
                  checked={wmsConfig.autoSync}
                  onChange={(e) => setWmsConfig({...wmsConfig, autoSync: e.target.checked})}
                />
                <Label htmlFor="autoSync">Enable automatic synchronization</Label>
              </div>

              <div className="flex space-x-4">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  Save Configuration
                </Button>
                <Button variant="outline">
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Data Field Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 font-semibold border-b pb-2">
                  <div>HealthKart Field</div>
                  <div>WMS Field</div>
                </div>

                {[
                  { hk: 'Product SKU', wms: 'ITEM_CODE' },
                  { hk: 'Product Name', wms: 'ITEM_DESC' },
                  { hk: 'Location', wms: 'LOC_ID' },
                  { hk: 'Quantity', wms: 'QTY_ON_HAND' },
                  { hk: 'Order Number', wms: 'ORDER_ID' },
                  { hk: 'Pick List', wms: 'WAVE_ID' },
                ].map((mapping, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 p-2 bg-gray-50 rounded">
                    <div className="font-medium">{mapping.hk}</div>
                    <div className="text-blue-600">{mapping.wms}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Synchronization Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Inventory Sync</p>
                          <p className="text-sm text-gray-600">Last: 5 min ago</p>
                        </div>
                        <Button size="sm" onClick={handleSync}>
                          <Download className="h-4 w-4 mr-1" />
                          Sync
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Orders Sync</p>
                          <p className="text-sm text-gray-600">Last: 3 min ago</p>
                        </div>
                        <Button size="sm" onClick={handleSync}>
                          <Download className="h-4 w-4 mr-1" />
                          Sync
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Performance Data</p>
                          <p className="text-sm text-gray-600">Last: 1 min ago</p>
                        </div>
                        <Button size="sm" onClick={handleSync}>
                          <Upload className="h-4 w-4 mr-1" />
                          Push
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Sync Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Last successful sync</span>
                      <span className="text-green-600">2 minutes ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Records synchronized</span>
                      <span>1,247 items</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sync frequency</span>
                      <span>Every 15 minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Integration Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { time: '14:30:25', type: 'success', message: 'Inventory sync completed successfully' },
                  { time: '14:25:12', type: 'info', message: 'Starting scheduled sync process' },
                  { time: '14:20:08', type: 'success', message: 'Order data pushed to WMS' },
                  { time: '14:15:45', type: 'warning', message: 'Connection timeout, retrying...' },
                  { time: '14:10:22', type: 'success', message: 'Authentication successful' },
                ].map((log, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-500 w-20">{log.time}</span>
                    <Badge className={
                      log.type === 'success' ? 'bg-green-100 text-green-800' :
                      log.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {log.type.toUpperCase()}
                    </Badge>
                    <span className="text-sm">{log.message}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WMSIntegration;
