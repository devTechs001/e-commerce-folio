import mongoose from 'mongoose'

const emailSubscriberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      },
      message: 'Invalid email address'
    }
  },
  name: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced'],
    default: 'active'
  },
  subscribed: {
    type: Date,
    default: Date.now
  },
  unsubscribed: Date,
  tags: [String],
  source: {
    type: String,
    enum: ['manual', 'website', 'import', 'api'],
    default: 'manual'
  },
  preferences: {
    newsletters: { type: Boolean, default: true },
    promotions: { type: Boolean, default: true },
    updates: { type: Boolean, default: true }
  },
  metadata: {
    location: String,
    referrer: String,
    userAgent: String
  }
}, {
  timestamps: true
})

// Compound index for user and email uniqueness
emailSubscriberSchema.index({ userId: 1, email: 1 }, { unique: true })
emailSubscriberSchema.index({ status: 1 })
emailSubscriberSchema.index({ subscribed: -1 })

export default mongoose.model('EmailSubscriber', emailSubscriberSchema)
