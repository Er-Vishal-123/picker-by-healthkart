
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Package, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useCategoryPerformance } from '@/hooks/useCategoryPerformance';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const CategoryDistribution = () => {
  const { categoryPerformance, isLoading } = useCategoryPerformance();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Loading Category Data...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPicks = categoryPerformance.reduce((sum, cat) => sum + cat.total_picks, 0);
  const totalSuccessful = categoryPerformance.reduce((sum, cat) => sum + cat.successful_picks, 0);
  const totalFailed = categoryPerformance.reduce((sum, cat) => sum + cat.failed_picks, 0);
  const overallAccuracy = totalPicks > 0 ? (totalSuccessful / totalPicks) * 100 : 0;

  const pieData = categoryPerformance.map((cat, index) => ({
    name: cat.category,
    value: cat.total_picks,
    color: COLORS[index % COLORS.length]
  }));

  const barData = categoryPerformance.map(cat => ({
    category: cat.category,
    successful: cat.successful_picks,
    failed: cat.failed_picks,
    accuracy: cat.total_picks > 0 ? (cat.successful_picks / cat.total_picks) * 100 : 0
  }));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Categories</p>
                <p className="text-2xl font-bold">{categoryPerformance.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Picks</p>
                <p className="text-2xl font-bold">{totalPicks}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Successful Picks</p>
                <p className="text-2xl font-bold">{totalSuccessful}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Failed Picks</p>
                <p className="text-2xl font-bold">{totalFailed}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Success vs Failure Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="successful" stackId="a" fill="#10B981" name="Successful" />
                  <Bar dataKey="failed" stackId="a" fill="#EF4444" name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Details */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Category Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryPerformance.map((category, index) => {
              const accuracy = category.total_picks > 0 ? (category.successful_picks / category.total_picks) * 100 : 0;
              return (
                <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{category.category}</h4>
                      <p className="text-sm text-gray-600">
                        {category.total_picks} total picks • {category.successful_picks} successful • {category.failed_picks} failed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Accuracy</p>
                      <p className="font-semibold">{accuracy.toFixed(1)}%</p>
                    </div>
                    <div className="w-32">
                      <Progress value={accuracy} className="h-2" />
                    </div>
                    <Badge 
                      className={
                        accuracy >= 95 ? 'bg-green-100 text-green-800' :
                        accuracy >= 85 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {accuracy >= 95 ? 'Excellent' : accuracy >= 85 ? 'Good' : 'Needs Improvement'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryDistribution;
