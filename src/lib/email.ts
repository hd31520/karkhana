import nodemailer from 'nodemailer';

// Create transporter with correct function name
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify transporter connection
transporter.verify(function (error: any, success: any) {
  if (error) {
    console.log('❌ SMTP connection error:', error);
  } else {
    console.log('✅ SMTP server is ready to send messages');
  }
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Hridoy.shop" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Verify your email - Hridoy.shop',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #10b981); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          .token { background: #e5e7eb; padding: 10px; border-radius: 5px; font-family: monospace; word-break: break-all; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Hridoy.shop! 🎉</h1>
          </div>
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Thank you for signing up with Hridoy.shop. To complete your registration and start using your account, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>

            <p>Or copy and paste this link in your browser:</p>
            <div class="token">${verificationUrl}</div>

            <p><strong>Verification Token:</strong></p>
            <div class="token">${token}</div>

            <p>This verification link will expire in 24 hours.</p>
            <p>If you didn't create an account with Hridoy.shop, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Hridoy.shop. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully to:', email);
    console.log('📧 Message ID:', info.messageId);
    return { success: true, info };
  } catch (error: any) {
    console.error('❌ Failed to send verification email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Hridoy.shop" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Reset your password - Hridoy.shop',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626, #ef4444); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          .token { background: #e5e7eb; padding: 10px; border-radius: 5px; font-family: monospace; word-break: break-all; margin: 10px 0; }
          .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password for your Hridoy.shop account. Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>

            <p>Or copy and paste this link in your browser:</p>
            <div class="token">${resetUrl}</div>

            <p><strong>Reset Token:</strong></p>
            <div class="token">${token}</div>

            <div class="warning">
              <p><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>
              <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Hridoy.shop. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully to:', email);
    console.log('📧 Message ID:', info.messageId);
    return { success: true, info };
  } catch (error: any) {
    console.error('❌ Failed to send password reset email:', error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const mailOptions = {
    from: `"Hridoy.shop" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Hridoy.shop! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #10b981); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #059669; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Hridoy.shop! 🎉</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Welcome to Hridoy.shop! We're excited to have you on board. Your account has been successfully verified and you're ready to start using our platform.</p>
            
            <h3>What you can do:</h3>
            <div class="feature">
              <strong>🎨 Showcase Products</strong>
              <p>Create beautiful product pages to showcase your items</p>
            </div>
            <div class="feature">
              <strong>👥 Manage Team</strong>
              <p>Add team members and assign roles</p>
            </div>
            <div class="feature">
              <strong>💰 Track Sales</strong>
              <p>Monitor your product performance and sales</p>
            </div>

            <p>Get started by logging into your account and exploring the features.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Go to Dashboard
              </a>
            </div>

            <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Hridoy.shop. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully to:', email);
    console.log('📧 Message ID:', info.messageId);
    return { success: true, info };
  } catch (error: any) {
    console.error('❌ Failed to send welcome email:', error);
    return { success: false, error };
  }
}