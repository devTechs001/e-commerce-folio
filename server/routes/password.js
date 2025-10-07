import express from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { body } from 'express-validator'
import User from '../models/User.js'
import { handleValidationErrors } from '../middleware/validation.js'
import { emailService } from '../services/emailService.js'

const router = express.Router()

// Store password reset tokens (in production, use Redis or database)
const resetTokens = new Map()

// @route   POST /api/password/forgot
// @desc    Send password reset email
// @access  Public
router.post('/forgot', [
  body('email').isEmail().withMessage('Please provide a valid email')
], handleValidationErrors, async (req, res) => {
  try {
    const { email } = req.body
    
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ 
        message: 'If an account with that email exists, we have sent a password reset link.' 
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour

    // Store token (in production, store in database)
    resetTokens.set(resetToken, {
      userId: user._id,
      email: user.email,
      expires: resetTokenExpiry
    })

    // Send email
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
    
    try {
      await emailService.sendPasswordResetEmail(user.email, {
        name: `${user.profile.firstName} ${user.profile.lastName}`,
        resetUrl
      })
    } catch (emailError) {
      console.error('Email send error:', emailError)
      // Continue anyway - don't reveal email sending issues
    }

    res.json({ 
      message: 'If an account with that email exists, we have sent a password reset link.' 
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ error: 'Server error processing request' })
  }
})

// @route   POST /api/password/reset
// @desc    Reset password with token
// @access  Public
router.post('/reset', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], handleValidationErrors, async (req, res) => {
  try {
    const { token, password } = req.body

    // Check if token exists and is valid
    const tokenData = resetTokens.get(token)
    if (!tokenData || tokenData.expires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired reset token' })
    }

    // Find user
    const user = await User.findById(tokenData.userId)
    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Update user password
    user.password = hashedPassword
    await user.save()

    // Remove used token
    resetTokens.delete(token)

    // Send confirmation email
    try {
      await emailService.sendPasswordChangeConfirmation(user.email, {
        name: `${user.profile.firstName} ${user.profile.lastName}`
      })
    } catch (emailError) {
      console.error('Confirmation email error:', emailError)
    }

    res.json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ error: 'Server error resetting password' })
  }
})

// @route   GET /api/password/verify-token/:token
// @desc    Verify if reset token is valid
// @access  Public
router.get('/verify-token/:token', (req, res) => {
  try {
    const { token } = req.params
    
    const tokenData = resetTokens.get(token)
    if (!tokenData || tokenData.expires < Date.now()) {
      return res.status(400).json({ valid: false, error: 'Invalid or expired token' })
    }

    res.json({ valid: true })
  } catch (error) {
    console.error('Verify token error:', error)
    res.status(500).json({ valid: false, error: 'Server error' })
  }
})

export default router
