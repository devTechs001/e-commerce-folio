import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import cors from 'cors'

// Rate limiting configuration
export const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message || 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
  })
}

// Specific rate limiters
export const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts, please try again after 15 minutes.'
)

export const apiLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many API requests, please try again later.'
)

export const strictLimiter = createRateLimit(
  60 * 1000, // 1 minute
  10, // 10 requests
  'Too many requests, please slow down.'
)

// Security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
})

// CORS configuration
export const corsConfig = cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
})

// Body parser configuration
export const bodyParserConfig = {
  json: {
    limit: '10mb',
    verify: (req, res, buf) => {
      req.rawBody = buf
    }
  },
  urlencoded: {
    extended: true,
    limit: '10mb'
  }
}