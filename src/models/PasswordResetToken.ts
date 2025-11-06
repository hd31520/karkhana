// src/models/PasswordResetToken.ts
import mongoose from 'mongoose'

export interface IPasswordResetToken extends mongoose.Document {
  email: string
  token: string
  expires: Date
}

const passwordResetTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expires: {
    type: Date,
    required: true,
  },
})

// Auto-delete expired tokens
passwordResetTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 })

export default mongoose.models.PasswordResetToken || mongoose.model<IPasswordResetToken>('PasswordResetToken', passwordResetTokenSchema)