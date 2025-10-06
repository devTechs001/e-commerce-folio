import mongoose from 'mongoose'

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Template name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Template description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: ['minimal', 'creative', 'professional', 'modern', 'bold'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  previewImage: {
    type: String,
    required: true
  },
  livePreviewUrl: String,
  features: [{
    name: String,
    included: Boolean
  }],
  styles: {
    colors: [String],
    fonts: [String],
    layouts: [String]
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  downloads: {
    type: Number,
    default: 0
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String]
}, {
  timestamps: true
})

// Indexes
templateSchema.index({ category: 1 })
templateSchema.index({ price: 1 })
templateSchema.index({ 'ratings.average': -1 })
templateSchema.index({ downloads: -1 })
templateSchema.index({ isActive: 1 })

// Instance method to update rating
templateSchema.methods.updateRating = async function(newRating) {
  const totalRating = this.ratings.average * this.ratings.count + newRating
  this.ratings.count += 1
  this.ratings.average = totalRating / this.ratings.count
  return this.save()
}

// Static method to find popular templates
templateSchema.statics.findPopular = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ 'ratings.average': -1, downloads: -1 })
    .limit(limit)
}

export default mongoose.model('Template', templateSchema)