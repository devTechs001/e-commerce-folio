import User from '../models/User.js'
import Portfolio from '../models/Portfolio.js'

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('subscription')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get user profile error:', error)
    res.status(500).json({ error: 'Failed to fetch user profile' })
  }
}

export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, title, socialLinks, preferences } = req.body

    const updateData = {}
    if (firstName) updateData['profile.firstName'] = firstName
    if (lastName) updateData['profile.lastName'] = lastName
    if (bio) updateData['profile.bio'] = bio
    if (title) updateData['profile.title'] = title
    if (socialLinks) updateData.socialLinks = socialLinks
    if (preferences) updateData.preferences = preferences

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password')

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    })
  } catch (error) {
    console.error('Update user profile error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
}

export const updateUserPreferences = async (req, res) => {
  try {
    const { theme, notifications, language } = req.body

    const updateData = {}
    if (theme) updateData['preferences.theme'] = theme
    if (notifications) updateData['preferences.notifications'] = notifications
    if (language) updateData['preferences.language'] = language

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('preferences')

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: user.preferences
    })
  } catch (error) {
    console.error('Update preferences error:', error)
    res.status(500).json({ error: 'Failed to update preferences' })
  }
}

export const deleteUserAccount = async (req, res) => {
  try {
    const { confirmation } = req.body

    if (confirmation !== 'DELETE MY ACCOUNT') {
      return res.status(400).json({ 
        error: 'Confirmation text is required to delete account' 
      })
    }

    // Delete user's portfolios
    await Portfolio.deleteMany({ userId: req.user.id })

    // Delete user
    await User.findByIdAndDelete(req.user.id)

    res.json({
      success: true,
      message: 'Account deleted successfully'
    })
  } catch (error) {
    console.error('Delete user account error:', error)
    res.status(500).json({ error: 'Failed to delete account' })
  }
}

export const getUserStats = async (req, res) => {
  try {
    const portfolioCount = await Portfolio.countDocuments({ userId: req.user.id })
    const publishedCount = await Portfolio.countDocuments({ 
      userId: req.user.id,
      'settings.isPublished': true 
    })

    const user = await User.findById(req.user.id)
    
    res.json({
      stats: {
        portfolios: portfolioCount,
        published: publishedCount,
        drafts: portfolioCount - publishedCount,
        memberSince: user.createdAt,
        lastLogin: user.lastLogin
      }
    })
  } catch (error) {
    console.error('Get user stats error:', error)
    res.status(500).json({ error: 'Failed to fetch user stats' })
  }
}