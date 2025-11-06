"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Plan {
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  buttonVariant?: "default" | "outline" | "secondary" | "destructive";
  popular?: boolean;
}

interface PricingCardProps {
  plans: Plan[];
}

const PricingCard: React.FC<PricingCardProps> = ({ plans }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${
              plan.popular
                ? "border-2 border-blue-500 shadow-xl scale-105"
                : "border border-gray-200"
            } transition-all duration-300 hover:shadow-lg`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-4 py-1 flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-6">
              <CardTitle className="flex items-center justify-center gap-2">
                {plan.name}
                {plan.popular && <Zap className="h-5 w-5 text-yellow-500" />}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>

              <div className="mt-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-6">
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                variant={plan.buttonVariant || "default"}
                size="lg"
                asChild
              >
                <Link
                  href={plan.name === "Enterprise" ? "/contact" : "/register"}
                >
                  {plan.buttonText}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PricingCard;
