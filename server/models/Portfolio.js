import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
    type:{
        type: String,
        enum: ['hero','about','experience','education','projects','skills','contact'],
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    order: {
        type: Number,
        required: true
    },
    isVisible: {
        type: Boolean,
        default: true
    }
});

const portfolioSchema = new mongoose.Schema({
   userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
   },
   templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
   },
   title: {
    type: String,
    required: [true, 'Portfolio title is required'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
    trim: true
   },
   slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    lowercase: true
   },
   sections: [sectionSchema],
   styles: {
    theme: {
        type: String,
        enum: ['modern','classic','creative','minimal'],
        default: 'modern'
    },
    colors: {
        primary: { type: String, default: '#0ea5e9' },
        secondary: { type: String, default: '#64748b' },
        background: { type: String, default: '#ffffff' },
        text: { type: String, default: '#1e293b' }
      },
      fonts: {
        heading: { type: String, default: 'Inter' },
        body: { type: String, default: 'Inter' }
      },
      spacing: {
        type: String,
        enum: ['compact', 'comfortable', 'spacious'],
        default: 'comfortable'
      }
   },
   settings: {
    isPublished: {
      type: Boolean,
      default: false
    },
    customDomain: String,
    seo: {
      title: String,
      description: String,
      keywords: [String]
    },
    socialSharing: {
      enabled: { type: Boolean, default: true },
      image: String
    }
   },
   analytics: {
    views: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    lastViewed: Date
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  versions: [{
    version: Number,
    data: mongoose.Schema.Types.Mixed,
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  lastEdited: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
portfolioSchema.index({ userId: 1 })
portfolioSchema.index({ slug: 1 }, { unique: true })
portfolioSchema.index({ 'settings.isPublished': 1 })
portfolioSchema.index({ createdAt: -1 })

// Pre-save middleware to generate slug and update lastEdited
portfolioSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  if (this.isModified()) {
    this.lastEdited = new Date()
  }
  next()
})

// Static method to find published portfolios
portfolioSchema.statics.findPublished = function() {
  return this.find({ 'settings.isPublished': true })
    .populate('userId', 'profile email')
    .select('-collaborators -versions')
}

// Instance method to add collaborator
portfolioSchema.methods.addCollaborator = function(userId, role = 'viewer') {
  const existingCollaborator = this.collaborators.find(
    collab => collab.user.toString() === userId.toString()
  )
  
  if (!existingCollaborator) {
    this.collaborators.push({ user: userId, role })
  }
  
  return this.save()
}

// Instance method to increment views
portfolioSchema.methods.incrementViews = function() {
  this.analytics.views += 1
  this.analytics.lastViewed = new Date()
  return this.save()
}

export default mongoose.model('Portfolio', portfolioSchema)

