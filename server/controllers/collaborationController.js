import Portfolio from '../models/Portfolio.js'
import User from '../models/User.js'

export const addCollaborator = async (req, res) => {
  try {
    const { portfolioId } = req.params
    const { email, role = 'viewer' } = req.body

    // Find the user by email
    const collaboratorUser = await User.findOne({ email })
    if (!collaboratorUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check if user is trying to add themselves
    if (collaboratorUser._id.toString() === req.user.id) {
      return res.status(400).json({ error: 'Cannot add yourself as collaborator' })
    }

    // Find portfolio and verify ownership
    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId: req.user.id
    })

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found or access denied' })
    }

    // Check if collaborator already exists
    const existingCollaborator = portfolio.collaborators.find(
      collab => collab.user.toString() === collaboratorUser._id.toString()
    )

    if (existingCollaborator) {
      return res.status(400).json({ error: 'User is already a collaborator' })
    }

    // Add collaborator
    await portfolio.addCollaborator(collaboratorUser._id, role)

    res.json({ 
      message: 'Collaborator added successfully',
      collaborator: {
        user: {
          id: collaboratorUser._id,
          email: collaboratorUser.email,
          profile: collaboratorUser.profile
        },
        role
      }
    })
  } catch (error) {
    console.error('Add collaborator error:', error)
    res.status(500).json({ error: 'Server error adding collaborator' })
  }
}

export const removeCollaborator = async (req, res) => {
  try {
    const { portfolioId, userId } = req.params

    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId: req.user.id // Only owner can remove collaborators
    })

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found or access denied' })
    }

    // Remove collaborator
    portfolio.collaborators = portfolio.collaborators.filter(
      collab => collab.user.toString() !== userId
    )

    await portfolio.save()

    res.json({ message: 'Collaborator removed successfully' })
  } catch (error) {
    console.error('Remove collaborator error:', error)
    res.status(500).json({ error: 'Server error removing collaborator' })
  }
}

export const updateCollaboratorRole = async (req, res) => {
  try {
    const { portfolioId, userId } = req.params
    const { role } = req.body

    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId: req.user.id // Only owner can update roles
    })

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found or access denied' })
    }

    // Find and update collaborator role
    const collaborator = portfolio.collaborators.find(
      collab => collab.user.toString() === userId
    )

    if (!collaborator) {
      return res.status(404).json({ error: 'Collaborator not found' })
    }

    collaborator.role = role
    await portfolio.save()

    res.json({ 
      message: 'Collaborator role updated successfully',
      collaborator: {
        user: userId,
        role
      }
    })
  } catch (error) {
    console.error('Update collaborator role error:', error)
    res.status(500).json({ error: 'Server error updating collaborator role' })
  }
}

export const getCollaborators = async (req, res) => {
  try {
    const { portfolioId } = req.params

    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      $or: [
        { userId: req.user.id },
        { 'collaborators.user': req.user.id }
      ]
    }).populate('collaborators.user', 'profile email')

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' })
    }

    res.json({ 
      collaborators: portfolio.collaborators.map(collab => ({
        user: {
          id: collab.user._id,
          email: collab.user.email,
          profile: collab.user.profile
        },
        role: collab.role,
        addedAt: collab.addedAt
      }))
    })
  } catch (error) {
    console.error('Get collaborators error:', error)
    res.status(500).json({ error: 'Server error fetching collaborators' })
  }
}