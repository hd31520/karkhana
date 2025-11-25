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
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  };

  return (
    <main className="min-h-screen  dark:bg-black">
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Hero Section */}
        <section className="py-20">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm bg-muted text-muted-foreground">
              Powerful Features
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Everything You Need to
              <span className="text-primary"> Succeed</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              karkhana.shop provides a comprehensive suite of tools designed
              specifically for manufacturers and shop owners. Manage your entire
              business from one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 px-8"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="px-8 border-border text-foreground hover:bg-accent">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="pb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 border-border bg-card"
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 rounded-lg flex items-center justify-center mb-4 ${
                      colorClasses[feature.color as keyof typeof colorClasses]
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {feature.features.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-center text-sm text-muted-foreground"
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
        <section className="bg-muted py-20 rounded-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Advanced Capabilities
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Take your business to the next level with our advanced features
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Real-time Analytics
                    </h3>
                    <p className="text-muted-foreground">
                      Get instant insights into your sales, inventory, and team
                      performance with live dashboards and customizable reports.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Automated Reporting
                    </h3>
                    <p className="text-muted-foreground">
                      Generate comprehensive reports automatically. Schedule and
                      receive performance reports directly in your inbox.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Smart Notifications
                    </h3>
                    <p className="text-muted-foreground">
                      Stay informed with intelligent alerts for low stock,
                      pending approvals, payment reminders, and important
                      updates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-8 border-2 border-primary/20">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Experience the Difference?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Join hundreds of manufacturers who have transformed their
                  business operations with karkhana.shop.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    No credit card required for trial
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Full access to all features
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Dedicated onboarding support
                  </li>
                </ul>
                <div className="space-y-4">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    asChild
                  >
                    <Link href="/register">Start 14-Day Free Trial</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-accent"
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
        <section className="py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Start Growing Your Business Today
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the manufacturing revolution with tools designed for your
            success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
                Get Started Free
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8 border-border text-foreground hover:bg-accent">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}