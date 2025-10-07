import mongoose from 'mongoose'

const emailCampaignSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sent', 'cancelled'],
    default: 'draft'
  },
  type: {
    type: String,
    enum: ['announcement', 'newsletter', 'testimonial', 'promotion', 'update'],
    default: 'announcement'
  },
  recipients: [{
    type: String,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      },
      message: 'Invalid email address'
    }
  }],
  sentDate: Date,
  scheduledDate: Date,
  openRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  clickRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  template: {
    type: String,
    default: 'default'
  },
  settings: {
    trackOpens: { type: Boolean, default: true },
    trackClicks: { type: Boolean, default: true },
    unsubscribeLink: { type: Boolean, default: true }
  }
}, {
  timestamps: true
})

// Indexes
emailCampaignSchema.index({ userId: 1 })
emailCampaignSchema.index({ status: 1 })
emailCampaignSchema.index({ createdAt: -1 })

export default mongoose.model('EmailCampaign', emailCampaignSchema)
