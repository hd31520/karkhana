// src/app/pricing/page.tsx
import PrisingHero from "@/components/shared/pricing/PrisingHero";
import PrisingCard from "@/components/shared/pricing/PrisingCard";
import PrisingFAQ from "@/components/shared/pricing/PrisingFAQ";
import PrisingCTA from "@/components/shared/pricing/PrisingCTA";
import PublicLayout from "@/components/layout/public-layout";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for individual makers and small shops",
      price: "₹999",
      period: "/month",
      popular: false,
      features: [
        "Up to 50 products",
        "Basic product management",
        "Email support",
        "1 user account",
        "Basic analytics",
        "Standard payment processing",
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
    },
    {
      name: "Professional",
      description: "Ideal for growing manufacturing businesses",
      price: "₹2,499",
      period: "/month",
      popular: true,
      features: [
        "Up to 500 products",
        "Advanced product management",
        "Priority email & chat support",
        "Up to 5 user accounts",
        "Advanced analytics",
        "Multiple payment gateways",
        "Salary management",
        "Role-based access control",
        "Bulk operations",
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
    },
    {
      name: "Enterprise",
      description: "For large manufacturers with complex needs",
      price: "₹4,999",
      period: "/month",
      popular: false,
      features: [
        "Unlimited products",
        "Full feature access",
        "24/7 phone support",
        "Unlimited user accounts",
        "Custom analytics & reports",
        "White-label solutions",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantee",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
    },
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}

        {/* Hero Section */}
        <PrisingHero />

        {/* Pricing Cards */}
        <PrisingCard plans={plans} />

        {/* FAQ Section */}
        <PrisingFAQ></PrisingFAQ>

        {/* CTA Section */}
        <PrisingCTA></PrisingCTA>
      </div>
    </PublicLayout>
  );
}
