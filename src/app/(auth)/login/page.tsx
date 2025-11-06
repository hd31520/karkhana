// src/app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, LogIn, Mail, Lock, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const verified = searchParams.get('verified')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      console.log('Attempting login for:', email)

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      console.log('SignIn result:', result)

      if (result?.error) {
        setError('Invalid email or password')
      } else if (result?.ok) {
        console.log('Login successful, redirecting to:', callbackUrl)
        router.push(callbackUrl)
        router.refresh() // Refresh the page to update auth state
      } else {
        setError('An unexpected error occurred')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogIn className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          Welcome back
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {verified && (
          <Alert className="mb-4 bg-emerald-50 border-emerald-200">
            <AlertCircle className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-800">
              Email verified successfully! You can now log in.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                className="pl-10"
                required
                disabled={isLoading}
                defaultValue="test@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                required
                disabled={isLoading}
                defaultValue="password123"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" name="remember" disabled={isLoading} />
              <Label htmlFor="remember" className="text-sm text-muted-foreground">
                Remember me
              </Label>
            </div>
            <Link 
              href="/forgot-password" 
              className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link 
              href="/register" 
              className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Debug section - remove in production */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm font-medium text-gray-800 mb-2">Test Credentials:</p>
          <p className="text-xs text-gray-600">Email: test@example.com</p>
          <p className="text-xs text-gray-600">Password: password123</p>
          <p className="text-xs text-gray-600 mt-2">
            <Link href="/register" className="text-emerald-600 hover:underline">
              Or register a new account
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}