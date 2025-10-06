import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'portfolio_published',
      'collaboration_invite',
      'portfolio_view',
      'subscription_update',
      'system_announcement',
      'feature_update'
    ]
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    // Flexible data storage for different notification types
    portfolioId: mongoose.Schema.Types.ObjectId,
    collaboratorId: mongoose.Schema.Types.ObjectId,
    viewCount: Number,
    plan: String
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  expiresAt: Date
}, {
  timestamps: true
})

// Indexes
notificationSchema.index({ userId: 1, isRead: 1 })
notificationSchema.index({ createdAt: -1 })
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Static method to create notification
notificationSchema.statics.createNotification = function(userId, type, title, message, data = {}) {
  return this.create({
    userId,
    type,
    title,
    message,
    data,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  })
}

// Mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true
  this.readAt = new Date()
  return this.save()
}

export default mongoose.model('Notification', notificationSchema)