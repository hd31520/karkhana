// src/lib/tokens.ts
import { randomBytes } from 'crypto'
import VerificationToken from '@/models/VerificationToken'
import PasswordResetToken from '@/models/PasswordResetToken'
import { connectToDatabase } from '@/lib/mongodb'

/**
 * Generate a verification token for email verification
 */
export async function generateVerificationToken(email: string) {
  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  await connectToDatabase()

  // Delete any existing tokens for this email
  await VerificationToken.deleteMany({ identifier: email })

  const verificationToken = await VerificationToken.create({
    identifier: email,
    token,
    expires,
  })

  return verificationToken
}

/**
 * Generate a password reset token
 */
export async function generatePasswordResetToken(email: string) {
  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour

  await connectToDatabase()

  // Delete any existing tokens for this email
  await PasswordResetToken.deleteMany({ email })

  const passwordResetToken = await PasswordResetToken.create({
    email,
    token,
    expires,
  })

  return passwordResetToken
}

/**
 * Validate a verification token
 */
export async function validateVerificationToken(token: string) {
  await connectToDatabase()

  const verificationToken = await VerificationToken.findOne({
    token,
    expires: { $gt: new Date() }
  })

  if (!verificationToken) {
    throw new Error('Invalid or expired verification token')
  }

  return verificationToken
}

/**
 * Validate a password reset token
 */
export async function validatePasswordResetToken(token: string) {
  await connectToDatabase()

  const passwordResetToken = await PasswordResetToken.findOne({
    token,
    expires: { $gt: new Date() }
  })

  if (!passwordResetToken) {
    throw new Error('Invalid or expired password reset token')
  }

  return passwordResetToken
}

/**
 * Delete used tokens
 */
export async function deleteVerificationToken(token: string) {
  await connectToDatabase()
  await VerificationToken.deleteOne({ token })
}

export async function deletePasswordResetToken(token: string) {
  await connectToDatabase()
  await PasswordResetToken.deleteOne({ token })
}