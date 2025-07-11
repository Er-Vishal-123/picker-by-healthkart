
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  Warehouse, 
  Users, 
  BarChart3, 
  MessageSquare, 
  QrCode, 
  AlertTriangle, 
  CheckSquare, 
  Layers, 
  FileText,
  Shield,
  Clock,
  TrendingUp,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <QrCode className="h-8 w-8 text-blue-600" />,
      title: "Barcode Scanning",
      description: "Quick and accurate item identification with integrated barcode scanning technology"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Role-Based Access",
      description: "Secure access control with picker, supervisor, and admin roles"
    },
    {
      icon: <CheckSquare className="h-8 w-8 text-purple-600" />,
      title: "Pick List Management",
      description: "Streamlined pick list creation, assignment, and tracking"
    },
    {
      icon: <Layers className="h-8 w-8 text-orange-600" />,
      title: "Batch Processing",
      description: "Efficient batch picking for multiple orders simultaneously"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-teal-600" />,
      title: "Real-time Chat",
      description: "Instant communication between pickers and supervisors"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-red-600" />,
      title: "Performance Analytics",
      description: "Comprehensive dashboards and performance metrics tracking"
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-yellow-600" />,
      title: "Predictive Alerts",
      description: "Smart notifications for inventory and operational issues"
    },
    {
      icon: <FileText className="h-8 w-8 text-indigo-600" />,
      title: "Damage Reporting",
      description: "Easy reporting and tracking of damaged inventory items"
    }
  ];

  const stats = [
    { number: "99.9%", label: "Accuracy Rate" },
    { number: "50%", label: "Time Saved" },
    { number: "24/7", label: "System Uptime" },
    { number: "500+", label: "Items/Hour" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Picker by HealthKart
            </h1>
          </div>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Transform Your Warehouse
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Operations Today
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Streamline your warehouse management with our comprehensive solution featuring 
              barcode scanning, real-time analytics, and intelligent workflow automation.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-2"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Warehouses
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to optimize your warehouse operations in one integrated platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-xl w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our Platform?
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Reduce Processing Time</h4>
                    <p className="text-gray-600">Cut order processing time by up to 50% with automated workflows and smart routing.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Enhanced Security</h4>
                    <p className="text-gray-600">Role-based access control ensures secure operations across all user levels.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Boost Productivity</h4>
                    <p className="text-gray-600">Real-time analytics and predictive insights help optimize your operations.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
              <div className="text-center">
                <Warehouse className="h-32 w-32 mx-auto text-blue-600 mb-6" />
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h4>
                <p className="text-gray-600 mb-6">Join hundreds of warehouses already using our platform</p>
                <Button 
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Start Your Journey
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 fill-current text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-2xl font-light mb-8 italic">
              "This platform has revolutionized our warehouse operations. We've seen a 50% improvement 
              in efficiency and our error rates have dropped to nearly zero."
            </blockquote>
            <div>
              <div className="font-semibold text-xl">Sarah Johnson</div>
              <div className="text-blue-200">Warehouse Manager, TechCorp</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">Ready to Transform Your Warehouse?</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Start your free trial today and experience the future of warehouse management.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-8 w-8 text-blue-400" />
                <h5 className="text-xl font-bold">Picker by HealthKart</h5>
              </div>
              <p className="text-gray-400">
                Streamlining warehouse operations with intelligent automation and real-time insights.
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Product</h6>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Demo</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Company</h6>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Legal</h6>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Security</li>
                <li>Cookies</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Picker by HealthKart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
