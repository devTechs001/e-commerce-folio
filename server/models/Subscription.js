import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    required: true,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'canceled', 'past_due', 'unpaid', 'incomplete'],
    default: 'active'
  },
  stripeSubscriptionId: String,
  stripeCustomerId: String,
  currentPeriodStart: {
    type: Date,
    required: true,
    default: Date.now
  },
  currentPeriodEnd: {
    type: Date,
    required: true
  },
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false
  },
  canceledAt: Date,
  trialEnd: Date,
  price: {
    type: Number,
    default: 0
  },
  features: {
    portfolios: { type: Number, default: 1 },
    collaborators: { type: Number, default: 0 },
    customDomain: { type: Boolean, default: false },
    advancedAnalytics: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false }
  }
}, {
  timestamps: true
})

// Indexes
subscriptionSchema.index({ userId: 1 }, { unique: true })
subscriptionSchema.index({ status: 1 })
subscriptionSchema.index({ currentPeriodEnd: 1 })

// Virtual for isActive
subscriptionSchema.virtual('isActive').get(function() {
  return this.status === 'active' && this.currentPeriodEnd > new Date()
})

// Virtual for daysUntilRenewal
subscriptionSchema.virtual('daysUntilRenewal').get(function() {
  const now = new Date()
  const diffTime = this.currentPeriodEnd - now
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Update features based on plan
subscriptionSchema.pre('save', function(next) {
  const planFeatures = {
    free: {
      portfolios: 1,
      collaborators: 0,
      customDomain: false,
      advancedAnalytics: false,
      prioritySupport: false
    },
    pro: {
      portfolios: 5,
      collaborators: 3,
      customDomain: true,
      advancedAnalytics: true,
      prioritySupport: true
    },
    enterprise: {
      portfolios: -1, // unlimited
      collaborators: -1, // unlimited
      customDomain: true,
      advancedAnalytics: true,
      prioritySupport: true
    }
  }

  this.features = planFeatures[this.plan] || planFeatures.free
  
  // Set price based on plan
  const planPrices = {
    free: 0,
    pro: 1999, // $19.99 in cents
    enterprise: 4999 // $49.99 in cents
  }
  
  this.price = planPrices[this.plan] || 0

  next()
})

export default mongoose.model('Subscription', subscriptionSchema)