// src/app/page.tsx

import Banner from "@/components/shared/home/Banner";
import Features from "@/components/shared/home/Features";
import CTASection from "@/components/shared/home/CTASection";
import PublicLayout from "@/components/layout/public-layout";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}

      <PublicLayout>
        {/* Hero Section */}
        <Banner />

        {/* Features Grid */}
        <Features />

        {/* CTA Section */}
        <CTASection></CTASection>
      </PublicLayout>

      {/* Footer */}
    </div>
  );
}
