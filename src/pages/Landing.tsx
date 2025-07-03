
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Warehouse, 
  Users, 
  BarChart3, 
  Shield, 
  Zap, 
  Clock, 
  CheckCircle, 
  MessageSquare,
  Camera,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Warehouse,
      title: "Smart Warehouse Management",
      description: "Comprehensive inventory tracking with real-time location mapping and automated stock updates."
    },
    {
      icon: Camera,
      title: "Barcode Scanning",
      description: "Advanced barcode scanning for quick item identification and pick list processing."
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Secure authentication with picker, supervisor, and admin role management."
    },
    {
      icon: MessageSquare,
      title: "Real-Time Communication",
      description: "Integrated chat system for seamless team coordination and instant messaging."
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Detailed performance metrics and efficiency tracking for data-driven decisions."
    },
    {
      icon: Activity,
      title: "Predictive Alerts",
      description: "AI-powered alerts for inventory shortages and performance optimization."
    },
    {
      icon: CheckCircle,
      title: "Pick List Management",
      description: "Dynamic pick list assignment with priority-based task distribution."
    },
    {
      icon: Clock,
      title: "Batch Processing",
      description: "Efficient batch picking capabilities to maximize warehouse productivity."
    },
    {
      icon: Shield,
      title: "Damage Reporting",
      description: "Integrated damage reporting system with photo documentation and tracking."
    }
  ];

  const benefits = [
    "Increase picking accuracy by 95%",
    "Reduce processing time by 60%",
    "Improve inventory visibility",
    "Streamline team communication",
    "Real-time performance tracking",
    "Automated workflow optimization"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Warehouse className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">PickPal</span>
          </div>
          <Button onClick={() => navigate('/')} variant="outline">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            Next-Generation Warehouse Management
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Warehouse Operations with{" "}
            <span className="text-blue-600">PickPal</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Streamline your warehouse workflow with intelligent pick list management, 
            real-time performance tracking, and seamless team collaboration. 
            Experience the future of warehouse efficiency today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-8 py-3 text-lg"
              onClick={() => navigate('/')}
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-3 text-lg"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Warehouses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to optimize your warehouse operations in one comprehensive platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Measurable Results for Your Business
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join hundreds of warehouses that have transformed their operations with PickPal
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white/10 rounded-lg p-4">
                <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Revolutionize Your Warehouse?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Start your free trial today and experience the power of intelligent warehouse management. 
              No credit card required, setup takes less than 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="px-8 py-3 text-lg"
                onClick={() => navigate('/')}
              >
                Get Started Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-3 text-lg"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Warehouse className="h-6 w-6" />
              <span className="text-xl font-bold">PickPal</span>
            </div>
            <div className="text-gray-400">
              © 2024 PickPal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
