'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function RegistrationSuccessContent() {
  const searchParams = useSearchParams();
  const subdomain = searchParams.get('subdomain');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Registration Successful!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Your account has been created successfully. You can now access your business dashboard.
          </p>

          {subdomain && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                Your business website is ready at:{' '}
                <strong className="font-mono">
                  https://{subdomain}.karkhana.shop
                </strong>
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href={subdomain ? `https://${subdomain}.karkhana.shop/dashboard` : '/login'}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors block font-semibold"
            >
              Go to Dashboard
            </Link>
            
            <Link
              href={subdomain ? `https://${subdomain}.karkhana.shop` : '/'}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors block font-semibold"
            >
              View Your Website
            </Link>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>
              Having trouble?{' '}
              <Link href="/contact" className="text-blue-600 hover:text-blue-500">
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegistrationSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <RegistrationSuccessContent />
    </Suspense>
  );
}