import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: function() {
      return this.role !== 'platform_admin' && this.role !== 'platform_moderator';
    }
  },
  role: {
    type: String,
    enum: ['platform_admin', 'platform_moderator', 'boss', 'manager', 'employee'],
    required: true
  },
  salary: {
    type: Number,
    default: 0
  },
  reportsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  position: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
UserSchema.index({ tenantId: 1, role: 1 });
UserSchema.index({ firebaseUid: 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);