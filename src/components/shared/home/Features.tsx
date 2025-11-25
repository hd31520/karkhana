// src/components/shared/home/Features.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, Shield, Users, Zap } from 'lucide-react';
import React from 'react';

const Features: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Everything You Need to Grow
        </h2>
        <p className="text-xl max-w-2xl mx-auto text-muted-foreground">
          Powerful features designed specifically for manufacturers and shop owners
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Team Management */}
        <Card className="border-2 transition-all duration-300 hover:shadow-lg border-border">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-accent">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-foreground">Team Management</CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage roles, permissions, and salaries with our comprehensive workforce tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {['Role-based access control', 'Salary tracking & payroll', 'Attendance management'].map((t) => (
                <li key={t} className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Product Management */}
        <Card className="border-2 transition-all duration-300 hover:shadow-lg border-border">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-accent">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-foreground">Product Management</CardTitle>
            <CardDescription className="text-muted-foreground">
              Showcase your products with beautiful storefronts and manage inventory efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {['Professional product pages', 'Inventory tracking', 'Order management'].map((t) => (
                <li key={t} className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Secure Payments */}
        <Card className="border-2 transition-all duration-300 hover:shadow-lg border-border">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-accent">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-foreground">Secure Payments</CardTitle>
            <CardDescription className="text-muted-foreground">
              Accept payments securely with multiple gateways and real-time tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {['Stripe & Razorpay integration', 'Real-time transaction tracking', 'Secure payment processing'].map((t) => (
                <li key={t} className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Features;