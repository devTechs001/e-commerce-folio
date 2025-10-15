import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  method: {
    type: String,
    enum: ['mpesa', 'stripe', 'paypal'],
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  plan: {
    type: String,
    enum: ['free', 'professional', 'enterprise'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  billingPeriod: {
    start: Date,
    end: Date
  },
  completedAt: Date,
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
paymentSchema.index({ transactionId: 1 }, { unique: true })
paymentSchema.index({ status: 1 })
paymentSchema.index({ createdAt: -1 })

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return `$${(this.amount / 100).toFixed(2)}`
})

// Static method to find successful payments
paymentSchema.statics.findSuccessfulPayments = function(userId) {
  return this.find({ userId, status: 'completed' }).sort({ createdAt: -1 })
}

// Instance method to mark as successful
paymentSchema.methods.markAsSuccess = function(receiptUrl) {
  this.status = 'completed'
  this.completedAt = new Date()
  this.receiptUrl = receiptUrl
  return this.save()
}

// Static method to get revenue by period
paymentSchema.statics.getRevenue = async function(userId, startDate, endDate) {
  const result = await this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        status: 'completed',
        completedAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ])
  
  return result[0] || { totalRevenue: 0, count: 0 }
}

export default mongoose.model('Payment', paymentSchema)