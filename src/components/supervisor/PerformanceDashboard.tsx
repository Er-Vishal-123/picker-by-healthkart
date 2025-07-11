
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Clock, Award, Zap, BarChart3 } from 'lucide-react';

interface PickerStatus {
  id: string;
  name: string;
  pickAccuracy: number;
  timePerItem: number;
  ordersPerHour: number;
  efficiency: number;
  completed: number;
}

interface PerformanceDashboardProps {
  pickers: PickerStatus[];
}

const PerformanceDashboard = ({ pickers }: PerformanceDashboardProps) => {
  // Handle empty pickers array to prevent reduce errors
  const topPerformer = pickers.length > 0 ? pickers.reduce((prev, current) => 
    prev.efficiency > current.efficiency ? prev : current
  ) : null;

  const fastestPicker = pickers.length > 0 ? pickers.reduce((prev, current) => 
    prev.timePerItem < current.timePerItem ? prev : current
  ) : null;

  const mostAccurate = pickers.length > 0 ? pickers.reduce((prev, current) => 
    prev.pickAccuracy > current.pickAccuracy ? prev : current
  ) : null;

  return (
    <div className="space-y-6">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Top Performer</p>
                <p className="text-xl font-bold">{topPerformer?.name || 'No data'}</p>
                <p className="text-sm text-yellow-200">{topPerformer ? `${topPerformer.efficiency}% efficiency` : 'N/A'}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-400 to-purple-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Speed Champion</p>
                <p className="text-xl font-bold">{fastestPicker?.name || 'No data'}</p>
                <p className="text-sm text-blue-200">{fastestPicker ? `${fastestPicker.timePerItem}s per item` : 'N/A'}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Accuracy Star</p>
                <p className="text-xl font-bold">{mostAccurate?.name || 'No data'}</p>
                <p className="text-sm text-green-200">{mostAccurate ? `${mostAccurate.pickAccuracy}% accuracy` : 'N/A'}</p>
              </div>
              <Target className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Detailed Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pickers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No picker data available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Picker</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Orders Completed</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Pick Accuracy</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Time per Item</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Orders/Hour</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Efficiency Score</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {pickers.map((picker) => (
                    <tr key={picker.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50">
                      <td className="py-4 px-4 font-semibold text-gray-900">{picker.name}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                          {picker.completed}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${picker.pickAccuracy}%` }}
                            />
                          </div>
                          <span className="font-semibold text-green-600">{picker.pickAccuracy}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-semibold text-blue-600">{picker.timePerItem}s</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-semibold text-purple-600">{picker.ordersPerHour}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`font-bold text-lg ${
                          picker.efficiency >= 90 ? 'text-green-600' : 
                          picker.efficiency >= 80 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {picker.efficiency}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {picker.efficiency >= 95 && <Award className="h-4 w-4 text-yellow-500" />}
                          {picker.timePerItem <= 40 && <Zap className="h-4 w-4 text-blue-500" />}
                          {picker.pickAccuracy >= 98 && <Target className="h-4 w-4 text-green-500" />}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Today's Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Peak Hours</h4>
              <p className="text-2xl font-bold text-green-600">10-12 AM</p>
              <p className="text-sm text-green-700">Highest productivity</p>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Average Items/Hour</h4>
              <p className="text-2xl font-bold text-blue-600">145</p>
              <p className="text-sm text-blue-700">↑ 8% from yesterday</p>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Quality Score</h4>
              <p className="text-2xl font-bold text-purple-600">97.2%</p>
              <p className="text-sm text-purple-700">Above target</p>
            </div>
            <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Exception Rate</h4>
              <p className="text-2xl font-bold text-orange-600">2.8%</p>
              <p className="text-sm text-orange-700">Within limits</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceDashboard;
