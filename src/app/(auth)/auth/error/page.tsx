// src/app/(auth)/auth/error/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  
  const errorMessages: { [key: string]: string } = {
    'Configuration': 'There is a problem with the server configuration.',
    'AccessDenied': 'You do not have permission to sign in.',
    'Verification': 'The verification token has expired or has already been used.',
    'Default': 'An error occurred during authentication.',
  }

  const errorMessage = errorMessages[error as string] || errorMessages['Default']

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          Authentication Error
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {errorMessage}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Please try again or contact support if the problem persists.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/login">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="outline" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Go home
            </Button>
          </Link>
        </div>

        <div className="text-center pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Error code: {error || 'unknown'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}