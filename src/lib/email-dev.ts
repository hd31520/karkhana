// src/lib/email-dev.ts
/**
 * Development email service that logs emails to console
 * No API keys required - perfect for development
 */

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`
  
  console.log('📧 VERIFICATION EMAIL (Development Mode)')
  console.log('To:', email)
  console.log('Verification URL:', verificationUrl)
  console.log('Token:', token)
  console.log('---')
  
  // In development, we'll simulate successful email sending
  // Users can click the URL directly from the console
  return Promise.resolve()
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
  
  console.log('📧 PASSWORD RESET EMAIL (Development Mode)')
  console.log('To:', email)
  console.log('Reset URL:', resetUrl)
  console.log('Token:', token)
  console.log('---')
  
  return Promise.resolve()
}

export async function sendWelcomeEmail(email: string, name: string) {
  console.log('📧 WELCOME EMAIL (Development Mode)')
  console.log('To:', email)
  console.log('Name:', name)
  console.log('---')
  
  return Promise.resolve()
}