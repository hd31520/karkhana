'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PublicNavbar({ subdomain }) {
  const [tenant, setTenant] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (subdomain && subdomain.length > 0) {
      fetchTenantInfo();
    }
  }, [subdomain]);

  const fetchTenantInfo = async () => {
    try {
      const response = await fetch(`/api/public/${subdomain}/info`);
      const data = await response.json();
      if (data.success) {
        setTenant(data.tenant);
      }
    } catch (error) {
      console.error('Failed to fetch tenant info:', error);
    }
  };

  // Safe access to first character
  const getInitial = () => {
    if (tenant?.businessName) {
      return tenant.businessName[0]?.toUpperCase() || 'B';
    }
    if (subdomain && subdomain.length > 0) {
      return subdomain[0].toUpperCase();
    }
    return 'B';
  };

  if (!subdomain) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-gray-900 font-bold">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Business Name */}
          <Link href={`/${subdomain}`} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {getInitial()}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {tenant?.businessName || subdomain}
              </h1>
              <p className="text-sm text-gray-600 hidden sm:block">
                {subdomain}.karkhana.shop
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href={`/${subdomain}`} 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href={`/${subdomain}/products`} 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Products
            </Link>
            <Link 
              href={`/${subdomain}/contact`} 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Contact
            </Link>
            <Link 
              href={`/${subdomain}/login`} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href={`/${subdomain}`} 
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href={`/${subdomain}/products`} 
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href={`/${subdomain}/contact`} 
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href={`/${subdomain}/login`} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}