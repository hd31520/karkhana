// src/app/auth/error/page.tsx
import Link from 'next/link'
import { AlertTriangle, ArrowLeft, RefreshCw, LogIn } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type ErrorInfo = {
  title: string
  description: string
  actionHint?: string
}

function getErrorInfo(code: string | undefined | null): ErrorInfo {
  switch (code) {
    case 'CredentialsSignin':
      return {
        title: 'Invalid email or password',
        description: 'The email or password you entered is incorrect.',
        actionHint: 'Please check your credentials and try again.',
      }
    case 'AccessDenied':
      return {
        title: 'Access denied',
        description: 'You do not have permission to access this page.',
        actionHint:
          'Try logging in with a different account or contact an administrator.',
      }
    case 'Verification':
      return {
        title: 'Email not verified',
        description: 'Your email address has not been verified yet.',
        actionHint:
          'Please check your inbox for a verification email and try again.',
      }
    case 'OAuthAccountNotLinked':
      return {
        title: 'Account not linked',
        description:
          'This email is already used with another sign-in method. Please use the original login method.',
        actionHint:
          'Try logging in using the method you originally used for this account.',
      }
    case 'Configuration':
      return {
        title: 'Configuration error',
        description:
          'There was a problem with the authentication configuration on the server.',
        actionHint:
          'Please try again later or contact support if the problem persists.',
      }
    case 'Default':
    default:
      return {
        title: 'Authentication error',
        description: 'Something went wrong while trying to sign you in.',
        actionHint:
          'You can go back and try again, or return to the homepage.',
      }
  }
}

type PageProps = {
  searchParams?: {
    error?: string
    [key: string]: string | string[] | undefined
  }
}

export default function AuthErrorPage({ searchParams }: PageProps) {
  const errorCodeRaw = searchParams?.error
  const errorCode =
    typeof errorCodeRaw === 'string' ? errorCodeRaw : Array.isArray(errorCodeRaw) ? errorCodeRaw[0] : null

  const info = getErrorInfo(errorCode)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-lime-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="w-14 h-14 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-emerald-700">
            {info.title}
          </CardTitle>
          <CardDescription className="text-center">
            {info.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {info.actionHint && (
            <p className="text-sm text-center text-muted-foreground">
              {info.actionHint}
            </p>
          )}

          {errorCode && (
            <p className="text-xs text-center text-gray-400">
              Error code: <span className="font-mono">{errorCode}</span>
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            {/* Go back button – works fine as a normal link on server component */}
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              asChild
            >
              <Link href="/login">
                <ArrowLeft className="w-4 h-4" />
                Go back
              </Link>
            </Button>

            <Button
              asChild
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <Link href="/login">
                <LogIn className="w-4 h-4" />
                Back to login
              </Link>
            </Button>
          </div>

          <div className="mt-2 flex justify-center">
            {/* Simple reload link – no client hook needed */}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-xs text-muted-foreground"
              asChild
            >
              <Link href="/auth/error">
                <RefreshCw className="w-3 h-3" />
                Retry
              </Link>
            </Button>
          </div>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            <span>Still stuck? </span>
            <Link
              href="/contact"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Contact support
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
