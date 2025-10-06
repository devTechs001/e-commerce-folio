import mongoose from 'mongoose'

const collaborationSchema = new mongoose.Schema({
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['viewer', 'editor', 'admin'],
    default: 'viewer'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'revoked'],
    default: 'pending'
  },
  permissions: {
    canEdit: { type: Boolean, default: false },
    canInvite: { type: Boolean, default: false },
    canDelete: { type: Boolean, default: false }
  },
  invitedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: Date,
  lastActive: Date
}, {
  timestamps: true
})

// Indexes
collaborationSchema.index({ portfolioId: 1, userId: 1 }, { unique: true })
collaborationSchema.index({ userId: 1 })
collaborationSchema.index({ status: 1 })

// Virtual for isActive
collaborationSchema.virtual('isActive').get(function() {
  return this.status === 'accepted'
})

// Method to check permission
collaborationSchema.methods.hasPermission = function(permission) {
  return this.permissions[permission] === true
}

export default mongoose.model('Collaboration', collaborationSchema)