import mongoose from 'mongoose'

const freelanceProjectSchema = new mongoose.Schema({
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  client: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled', 'on_hold'],
    default: 'pending'
  },
  category: {
    type: String,
    enum: ['web_development', 'mobile_development', 'design', 'marketing', 'writing', 'other'],
    default: 'web_development'
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  hourlyRate: Number,
  estimatedHours: Number,
  actualHours: Number,
  startDate: Date,
  endDate: Date,
  deadline: Date,
  technologies: [String],
  deliverables: [{
    name: String,
    description: String,
    completed: { type: Boolean, default: false },
    completedAt: Date
  }],
  milestones: [{
    title: String,
    description: String,
    amount: Number,
    dueDate: Date,
    completed: { type: Boolean, default: false },
    completedAt: Date
  }],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  testimonial: String,
  files: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  communications: [{
    message: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
})

// Indexes
freelanceProjectSchema.index({ freelancerId: 1 })
freelanceProjectSchema.index({ clientId: 1 })
freelanceProjectSchema.index({ status: 1 })
freelanceProjectSchema.index({ createdAt: -1 })

export default mongoose.model('FreelanceProject', freelanceProjectSchema)
