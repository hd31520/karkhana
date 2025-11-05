'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, auto-login as admin
    setUser({
      name: 'Admin User',
      role: 'platform_admin',
      email: 'admin@karkhana.shop'
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Simple header for demo */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex justify-between items-center py-4 px-6">
          <h1 className="text-xl font-bold text-gray-900">Karkhana Admin</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Back to Site
            </button>
          </div>
        </div>
      </header>

      {/* Simple navigation */}
      <nav className="bg-white shadow-sm">
        <div className="px-6 py-3">
          <div className="flex space-x-8">
            <a href="/admin" className="text-gray-700 hover:text-blue-600 font-medium">
              Dashboard
            </a>
            <a href="/admin/tenants" className="text-gray-700 hover:text-blue-600 font-medium">
              Tenants
            </a>
            <a href="/admin/moderators" className="text-gray-700 hover:text-blue-600 font-medium">
              Moderators
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