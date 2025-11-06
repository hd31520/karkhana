// src/app/(auth)/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Check your email
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            We sent a password reset link to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Click the link in the email to reset your password. If you don&apos;t see it, check your spam folder.
          </p>
          <div className="space-y-3">
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setIsSubmitted(false)}
            >
              Resend email
            </Button>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to login
              </Button>
            </Link>
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
          Forgot password
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending reset link...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Send reset link
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login">
            <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}