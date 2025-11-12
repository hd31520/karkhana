import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const CTASection = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Transform Your Business?
                  </h2>
                  <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
                    Join hundreds of manufacturers already growing with karkhana.shop
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/register">
                      <Button size="lg" variant="secondary" className="px-8">
                        Start Free Trial
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-blue-600">
                        Contact Sales
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>
    );
};

export default CTASection;