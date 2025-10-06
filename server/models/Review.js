import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    maxlength: 100
  },
  comment: {
    type: String,
    maxlength: 1000
  },
  likes: {
    type: Number,
    default: 0
  },
  reported: {
    type: Boolean,
    default: false
  },
  reportReason: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  helpful: [{
    userId: mongoose.Schema.Types.ObjectId,
    helpful: Boolean
  }]
}, {
  timestamps: true
})

// Indexes
reviewSchema.index({ templateId: 1, userId: 1 }, { unique: true })
reviewSchema.index({ templateId: 1, rating: -1 })
reviewSchema.index({ createdAt: -1 })
reviewSchema.index({ rating: 1 })

// Update template rating when review is saved
reviewSchema.post('save', async function() {
  const Template = mongoose.model('Template')
  const template = await Template.findById(this.templateId)
  
  if (template) {
    const reviews = await this.constructor.find({ templateId: this.templateId })
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    
    template.ratings.average = totalRating / reviews.length
    template.ratings.count = reviews.length
    await template.save()
  }
})

// Static method to get template reviews with user data
reviewSchema.statics.getTemplateReviews = function(templateId, page = 1, limit = 10) {
  return this.find({ templateId })
    .populate('userId', 'profile firstName lastName')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
}

export default mongoose.model('Review', reviewSchema)