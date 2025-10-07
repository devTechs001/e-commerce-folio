import mongoose from 'mongoose'

const proposalSchema = new mongoose.Schema({
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverLetter: {
    type: String,
    required: true
  },
  proposedRate: {
    type: Number,
    required: true
  },
  estimatedDuration: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
})

const freelancingJobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    required: true
  }],
  budgetMin: {
    type: Number,
    required: true
  },
  budgetMax: {
    type: Number,
    required: true
  },
  budgetType: {
    type: String,
    enum: ['fixed', 'hourly'],
    default: 'fixed'
  },
  duration: {
    type: String,
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'intermediate', 'expert'],
    default: 'intermediate'
  },
  category: {
    type: String,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'in_progress', 'completed', 'cancelled'],
    default: 'active'
  },
  proposals: [proposalSchema],
  selectedFreelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [String],
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  deadline: Date,
  isUrgent: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
})

// Indexes for better performance
freelancingJobSchema.index({ title: 'text', description: 'text' })
freelancingJobSchema.index({ skills: 1 })
freelancingJobSchema.index({ category: 1 })
freelancingJobSchema.index({ budgetMin: 1, budgetMax: 1 })
freelancingJobSchema.index({ postedBy: 1 })
freelancingJobSchema.index({ status: 1 })
freelancingJobSchema.index({ createdAt: -1 })

// Virtual for proposal count
freelancingJobSchema.virtual('proposalCount').get(function() {
  return this.proposals.length
})

// Virtual for budget range string
freelancingJobSchema.virtual('budgetRange').get(function() {
  if (this.budgetType === 'hourly') {
    return `$${this.budgetMin}-${this.budgetMax}/hr`
  }
  return `$${this.budgetMin}-${this.budgetMax}`
})

freelancingJobSchema.set('toJSON', { virtuals: true })
freelancingJobSchema.set('toObject', { virtuals: true })

export default mongoose.model('FreelancingJob', freelancingJobSchema)
