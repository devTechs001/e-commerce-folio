import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export const encrypt = (text) => {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

export const decrypt = (encryptedText) => {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY)
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

export const hashAPIKey = (apiKey) => {
  return crypto.createHash('sha256').update(apiKey).digest('hex')
}

export const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

export const validateCSRFToken = (token, storedToken) => {
  return token && storedToken && token === storedToken
}

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

export const validatePasswordStrength = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  }

  const score = Object.values(requirements).filter(Boolean).length
  const isStrong = score >= 4

  return {
    isStrong,
    score,
    requirements,
    feedback: getPasswordFeedback(requirements)
  }
}

const getPasswordFeedback = (requirements) => {
  const feedback = []
  
  if (!requirements.minLength) feedback.push('Password must be at least 8 characters long')
  if (!requirements.hasUpperCase) feedback.push('Include at least one uppercase letter')
  if (!requirements.hasLowerCase) feedback.push('Include at least one lowercase letter')
  if (!requirements.hasNumbers) feedback.push('Include at least one number')
  if (!requirements.hasSpecialChar) feedback.push('Include at least one special character')
  
  return feedback
}

export const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex')
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const rateLimitKeyGenerator = (req) => {
  return req.user ? req.user.id : req.ip
}

export const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    if (process.env.ALLOWED_ORIGINS?.split(',').includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}