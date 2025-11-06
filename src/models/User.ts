// src/models/User.ts
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  role: 'admin' | 'moderator' | 'user'
  emailVerified: Date | null
  image?: string
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'moderator', 'user'],
    default: 'user',
  },
  emailVerified: {
    type: Date,
    default: null,
  },
  image: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema)