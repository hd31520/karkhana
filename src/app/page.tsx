// src/app/page.tsx
import Banner from "@/components/shared/home/Banner";
import Features from "@/components/shared/home/Features";
import CTASection from "@/components/shared/home/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Banner />

      {/* Features Grid */}
      <Features />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}