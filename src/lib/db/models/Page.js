import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metaDescription: String,
  keywords: [String]
}, {
  timestamps: true
});

// Compound index for tenant-specific pages
PageSchema.index({ tenantId: 1, slug: 1 }, { unique: true });

export default mongoose.models.Page || mongoose.model('Page', PageSchema);