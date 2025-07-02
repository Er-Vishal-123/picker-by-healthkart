
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Brain, TrendingDown, Package, Clock, Zap } from 'lucide-react';

interface PickerStatus {
  id: string;
  name: string;
  efficiency: number;
  exceptions: number;
}

interface PredictiveAlertsProps {
  pickers: PickerStatus[];
}

const PredictiveAlerts = ({ pickers }: PredictiveAlertsProps) => {
  const alerts = [
    {
      id: 'alert-1',
      type: 'performance',
      severity: 'high',
      title: 'Performance Drop Detected',
      description: 'John Smith\'s efficiency dropped 15% in the last hour',
      prediction: 'Likely to miss daily target by 8%',
      action: 'Recommend break or task reassignment',
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200'
    },
    {
      id: 'alert-2',
      type: 'inventory',
      severity: 'medium',
      title: 'SKU Pattern Alert',
      description: 'SKU-12345 has 75% "not found" rate in Zone A3',
      prediction: 'Bin location likely incorrect or empty',
      action: 'Schedule immediate cycle count',
      icon: Package,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-200'
    },
    {
      id: 'alert-3',
      type: 'workload',
      severity: 'high',
      title: 'Workload Imbalance',
      description: 'Zone C has 3x more picks than other zones',
      prediction: 'Delays expected in 2-3 hours',
      action: 'Redistribute pickers to Zone C',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-200'
    },
    {
      id: 'alert-4',
      type: 'quality',
      severity: 'low',
      title: 'Quality Trend Positive',
      description: 'Pick accuracy improved 5% this week',
      prediction: 'On track to exceed monthly target',
      action: 'Continue current processes',
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200'
    }
  ];

  const getBadgeColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">High Priority</p>
                <p className="text-3xl font-bold">{alerts.filter(a => a.severity === 'high').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Medium Priority</p>
                <p className="text-3xl font-bold">{alerts.filter(a => a.severity === 'medium').length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">AI Predictions</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <Brain className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Positive Trends</p>
                <p className="text-3xl font-bold">{alerts.filter(a => a.severity === 'low').length}</p>
              </div>
              <Zap className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Alerts List */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Predictive Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-6 rounded-lg border-2 ${alert.bgColor} ${alert.borderColor} hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-2 rounded-full ${alert.bgColor}`}>
                      <alert.icon className={`h-6 w-6 ${alert.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                        <Badge className={getBadgeColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-2">{alert.description}</p>
                      <div className="bg-white/70 p-3 rounded-lg mb-3">
                        <p className="text-sm font-medium text-gray-800">
                          <Brain className="h-4 w-4 inline mr-2" />
                          AI Prediction: {alert.prediction}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Recommended Action:</span>
                        <span className="text-sm text-gray-800">{alert.action}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" className="bg-white hover:bg-gray-50">
                      View Details
                    </Button>
                    <Button size="sm" className={`${alert.color} bg-white hover:bg-gray-50 border`}>
                      Take Action
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prediction Accuracy */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>AI Model Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Prediction Accuracy</h4>
              <p className="text-3xl font-bold text-blue-600">94.2%</p>
              <p className="text-sm text-blue-700">Last 30 days</p>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Early Warnings</h4>
              <p className="text-3xl font-bold text-green-600">156</p>
              <p className="text-sm text-green-700">Issues prevented</p>
            </div>
            <div className="bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Time Saved</h4>
              <p className="text-3xl font-bold text-orange-600">24h</p>
              <p className="text-sm text-orange-700">This month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAlerts;
