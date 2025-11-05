'use client';
import Link from 'next/link';
import MainNavbar from '@/components/public/MainNavbar';
import Footer from '@/components/public/Footer';

export default function Homepage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Launch Your Business with{' '}
              <span className="text-blue-600">Karkhana.shop</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get your own professional subdomain, showcase products, and manage your team - all in one platform.
            </p>
            <div className="space-x-4 mb-12">
              <Link 
                href="/register" 
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Start Free Trial
              </Link>
              <Link 
                href="#features" 
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors inline-block"
              >
                Learn More
              </Link>
            </div>
            
            {/* Demo Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
              <div className="text-left">
                <h3 className="text-2xl font-semibold mb-4">Your Business. Your Domain.</h3>
                <p className="text-gray-600 mb-4">
                  Get instant access to: <strong>your-business.karkhana.shop</strong>
                </p>
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <h4 className="font-semibold mb-2">Custom Subdomain</h4>
                    <p className="text-sm text-gray-600">Your unique web address</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <h4 className="font-semibold mb-2">Product Showcase</h4>
                    <p className="text-sm text-gray-600">Display your products beautifully</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <h4 className="font-semibold mb-2">Team Management</h4>
                    <p className="text-sm text-gray-600">Manage employees & payroll</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Everything You Need to Grow
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                title="Custom Subdomain"
                description="Get your-business.karkhana.shop and start selling immediately."
                icon="🌐"
              />
              <FeatureCard
                title="Product Management"
                description="Easy-to-use dashboard to manage your product catalog."
                icon="📦"
              />
              <FeatureCard
                title="Team Management"
                description="Add employees, set roles, and manage payroll efficiently."
                icon="👥"
              />
              <FeatureCard
                title="Attendance Tracking"
                description="Clock-in/out system for your team with detailed reports."
                icon="⏰"
              />
              <FeatureCard
                title="Contact Pages"
                description="Professional contact page with your business information."
                icon="📞"
              />
              <FeatureCard
                title="Mobile Friendly"
                description="Works perfectly on all devices - desktop, tablet, and mobile."
                icon="📱"
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-gray-50 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-center text-gray-600 mb-16">
              Start free for 14 days. No credit card required.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <PricingCard
                name="Basic"
                price="499"
                period="month"
                features={[
                  '1 Custom Subdomain',
                  'Up to 50 Products',
                  'Basic Team Management',
                  'Contact Page',
                  'Email Support'
                ]}
                recommended={false}
              />
              <PricingCard
                name="Professional"
                price="999"
                period="month"
                features={[
                  '1 Custom Subdomain',
                  'Unlimited Products',
                  'Advanced Team Management',
                  'Attendance System',
                  'Priority Support',
                  'Analytics Dashboard'
                ]}
                recommended={true}
              />
              <PricingCard
                name="Enterprise"
                price="1,999"
                period="month"
                features={[
                  'Multiple Subdomains',
                  'Unlimited Products',
                  'Full HR Management',
                  'Custom Features',
                  '24/7 Support',
                  'API Access'
                ]}
                recommended={false}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Launch Your Business?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of businesses already using Karkhana.shop
            </p>
            <Link 
              href="/register" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
            >
              Get Started Today
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PricingCard({ name, price, period, features, recommended }) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
      recommended ? 'ring-2 ring-blue-500 transform scale-105' : ''
    }`}>
      {recommended && (
        <div className="bg-blue-500 text-white text-center py-2 text-sm font-semibold">
          MOST POPULAR
        </div>
      )}
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{name}</h3>
        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900">৳{price}</span>
          <span className="text-gray-600">/{period}</span>
        </div>
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        <Link 
          href="/register" 
          className={`w-full py-3 px-4 rounded-lg font-semibold text-center block ${
            recommended 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          } transition-colors`}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}