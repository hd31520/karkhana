'use client'

import { useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export default function TestLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleTestLogin = async () => {
    setLoading(true)
    setResult('')
    
    try {
      // Direct Firebase initialization
      const firebaseConfig = {
        apiKey: "AIzaSyD6eBilnLj-JiNoubN1J_QwANgXIEGtnZc",
        authDomain: "karkhana-7c7fa.firebaseapp.com",
        projectId: "karkhana-7c7fa",
        storageBucket: "karkhana-7c7fa.firebasestorage.app",
        messagingSenderId: "382598086711",
        appId: "1:382598086711:web:ac9b695cc40661005dbfb2"
      }

      console.log('Initializing Firebase directly...')
      const app = initializeApp(firebaseConfig, 'test-app')
      const auth = getAuth(app)
      
      console.log('Attempting sign in...')
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      setResult(`✅ SUCCESS: Logged in as ${userCredential.user.email}`)
    } catch (error: any) {
      setResult(`❌ ERROR: ${error.code} - ${error.message}`)
      console.error('Test login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Direct Firebase Test</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="test@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="password123"
          />
        </div>
        
        <button
          onClick={handleTestLogin}
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test Login'}
        </button>
        
        {result && (
          <div className={`p-3 rounded ${
            result.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {result}
          </div>
        )}
      </div>
    </div>
  )
}