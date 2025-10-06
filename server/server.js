import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

// Import routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import portfolioRoutes from './routes/portfolios.js'
import templateRoutes from './routes/templates.js'

// Import middleware
import errorHandler from './middleware/errorHandler.js'

// Import socket handlers
import { setupSocket } from './socket/index.js'

dotenv.config()

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173", 
  "http://localhost:5174",
  "http://127.0.0.1:5173"
]

const app = express()
const httpServer = createServer(app)

//  FIXED: Proper CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,  //  Use the array directly
    methods: ["GET", "POST"],
    credentials: true
  }
})

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Security middleware
app.use(helmet())

//  FIXED: Proper CORS middleware
app.use(cors({
  origin: allowedOrigins,  //  Use the array directly
  credentials: true
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Static files
app.use('/uploads', express.static('uploads'))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/portfolios', portfolioRoutes)
app.use('/api/templates', templateRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  })
})

// Error handling middleware
app.use(errorHandler)

// Socket.io setup
setupSocket(io)

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/efolio')
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

// Start server
const PORT = process.env.PORT || 5000

const startServer = async () => {
  await connectDB()
  
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`)
  })
}

startServer()

export { io }