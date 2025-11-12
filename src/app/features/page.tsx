// src/app/features/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ShoppingCart,
  IndianRupee,
  BarChart3,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Settings,
  FileText,
  Bell,
} from "lucide-react";
import PublicLayout from "@/components/layout/public-layout";

export default function Features() {
  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Management",
      description:
        "Manage roles, permissions, and access controls for your entire team",
      features: [
        "Role-based access",
        "User management",
        "Permission controls",
        "Activity tracking",
      ],
      color: "blue",
    },
    {
      icon: <ShoppingCart className="h-8 w-8" />,
      title: "Product Management",
      description:
        "Showcase your products with beautiful storefronts and manage inventory",
      features: [
        "Product catalog",
        "Inventory tracking",
        "Order management",
        "Image gallery",
      ],
      color: "green",
    },
    {
      icon: <IndianRupee className="h-8 w-8" />,
      title: "Salary & Payroll",
      description:
        "Automate salary calculations, track attendance, and manage payroll",
      features: [
        "Salary calculation",
        "Attendance tracking",
        "Payroll processing",
        "Salary slips",
      ],
      color: "yellow",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Analytics & Reports",
      description:
        "Get insights into your business performance with detailed analytics",
      features: [
        "Sales analytics",
        "Revenue reports",
        "Product performance",
        "Custom reports",
      ],
      color: "purple",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Payments",
      description:
        "Accept payments securely with multiple gateway integrations",
      features: [
        "Stripe integration",
        "Razorpay support",
        "Secure transactions",
        "Payment tracking",
      ],
      color: "red",
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "Workflow Automation",
      description:
        "Automate repetitive tasks and streamline your business processes",
      features: [
        "Approval workflows",
        "Bulk operations",
        "Email automation",
        "Task management",
      ],
      color: "indigo",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
    indigo: "bg-indigo-100 text-indigo-600",
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}

      <PublicLayout>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm">
              Powerful Features
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="text-blue-600"> Succeed</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              karkhana.shop provides a comprehensive suite of tools designed
              specifically for manufacturers and shop owners. Manage your entire
              business from one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-gray-200"
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 rounded-lg flex items-center justify-center mb-4 ${
                      colorClasses[feature.color as keyof typeof colorClasses]
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {feature.features.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Advanced Features */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Advanced Capabilities
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Take your business to the next level with our advanced features
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Real-time Analytics
                    </h3>
                    <p className="text-gray-600">
                      Get instant insights into your sales, inventory, and team
                      performance with live dashboards and customizable reports.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Automated Reporting
                    </h3>
                    <p className="text-gray-600">
                      Generate comprehensive reports automatically. Schedule and
                      receive performance reports directly in your inbox.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Smart Notifications
                    </h3>
                    <p className="text-gray-600">
                      Stay informed with intelligent alerts for low stock,
                      pending approvals, payment reminders, and important
                      updates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 border-2 border-blue-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Experience the Difference?
                </h3>
                <p className="text-gray-600 mb-6">
                  Join hundreds of manufacturers who have transformed their
                  business operations with karkhana.shop.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    No credit card required for trial
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Full access to all features
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    dedicated onboarding support
                  </li>
                </ul>
                <div className="space-y-4">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    asChild
                  >
                    <Link href="/register">Start 14-Day Free Trial</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    asChild
                  >
                    <Link href="/contact">Schedule a Demo</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Start Growing Your Business Today
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the manufacturing revolution with tools designed for your
            success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                Get Started Free
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </section>
      </PublicLayout>
    </div>
  );
}
