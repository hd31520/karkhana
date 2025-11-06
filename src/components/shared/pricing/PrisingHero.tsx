// import { Badge } from '@/components/ui/badge';
import { Badge } from '@/components/ui/badge';
import React from 'react';

const PrisingHero = () => {
    return (
       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
               <div className="text-center">
                 <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm">
                   Simple, Transparent Pricing
                 </Badge>
                 <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                   Pricing That
                   <span className="text-blue-600"> Scales With You</span>
                 </h1>
                 <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                   Choose the perfect plan for your business needs. All plans include core features 
                   with no hidden fees. Start with a 14-day free trial.
                 </p>
               </div>
             </section>
    );
};

export default PrisingHero;