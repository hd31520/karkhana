// src/app/(auth)/register/page.tsx (Updated)
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, UserPlus, Mail, Lock, User, AlertCircle, Copy } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [verificationUrl, setVerificationUrl] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')
    setVerificationUrl('')

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      // Register the user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setSuccess(data.message)
      
      // Show verification URL if provided
      if (data.verificationUrl) {
        setVerificationUrl(data.verificationUrl)
      }

      // Don't redirect automatically - let user copy the verification link
      // router.push('/verify-email?email=' + encodeURIComponent(email))

    } catch (error: any) {
      setError(error.message || 'An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl)
      alert('Verification URL copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          Create an account
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your details to get started with Karkhana.shop
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-emerald-50 border-emerald-200">
            <AlertCircle className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {verificationUrl && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  Verification Link (Development Mode):
                </p>
                <p className="text-xs text-blue-600 break-all">
                  {verificationUrl}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="ml-2"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

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
                placeholder="Create a strong password"
                className="pl-10 pr-10"
                required
                disabled={isLoading}
                minLength={6}
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required disabled={isLoading} />
            <Label htmlFor="terms" className="text-sm text-muted-foreground">
              I agree to the{' '}
              <Link href="/terms" className="text-emerald-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-emerald-600 hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}