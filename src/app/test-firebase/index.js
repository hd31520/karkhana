'use client';
import { useState } from 'react';
import { auth } from '@/lib/firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function TestFirebase() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testFirebase = async () => {
    setLoading(true);
    try {
      // Test Firebase config by trying to create a user
      const testEmail = `test${Date.now()}@test.com`;
      const testPassword = 'password123';
      
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      setResult(`SUCCESS: Firebase user created - ${userCredential.user.uid}`);
      
      // Clean up - delete the test user
      await userCredential.user.delete();
      
    } catch (error) {
      setResult(`ERROR: ${error.code} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Firebase Test</h1>
      <button
        onClick={testFirebase}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Firebase Connection'}
      </button>
      {result && (
        <pre className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </div>
  );
}