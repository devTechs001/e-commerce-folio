import mongoose from 'mongoose'

const analyticsSchema = new mongoose.Schema({
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  uniqueVisitors: {
    type: Number,
    default: 0
  },
  visitors: [{
    ip: String,
    userAgent: String,
    country: String,
    city: String,
    referrer: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  events: [{
    type: {
      type: String,
      enum: ['click', 'scroll', 'form_submit', 'download', 'share']
    },
    element: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: mongoose.Schema.Types.Mixed
  }],
  sources: {
    direct: { type: Number, default: 0 },
    organic: { type: Number, default: 0 },
    social: { type: Number, default: 0 },
    referral: { type: Number, default: 0 }
  }
}, {
  timestamps: true
})

// Indexes for efficient querying
analyticsSchema.index({ portfolioId: 1, date: 1 })
analyticsSchema.index({ date: 1 })

// Static method to get analytics for a date range
analyticsSchema.statics.getDateRangeData = async function(portfolioId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        portfolioId: new mongoose.Types.ObjectId(portfolioId),
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: '$views' },
        totalUniqueVisitors: { $sum: '$uniqueVisitors' },
        averageViews: { $avg: '$views' }
      }
    }
  ])
}

export default mongoose.model('Analytics', analyticsSchema)