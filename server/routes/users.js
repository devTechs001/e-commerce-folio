import express from 'express'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/users/profile/:userId
// @desc    Get user public profile
// @access  Public
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('profile socialLinks createdAt')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get user profile error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// @route   GET /api/users/search
// @desc    Search users (for collaboration)
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query

    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' })
    }

    const users = await User.find({
      $or: [
        { 'profile.firstName': { $regex: query, $options: 'i' } },
        { 'profile.lastName': { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ],
      _id: { $ne: req.user.id } // Exclude current user
    })
    .select('profile email')
    .limit(10)

    res.json({ users })
  } catch (error) {
    console.error('Search users error:', error)
    res.status(500).json({ error: 'Server error searching users' })
  }
})

export default router