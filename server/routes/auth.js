import express from 'express'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().trim().withMessage('First name is required'),
  body('lastName').notEmpty().trim().withMessage('Last name is required')
], async (req, res) => {
  try {
    console.log('=== REGISTRATION REQUEST RECEIVED ===')
    console.log('Request body:', JSON.stringify(req.body, null, 2))
    console.log('Content-Type:', req.headers['content-type'])
    console.log('Origin:', req.headers['origin'])
    
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(' VALIDATION ERRORS:', errors.array())
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      })
    }

    console.log(' Form validation passed')
    
    const { email, password, firstName, lastName } = req.body

    // Check if user already exists
    console.log(' Checking for existing user with email:', email)
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log(' User already exists:', email)
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists'
      })
    }

    console.log(' No existing user found')

    // Create new user
    console.log('👤 Creating new user...')
    const user = new User({
      email: email.toLowerCase(),
      password,
      profile: {
        firstName: firstName.trim(),
        lastName: lastName.trim()
      }
    })

    console.log(' Saving user to database...')
    await user.save()
    console.log(' User saved successfully, ID:', user._id)

    // Generate token
    const token = generateToken(user._id)
    console.log(' JWT token generated')

    console.log(' Registration completed successfully for:', email)
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          profile: user.profile,
          subscription: user.subscription
        },
        token
      }
    })
  } catch (error) {
    console.error(' REGISTRATION ERROR:')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)
    console.error('Full error:', error)
    
    // Handle specific MongoDB errors
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already exists'
      })
    }
    
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors
      })
    }

    // Handle bcrypt errors
    if (error.message.includes('password') || error.message.includes('bcrypt')) {
      return res.status(400).json({ 
        success: false,
        message: 'Error processing password'
      })
    }

    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      ...(process.env.NODE_ENV === 'development' && { debug: error.message })
    })
  }
})

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      })
    }

    const { email, password } = req.body

    // Find user and include password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      })
    }

    // Update last login and login count
    user.lastLogin = new Date()
    user.loginCount += 1
    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          profile: user.profile,
          subscription: user.subscription,
          preferences: user.preferences
        },
        token
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Server error during login'
    })
  }
})

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      })
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          profile: user.profile,
          subscription: user.subscription,
          preferences: user.preferences,
          socialLinks: user.socialLinks,
          isVerified: user.isVerified
        }
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    })
  }
})

//roles access (clients,subscribers,system-admins(full control of the system),developers(not included to users))

export default router