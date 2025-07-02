
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertTriangle, CheckCircle, Clock, Database } from 'lucide-react';

const InventoryHeatmap = () => {
  const zones = [
    { id: 'A1', name: 'Zone A1', status: 'good', issues: 0, cycleCount: 2, color: 'bg-green-500', lastCount: '2 days ago' },
    { id: 'A2', name: 'Zone A2', status: 'warning', issues: 3, cycleCount: 5, color: 'bg-yellow-500', lastCount: '1 day ago' },
    { id: 'A3', name: 'Zone A3', status: 'critical', issues: 8, cycleCount: 12, color: 'bg-red-500', lastCount: '5 hours ago' },
    { id: 'B1', name: 'Zone B1', status: 'good', issues: 1, cycleCount: 1, color: 'bg-green-500', lastCount: '3 days ago' },
    { id: 'B2', name: 'Zone B2', status: 'warning', issues: 4, cycleCount: 7, color: 'bg-yellow-500', lastCount: '6 hours ago' },
    { id: 'B3', name: 'Zone B3', status: 'good', issues: 0, cycleCount: 0, color: 'bg-green-500', lastCount: '1 week ago' },
    { id: 'C1', name: 'Zone C1', status: 'critical', issues: 12, cycleCount: 18, color: 'bg-red-500', lastCount: '2 hours ago' },
    { id: 'C2', name: 'Zone C2', status: 'warning', issues: 2, cycleCount: 4, color: 'bg-yellow-500', lastCount: '4 hours ago' },
    { id: 'C3', name: 'Zone C3', status: 'good', issues: 1, cycleCount: 2, color: 'bg-green-500', lastCount: '2 days ago' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Heatmap Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Healthy Zones</p>
                <p className="text-3xl font-bold">{zones.filter(z => z.status === 'good').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Warning Zones</p>
                <p className="text-3xl font-bold">{zones.filter(z => z.status === 'warning').length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Critical Zones</p>
                <p className="text-3xl font-bold">{zones.filter(z => z.status === 'critical').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Issues</p>
                <p className="text-3xl font-bold">{zones.reduce((sum, z) => sum + z.issues, 0)}</p>
              </div>
              <Database className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Heatmap */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Warehouse Zone Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className={`${zone.color} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">{zone.name}</h3>
                  {getStatusIcon(zone.status)}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Issues:</span>
                    <span className="font-semibold">{zone.issues}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cycle Counts:</span>
                    <span className="font-semibold">{zone.cycleCount}</span>
                  </div>
                  <div className="text-xs opacity-90">
                    Last count: {zone.lastCount}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Healthy (0-1 issues)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm">Warning (2-5 issues)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Critical (6+ issues)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Zone Analysis */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Zone Issue Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Zone</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Current Issues</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Cycle Counts</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Count</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Action Needed</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr key={zone.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-semibold text-gray-900">{zone.name}</td>
                    <td className="py-4 px-4 text-center">
                      <Badge className={getStatusBadge(zone.status)}>
                        {zone.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`font-bold ${
                        zone.issues === 0 ? 'text-green-600' :
                        zone.issues <= 5 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {zone.issues}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
                        {zone.cycleCount}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{zone.lastCount}</td>
                    <td className="py-4 px-4 text-center">
                      {zone.status === 'critical' && (
                        <span className="text-red-600 font-semibold">Immediate Review</span>
                      )}
                      {zone.status === 'warning' && (
                        <span className="text-yellow-600 font-semibold">Schedule Count</span>
                      )}
                      {zone.status === 'good' && (
                        <span className="text-green-600 font-semibold">Monitor</span>
                      )}
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

export default InventoryHeatmap;
