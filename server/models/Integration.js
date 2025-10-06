import mongoose from 'mongoose'
import crypto from 'crypto'

const integrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['linkedin', 'github', 'wordpress', 'medium', 'behance', 'dribbble']
  },
  credentials: {
    // Encrypted storage of API keys/tokens
    accessToken: String,
    refreshToken: String,
    apiKey: String,
    apiSecret: String,
    username: String
  },
  settings: {
    autoSync: { type: Boolean, default: false },
    syncFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
    publishNewPortfolios: { type: Boolean, default: false }
  },
  status: {
    type: String,
    enum: ['connected', 'disconnected', 'error'],
    default: 'connected'
  },
  lastSync: Date,
  syncHistory: [{
    date: Date,
    status: String,
    itemsSynced: Number,
    error: String
  }],
  connectedAt: {
    type: Date,
    default: Date.now
  },
  disconnectedAt: Date
}, {
  timestamps: true
})

// Indexes
integrationSchema.index({ userId: 1, platform: 1 }, { unique: true })
integrationSchema.index({ status: 1 })

// Encrypt credentials before saving
integrationSchema.pre('save', function(next) {
  if (this.isModified('credentials') && this.credentials) {
    const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY)
    let encrypted = cipher.update(JSON.stringify(this.credentials), 'utf8', 'hex')
    encrypted += cipher.final('hex')
    this.credentials = encrypted
  }
  next()
})

// Decrypt credentials after fetching
integrationSchema.methods.getCredentials = function() {
  if (!this.credentials) return null
  
  try {
    const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY)
    let decrypted = decipher.update(this.credentials, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return JSON.parse(decrypted)
  } catch (error) {
    return null
  }
}

export default mongoose.model('Integration', integrationSchema)