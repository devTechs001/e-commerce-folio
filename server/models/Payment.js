import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stripePaymentIntentId: {
    type: String,
    required: true,
    unique: true
  },
  stripeCustomerId: String,
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'usd'
  },
  plan: {
    type: String,
    required: true,
    enum: ['pro', 'enterprise']
  },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'canceled'],
    default: 'pending'
  },
  billingPeriod: {
    start: Date,
    end: Date
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'paypal', 'bank_transfer'],
    default: 'card'
  },
  receiptUrl: String,
  error: {
    code: String,
    message: String
  },
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
})

// Indexes
paymentSchema.index({ userId: 1 })
paymentSchema.index({ stripePaymentIntentId: 1 }, { unique: true })
paymentSchema.index({ status: 1 })
paymentSchema.index({ createdAt: -1 })

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return `$${(this.amount / 100).toFixed(2)}`
})

// Static method to find successful payments
paymentSchema.statics.findSuccessfulPayments = function(userId) {
  return this.find({ userId, status: 'succeeded' }).sort({ createdAt: -1 })
}

// Instance method to mark as successful
paymentSchema.methods.markAsSuccess = function(receiptUrl) {
  this.status = 'succeeded'
  this.receiptUrl = receiptUrl
  return this.save()
}

export default mongoose.model('Payment', paymentSchema)