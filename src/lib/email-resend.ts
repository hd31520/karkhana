// src/lib/email-resend.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Send verification email using Resend
 */
export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Karkhana.shop <onboarding@resend.dev>',
      to: email,
      subject: 'Verify Your Email - Karkhana.shop',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #10B981); padding: 30px; text-align: center; color: white; }
            .content { padding: 30px; background: #f9fafb; }
            .button { display: inline-block; padding: 12px 30px; background: #059669; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your Email</h1>
            </div>
            <div class="content">
              <h2>Welcome to Karkhana.shop!</h2>
              <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
              <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </p>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #059669;">${verificationUrl}</p>
              <p>This verification link will expire in 24 hours.</p>
            </div>
            <div class="footer">
              <p>If you didn't create an account with Karkhana.shop, please ignore this email.</p>
              <p>&copy; 2025 Karkhana.shop. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error('Failed to send verification email')
    }

    console.log('✅ Verification email sent via Resend to:', email)
    console.log('📧 Verification URL:', verificationUrl)
    return data
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw new Error('Failed to send verification email')
  }
}

/**
 * Send password reset email using Resend
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Karkhana.shop <onboarding@resend.dev>',
      to: email,
      subject: 'Reset Your Password - Karkhana.shop',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626, #ef4444); padding: 30px; text-align: center; color: white; }
            .content { padding: 30px; background: #f9fafb; }
            .button { display: inline-block; padding: 12px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <div class="warning">
                <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email and ensure your account is secure.
              </div>
              <p>You requested a password reset for your Karkhana.shop account.</p>
              <p>Click the button below to reset your password:</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #dc2626;">${resetUrl}</p>
              <p>This password reset link will expire in 1 hour.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Karkhana.shop. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error('Failed to send password reset email')
    }

    console.log('✅ Password reset email sent via Resend to:', email)
    console.log('📧 Reset URL:', resetUrl)
    return data
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw new Error('Failed to send password reset email')
  }
}

/**
 * Send welcome email using Resend
 */
export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Karkhana.shop <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to Karkhana.shop!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #10B981); padding: 30px; text-align: center; color: white; }
            .content { padding: 30px; background: #f9fafb; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #059669; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Karkhana.shop!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Your email has been successfully verified and your account is now active!</p>
              
              <h3>Get Started</h3>
              <div class="feature">
                <strong>🎯 Manage Your Products</strong>
                <p>Showcase your products with beautiful storefronts</p>
              </div>
              <div class="feature">
                <strong>👥 Team Management</strong>
                <p>Add team members and assign roles</p>
              </div>
              <div class="feature">
                <strong>💰 Salary Tracking</strong>
                <p>Track employee salaries and payments</p>
              </div>
              
              <p style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; padding: 12px 30px; background: #059669; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Go to Dashboard
                </a>
              </p>
            </div>
            <div class="footer">
              <p>Need help? Contact our support team at support@karkhana.shop</p>
              <p>&copy; 2025 Karkhana.shop. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    })

    if (error) {
      console.error('Resend error:', error)
      return
    }

    console.log('✅ Welcome email sent via Resend to:', email)
    return data
  } catch (error) {
    console.error('Error sending welcome email:', error)
  }
}