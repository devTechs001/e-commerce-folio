import mongoose from 'mongoose'

const clientReviewSchema = new mongoose.Schema({
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FreelanceProject'
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  clientAvatar: String,
  clientEmail: {
    type: String,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      },
      message: 'Invalid email address'
    }
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    maxlength: 2000
  },
  projectTitle: {
    type: String,
    required: true,
    trim: true
  },
  projectCategory: {
    type: String,
    enum: ['web_development', 'mobile_development', 'design', 'marketing', 'writing', 'other']
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationMethod: {
    type: String,
    enum: ['email', 'linkedin', 'manual', 'none'],
    default: 'none'
  },
  helpful: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isHelpful: Boolean,
    timestamp: { type: Date, default: Date.now }
  }],
  reported: {
    type: Boolean,
    default: false
  },
  reportReason: String,
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Indexes
clientReviewSchema.index({ freelancerId: 1, rating: -1 })
clientReviewSchema.index({ createdAt: -1 })
clientReviewSchema.index({ isPublic: 1, isVerified: 1 })
clientReviewSchema.index({ featured: 1 })

// Static method to get freelancer reviews
clientReviewSchema.statics.getFreelancerReviews = function(freelancerId, options = {}) {
  const {
    page = 1,
    limit = 10,
    publicOnly = true,
    verifiedOnly = false,
    featuredOnly = false
  } = options

  const query = { freelancerId }
  
  if (publicOnly) query.isPublic = true
  if (verifiedOnly) query.isVerified = true
  if (featuredOnly) query.featured = true

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
}

// Static method to calculate average rating
clientReviewSchema.statics.getAverageRating = async function(freelancerId) {
  const result = await this.aggregate([
    { $match: { freelancerId: new mongoose.Types.ObjectId(freelancerId), isPublic: true } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ])

  if (result.length === 0) {
    return { averageRating: 0, totalReviews: 0, ratingDistribution: [] }
  }

  const data = result[0]
  const distribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: data.ratingDistribution.filter(r => r === rating).length
  }))

  return {
    averageRating: Math.round(data.averageRating * 10) / 10,
    totalReviews: data.totalReviews,
    ratingDistribution: distribution
  }
}

export default mongoose.model('ClientReview', clientReviewSchema)
