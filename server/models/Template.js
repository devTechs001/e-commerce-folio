import mongoose from 'mongoose'

const sectionSchema = new mongoose.Schema({
  id: String,
  type: {
    type: String,
    enum: ['hero', 'about', 'projects', 'skills', 'contact', 'testimonials', 'services'],
    required: true
  },
  title: String,
  content: mongoose.Schema.Types.Mixed,
  styles: {
    backgroundColor: String,
    textColor: String,
    padding: String,
    textAlign: String,
    backgroundImage: String,
    overlay: Number,
    layout: String
  }
})

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
    enum: ['minimal', 'creative', 'professional', 'modern', 'bold', 'portfolio'],
    required: true
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  previewImage: String,
  thumbnail: String,
  livePreviewUrl: String,
  
  // Template structure
  sections: [sectionSchema],
  globalStyles: {
    primaryColor: { type: String, default: '#3B82F6' },
    secondaryColor: { type: String, default: '#1F2937' },
    fontFamily: { type: String, default: 'Inter' },
    fontSize: { type: String, default: '16px' },
    lineHeight: { type: String, default: '1.6' },
    borderRadius: { type: String, default: '8px' },
    spacing: { type: String, default: '1rem' }
  },
  
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
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  author: String, // Display name
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String],
  
  // Version control
  version: {
    type: String,
    default: '1.0.0'
  },
  changelog: [{
    version: String,
    changes: [String],
    date: { type: Date, default: Date.now }
  }],
  
  // Usage stats
  usageStats: {
    totalUses: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    lastUsed: Date
  }
}, {
  timestamps: true
})
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