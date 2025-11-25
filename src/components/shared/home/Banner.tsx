// src/components/shared/home/Banner.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Banner: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <Badge 
          variant="secondary" 
          className="mb-4 px-4 py-1 text-sm bg-transparent text-muted-foreground border-border"
        >
          🚀 Trusted by 500+ businesses
        </Badge>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
          Your Complete{' '}
          <span className="text-primary">Business</span>{' '}
          Management Platform
        </h1>

        <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed text-muted-foreground">
          karkhana.shop combines e-commerce, workforce management, and analytics
          in one powerful platform. Grow your business with professional tools made for manufacturers.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            asChild
            size="lg"
            className="px-8 font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/register">
              <span className="inline-flex items-center">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Link>
          </Button>

          <Button 
            asChild 
            size="lg" 
            variant="outline" 
            className="px-8 border-border text-foreground hover:bg-accent"
          >
            <Link href="/features">
              <span>View Features</span>
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">500+</div>
            <div className="text-muted-foreground">Businesses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">10K+</div>
            <div className="text-muted-foreground">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">₹5Cr+</div>
            <div className="text-muted-foreground">Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">99.5%</div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;