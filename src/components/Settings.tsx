
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Link, 
  Database, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Cloud,
  Shield,
  Cpu,
  Globe,
  Wrench,
  RefreshCw
} from 'lucide-react';

interface WMSConfig {
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  endpoint: string;
  apiKey: string;
  syncEnabled: boolean;
  lastSync: string;
}

const Settings = () => {
  const [wmsConfigs, setWmsConfigs] = useState<WMSConfig[]>([
    {
      name: 'SAP WM',
      type: 'SAP',
      status: 'connected',
      endpoint: 'https://sap.healthkart.com/api',
      apiKey: '****-****-****-8912',
      syncEnabled: true,
      lastSync: '2 minutes ago'
    }
  ]);

  const [selectedWMS, setSelectedWMS] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  const wmsTemplates = [
    { id: 'sap', name: 'SAP WM/EWM', icon: Database, color: 'bg-blue-500', popular: true },
    { id: 'oracle', name: 'Oracle WMS', icon: Cloud, color: 'bg-red-500', popular: true },
    { id: 'manhattan', name: 'Manhattan Associates', icon: Cpu, color: 'bg-purple-500', popular: true },
    { id: 'blue-yonder', name: 'Blue Yonder', icon: Zap, color: 'bg-cyan-500', popular: false },
    { id: 'infor', name: 'Infor WMS', icon: Globe, color: 'bg-green-500', popular: false },
    { id: 'custom', name: 'Custom/REST API', icon: Wrench, color: 'bg-orange-500', popular: false }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <RefreshCw className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <SettingsIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              System Settings
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Configure your warehouse management integrations</p>
        </div>

        <Tabs defaultValue="wms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-lg rounded-xl p-2">
            <TabsTrigger value="wms" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Link className="h-4 w-4" />
              WMS Integration
            </TabsTrigger>
            <TabsTrigger value="sync" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <RefreshCw className="h-4 w-4" />
              Sync Settings
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* WMS Integration Tab */}
          <TabsContent value="wms" className="space-y-6">
            {/* WMS Templates */}
            <Card className="w-full shadow-xl border-0 bg-gradient-to-r from-white to-blue-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Database className="h-6 w-6 text-blue-600" />
                  Universal WMS Integration
                </CardTitle>
                <p className="text-gray-600">Connect with popular warehouse management systems</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {wmsTemplates.map((template) => {
                    const IconComponent = template.icon;
                    return (
                      <Card key={template.id} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                        <div className={`absolute top-0 left-0 w-full h-1 ${template.color}`} />
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 ${template.color} rounded-lg text-white`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{template.name}</h3>
                              {template.popular && (
                                <Badge className="bg-orange-100 text-orange-800 text-xs">Popular</Badge>
                              )}
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full group-hover:bg-blue-50"
                            onClick={() => {
                              setSelectedWMS(template.id);
                              setShowWizard(true);
                              setWizardStep(1);
                            }}
                          >
                            Configure
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Active Connections */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Active Connections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wmsConfigs.map((config, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(config.status)}
                          <span className="font-semibold">{config.name}</span>
                        </div>
                        <Badge className={getStatusColor(config.status)}>
                          {config.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Last sync: {config.lastSync}</span>
                        <Switch checked={config.syncEnabled} />
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sync Settings Tab */}
          <TabsContent value="sync" className="space-y-6">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  Real-time Synchronization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold">Auto-sync Inventory</Label>
                      <p className="text-sm text-gray-600">Automatically sync inventory levels every 5 minutes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold">Real-time Pick Updates</Label>
                      <p className="text-sm text-gray-600">Send pick confirmations immediately to WMS</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold">Batch Sync Mode</Label>
                      <p className="text-sm text-gray-600">Queue updates and sync in batches during off-peak hours</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Sync Frequency</Label>
                    <Select defaultValue="5min">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1min">Every 1 minute</SelectItem>
                        <SelectItem value="5min">Every 5 minutes</SelectItem>
                        <SelectItem value="15min">Every 15 minutes</SelectItem>
                        <SelectItem value="30min">Every 30 minutes</SelectItem>
                        <SelectItem value="1hour">Every hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">API Authentication Method</Label>
                    <Select defaultValue="oauth">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oauth">OAuth 2.0</SelectItem>
                        <SelectItem value="apikey">API Key</SelectItem>
                        <SelectItem value="basic">Basic Auth</SelectItem>
                        <SelectItem value="jwt">JWT Token</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold">Encrypt Data in Transit</Label>
                      <p className="text-sm text-gray-600">Use SSL/TLS encryption for all API communications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold">Enable Audit Logging</Label>
                      <p className="text-sm text-gray-600">Log all WMS integration activities for compliance</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Connection Timeout (seconds)</Label>
                    <Input type="number" defaultValue="30" className="w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Configuration Wizard Modal */}
        {showWizard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  WMS Configuration Wizard - Step {wizardStep} of 3
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Basic Connection Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>WMS Endpoint URL</Label>
                        <Input placeholder="https://your-wms.company.com/api" />
                      </div>
                      <div>
                        <Label>Environment</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select environment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="prod">Production</SelectItem>
                            <SelectItem value="staging">Staging</SelectItem>
                            <SelectItem value="dev">Development</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Authentication</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>API Key</Label>
                        <Input type="password" placeholder="Enter your API key" />
                      </div>
                      <div>
                        <Label>Username (if required)</Label>
                        <Input placeholder="Username" />
                      </div>
                      <Button variant="outline" className="w-full">
                        Test Connection
                      </Button>
                    </div>
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Sync Configuration</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Enable Real-time Sync</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Auto-configure Data Mapping</Label>
                        <Switch defaultChecked />
                      </div>
                      <div>
                        <Label>Sync Frequency</Label>
                        <Select defaultValue="5min">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1min">Every 1 minute</SelectItem>
                            <SelectItem value="5min">Every 5 minutes</SelectItem>
                            <SelectItem value="15min">Every 15 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => wizardStep > 1 ? setWizardStep(wizardStep - 1) : setShowWizard(false)}
                  >
                    {wizardStep > 1 ? 'Previous' : 'Cancel'}
                  </Button>
                  <Button 
                    onClick={() => wizardStep < 3 ? setWizardStep(wizardStep + 1) : setShowWizard(false)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {wizardStep < 3 ? 'Next' : 'Complete Setup'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
