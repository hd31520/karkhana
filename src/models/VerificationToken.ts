// src/models/VerificationToken.ts
import mongoose from 'mongoose'

export interface IVerificationToken extends mongoose.Document {
  identifier: string
  token: string
  expires: Date
}

const verificationTokenSchema = new mongoose.Schema({
  identifier: {
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
verificationTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 })

export default mongoose.models.VerificationToken || mongoose.model<IVerificationToken>('VerificationToken', verificationTokenSchema)