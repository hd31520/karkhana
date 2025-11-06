// src/app/(auth)/verify-email/page.tsx (Updated)
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Mail, CheckCircle, RotateCcw, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function VerifyEmailPage() {
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your email'
  const token = searchParams.get('token')

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  // Auto-verify if token is present in URL
  useEffect(() => {
    if (token) {
      handleVerification(token)
    }
  }, [token])

  const handleVerification = async (verificationToken?: string) => {
    setIsLoading(true)
    setError('')

    const tokenToVerify = verificationToken || (document.getElementById('token') as HTMLInputElement)?.value

    if (!tokenToVerify) {
      setError('Please enter verification code')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: tokenToVerify }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      setIsVerified(true)
      
      // Redirect to login after success
      setTimeout(() => {
        router.push('/login?verified=true')
      }, 2000)

    } catch (error: any) {
      setError(error.message || 'An error occurred during verification')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setCountdown(30)
    setCanResend(false)
    setError('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification email')
      }

      // Success message can be shown here
    } catch (error: any) {
      setError(error.message || 'Failed to resend verification email')
    }
  }

  if (isVerified) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Email verified!
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your account has been successfully verified
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Redirecting you to login page...
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          Verify your email
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          We sent a verification code to {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Verification Code
            </label>
            <Input
              id="token"
              placeholder="Enter verification code"
              className="text-center text-lg font-mono"
              maxLength={32}
              disabled={isLoading}
            />
          </div>

          <Button 
            onClick={() => handleVerification()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Verify Email
              </>
            )}
          </Button>

          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the code?
            </p>
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={!canResend || isLoading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {canResend ? 'Resend code' : `Resend in ${countdown}s`}
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-border">
            <Link href="/login">
              <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700">
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}