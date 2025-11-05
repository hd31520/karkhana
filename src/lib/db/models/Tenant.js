import mongoose from 'mongoose';

const TenantSchema = new mongoose.Schema({
  subdomain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Subdomain can only contain letters, numbers and hyphens']
  },
  businessName: {
    type: String,
    required: true
  },
  ownerUid: {
    type: String,
    required: true,
    unique: true
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending'],
    default: 'pending'
  },
  subscriptionPlan: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    default: 'basic'
  },
  contactInfo: {
    email: String,
    phone: String,
    address: String,
    mapEmbed: String
  },
  settings: {
    theme: {
      type: String,
      default: 'light'
    },
    currency: {
      type: String,
      default: 'BDT'
    }
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Remove the manual indexes to avoid duplicates
// The unique: true on subdomain and ownerUid already creates indexes

export default mongoose.models.Tenant || mongoose.model('Tenant', TenantSchema);