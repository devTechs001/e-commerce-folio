import mongoose from 'mongoose'

const revenueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  source: {
    type: String,
    enum: ['freelance_project', 'template_sales', 'consulting', 'subscription', 'other'],
    required: true
  },
  description: String,
  client: String,
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FreelanceProject'
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'cancelled'],
    default: 'pending'
  },
  invoiceNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  dueDate: Date,
  paidDate: Date,
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'bank_transfer', 'cash', 'other']
  },
  transactionId: String,
  fees: {
    platform: { type: Number, default: 0 },
    payment: { type: Number, default: 0 },
    tax: { type: Number, default: 0 }
  },
  netAmount: Number,
  metadata: {
    stripePaymentIntentId: String,
    paypalTransactionId: String,
    notes: String
  }
}, {
  timestamps: true
})

// Indexes
revenueSchema.index({ userId: 1, createdAt: -1 })
revenueSchema.index({ status: 1 })
revenueSchema.index({ source: 1 })
revenueSchema.index({ dueDate: 1 })

// Pre-save middleware to calculate net amount
revenueSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('fees')) {
    const totalFees = (this.fees?.platform || 0) + (this.fees?.payment || 0) + (this.fees?.tax || 0)
    this.netAmount = this.amount - totalFees
  }
  next()
})

// Static method to get revenue summary
revenueSchema.statics.getRevenueSummary = async function(userId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: '$status',
        totalAmount: { $sum: '$amount' },
        totalNetAmount: { $sum: '$netAmount' },
        count: { $sum: 1 }
      }
    }
  ])
}

export default mongoose.model('Revenue', revenueSchema)
