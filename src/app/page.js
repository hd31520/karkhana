'use client';
import Link from 'next/link';
import MainNavbar from '@/components/public/MainNavbar';
import Footer from '@/components/public/Footer';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />
      <main className="flex-grow">
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
