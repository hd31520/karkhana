'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayoutWrapper({ children, params }) {
  const router = useRouter();
  const [subdomain, setSubdomain] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      try {
        let resolvedSubdomain = '';
        
        if (typeof params.then === 'function') {
          // It's a Promise
          const resolvedParams = await params;
          resolvedSubdomain = resolvedParams.subdomain || '';
        } else {
          // It's already resolved
          resolvedSubdomain = params.subdomain || '';
        }
        
        setSubdomain(resolvedSubdomain);
        
        // For demo, auto-login
        setUser({
          name: 'Demo User',
          role: 'boss',
          email: 'demo@example.com',
          businessName: 'Demo Business'
        });
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
    
    initialize();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push(`/${subdomain}/login`);
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Simple dashboard header for demo */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex justify-between items-center py-4 px-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {user.businessName} Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              {subdomain}.karkhana.shop
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            <button
              onClick={() => router.push(`/${subdomain}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
            >
              View Website
            </button>
          </div>
        </div>
      </header>

      {/* Simple navigation */}
      <nav className="bg-white shadow-sm">
        <div className="px-6 py-3">
          <div className="flex space-x-8">
            <a href={`/${subdomain}/dashboard`} className="text-gray-700 hover:text-blue-600 font-medium">
              Dashboard
            </a>
            <a href={`/${subdomain}/dashboard/products`} className="text-gray-700 hover:text-blue-600 font-medium">
              Products
            </a>
            <a href={`/${subdomain}/dashboard/team`} className="text-gray-700 hover:text-blue-600 font-medium">
              Team
            </a>
            <a href={`/${subdomain}/dashboard/attendance`} className="text-gray-700 hover:text-blue-600 font-medium">
              Attendance
            </a>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}