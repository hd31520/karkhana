'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardHeader({ user, subdomain }) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push(`/${subdomain}/login`);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleViewWebsite = () => {
    window.open(`https://${subdomain}.karkhana.shop`, '_blank');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center py-4 px-6">
        {/* Mobile menu button would go here */}
        <div className="lg:hidden">
          {/* Mobile menu button implementation */}
        </div>

        {/* Business Info */}
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900">
            {user.businessName}
          </h1>
          <p className="text-sm text-gray-600">
            {subdomain}.karkhana.shop
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleViewWebsite}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            View Website
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 text-sm focus:outline-none"
            >
              <div className="text-right hidden sm:block">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-gray-500 text-xs capitalize">
                  {user.role}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                <Link
                  href={`/${subdomain}/dashboard/profile`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Your Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}