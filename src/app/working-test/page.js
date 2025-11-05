'use client';
import { useState } from 'react';

export default function WorkingTest() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState(`test${Date.now()}@example.com`);
  const [testSubdomain, setTestSubdomain] = useState(`test-${Date.now()}`);

  const testRegistration = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: testEmail,
          password: 'password123',
          businessName: 'Test Business',
          subdomain: testSubdomain
        }),
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testDemoSite = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/public/demo/products');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testSubdomainCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/check-subdomain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subdomain: testSubdomain
        }),
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testBasicAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testFirebaseConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-firebase');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetTestData = () => {
    setTestEmail(`test${Date.now()}@example.com`);
    setTestSubdomain(`test-${Date.now()}`);
    setResult('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Karkhana.shop - Complete Test Suite</h1>
      
      {/* Test Data Inputs */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Data</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Email
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Subdomain
            </label>
            <input
              type="text"
              value={testSubdomain}
              onChange={(e) => setTestSubdomain(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={resetTestData}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Reset Test Data
        </button>
      </div>

      {/* Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <button
          onClick={testBasicAPI}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Test Basic API
        </button>
        
        <button
          onClick={testSubdomainCheck}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          Test Subdomain Check
        </button>
        
        <button
          onClick={testRegistration}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          Test Registration
        </button>
        
        <button
          onClick={testDemoSite}
          disabled={loading}
          className="bg-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          Test Demo Site API
        </button>
        
        <button
          onClick={testFirebaseConnection}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          Test Firebase
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-blue-600">Testing...</span>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap border text-sm overflow-auto max-h-96">
            {result}
          </pre>
        </div>
      )}

      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Core Features</h3>
          <div className="space-y-2">
            <a href="/demo" className="block text-blue-600 hover:underline">
              ✅ Demo Tenant Site
            </a>
            <a href="/register" className="block text-blue-600 hover:underline">
              ✅ User Registration
            </a>
            <a href="/" className="block text-blue-600 hover:underline">
              ✅ Main Homepage
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Admin & Dashboard</h3>
          <div className="space-y-2">
            <a href="/admin/login" className="block text-blue-600 hover:underline">
              🔐 Admin Login
            </a>
            <a href="/demo/login" className="block text-blue-600 hover:underline">
              🔐 Tenant Login
            </a>
            <a href="/demo/dashboard" className="block text-blue-600 hover:underline">
              📊 Demo Dashboard
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Development Tools</h3>
          <div className="space-y-2">
            <a href="/test-firebase" className="block text-blue-600 hover:underline">
              🔥 Firebase Test
            </a>
            <a href="/test" className="block text-blue-600 hover:underline">
              🛠️ API Test
            </a>
            <button 
              onClick={() => window.location.reload()}
              className="block text-blue-600 hover:underline"
            >
              🔄 Refresh Page
            </button>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">System Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-100 rounded-lg">
            <div className="text-2xl">✅</div>
            <div className="font-medium">Memory DB</div>
            <div className="text-sm text-gray-600">Operational</div>
          </div>
          <div className="text-center p-4 bg-green-100 rounded-lg">
            <div className="text-2xl">✅</div>
            <div className="font-medium">API Routes</div>
            <div className="text-sm text-gray-600">Working</div>
          </div>
          <div className="text-center p-4 bg-yellow-100 rounded-lg">
            <div className="text-2xl">⚠️</div>
            <div className="font-medium">Firebase</div>
            <div className="text-sm text-gray-600">Demo Mode</div>
          </div>
          <div className="text-center p-4 bg-yellow-100 rounded-lg">
            <div className="text-2xl">⚠️</div>
            <div className="font-medium">MongoDB</div>
            <div className="text-sm text-gray-600">Not Connected</div>
          </div>
        </div>
      </div>
    </div>
  );
}