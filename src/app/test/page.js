'use client';
import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testApi = async (endpoint) => {
    setLoading(true);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={() => testApi('/api/test')}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Basic API
        </button>
        
        <button
          onClick={() => testApi('/api/public/demo/products')}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 ml-4"
        >
          Test Demo Products
        </button>
        
        <button
          onClick={() => testApi('/api/public/demo/info')}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50 ml-4"
        >
          Test Demo Info
        </button>
      </div>

      {loading && <div className="text-blue-600">Loading...</div>}
      
      {result && (
        <pre className="bg-gray-100 p-4 rounded mt-4 whitespace-pre-wrap border">
          {result}
        </pre>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Links:</h2>
        <div className="space-y-2">
          <a href="/demo" className="block text-blue-600 hover:underline">
            Visit Demo Site: /demo
          </a>
          <a href="/register" className="block text-blue-600 hover:underline">
            Test Registration: /register
          </a>
          <a href="/test-firebase" className="block text-blue-600 hover:underline">
            Test Firebase: /test-firebase
          </a>
        </div>
      </div>
    </div>
  );
}