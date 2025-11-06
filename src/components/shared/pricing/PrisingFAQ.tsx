import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const PrisingFAQ = () => {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-xl text-gray-600">
          Everything you need to know about our pricing
        </p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Can I change plans later?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes
              take effect immediately, and we&apos;ll prorate the billing.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Is there a free trial?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              All paid plans come with a 14-day free trial. No credit card
              required to start. You can explore all features during your trial
              period.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What payment methods do you accept?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We accept all major credit cards, debit cards, UPI, net banking,
              and support automatic bank transfers for enterprise customers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Do you offer discounts for annual billing?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Yes! Save up to 20% when you choose annual billing. Contact our
              sales team for custom enterprise pricing.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PrisingFAQ;
