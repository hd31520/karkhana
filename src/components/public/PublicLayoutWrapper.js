'use client';
import { useEffect, useState } from 'react';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

export default function PublicLayoutWrapper({ children, params }) {
  const [subdomain, setSubdomain] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSubdomain() {
      try {
        // Check if params is a Promise or already resolved
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
      } catch (error) {
        console.error('Error getting subdomain:', error);
        setSubdomain('');
      } finally {
        setLoading(false);
      }
    }
    
    getSubdomain();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!subdomain) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Subdomain</h1>
          <p className="text-gray-600">The requested business site could not be found.</p>
          <a 
            href="/" 
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar subdomain={subdomain} />
      <main className="flex-grow">
        {children}
      </main>
      <PublicFooter subdomain={subdomain} />
    </div>
  );
}