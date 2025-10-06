import User from '../models/User.js'
import { generateToken } from '../utils/helpers.js'

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      })
    }

    // Create new user
    const user = new User({
      email,
      password,
      profile: {
        firstName,
        lastName
      }
    })

    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        subscription: user.subscription
      },
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Server error during registration' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user and include password
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Update last login and login count
    user.lastLogin = new Date()
    user.loginCount += 1
    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        subscription: user.subscription,
        preferences: user.preferences
      },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Server error during login' })
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        subscription: user.subscription,
        preferences: user.preferences,
        socialLinks: user.socialLinks,
        isVerified: user.isVerified
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, title, socialLinks } = req.body

    const updateData = {}
    if (firstName) updateData['profile.firstName'] = firstName
    if (lastName) updateData['profile.lastName'] = lastName
    if (bio) updateData['profile.bio'] = bio
    if (title) updateData['profile.title'] = title
    if (socialLinks) updateData.socialLinks = socialLinks

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        socialLinks: user.socialLinks
      }
    })
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({ error: 'Server error during profile update' })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user.id).select('+password')
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Password change error:', error)
    res.status(500).json({ error: 'Server error during password change' })
  }
}