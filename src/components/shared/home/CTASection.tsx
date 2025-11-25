// src/components/shared/home/CTASection.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const CTASection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="rounded-2xl p-8 md:p-12 text-center shadow-lg bg-primary">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
          Ready to Transform Your Business?
        </h2>

        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 text-primary-foreground">
          Join hundreds of manufacturers already growing with karkhana.shop
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="px-8 font-semibold bg-background text-primary hover:bg-background/90"
          >
            <Link href="/register">
              <span>Start Free Trial</span>
            </Link>
          </Button>

          <Button 
            asChild 
            size="lg" 
            variant="outline" 
            className="px-8 font-semibold bg-background text-primary hover:bg-background/90"
          >
            <Link href="/contact">
              <span>Contact Sales</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;