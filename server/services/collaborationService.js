import Collaboration from '../models/Collaboration.js'
import Portfolio from '../models/Portfolio.js'
import User from '../models/User.js'
import { sendCollaborationInvite } from './notificationService.js'

export const inviteCollaborator = async (portfolioId, inviterId, inviteeEmail, role = 'viewer') => {
  try {
    // Find invitee user
    const invitee = await User.findOne({ email: inviteeEmail })
    if (!invitee) {
      throw new Error('User not found with this email')
    }

    // Check if collaboration already exists
    const existingCollaboration = await Collaboration.findOne({
      portfolioId,
      userId: invitee._id
    })

    if (existingCollaboration) {
      throw new Error('User is already invited to this portfolio')
    }

    // Check portfolio ownership
    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId: inviterId
    })

    if (!portfolio) {
      throw new Error('Portfolio not found or access denied')
    }

    // Create collaboration invite
    const collaboration = new Collaboration({
      portfolioId,
      userId: invitee._id,
      invitedBy: inviterId,
      role,
      permissions: getPermissionsForRole(role)
    })

    await collaboration.save()

    // Send notification email
    const inviter = await User.findById(inviterId)
    await sendCollaborationInvite(inviter, invitee, portfolio)

    return collaboration
  } catch (error) {
    console.error('Invite collaborator error:', error)
    throw error
  }
}

export const acceptInvitation = async (collaborationId, userId) => {
  try {
    const collaboration = await Collaboration.findOne({
      _id: collaborationId,
      userId
    })

    if (!collaboration) {
      throw new Error('Invitation not found')
    }

    collaboration.status = 'accepted'
    collaboration.respondedAt = new Date()
    await collaboration.save()

    // Add to portfolio collaborators
    await Portfolio.findByIdAndUpdate(collaboration.portfolioId, {
      $push: {
        collaborators: {
          user: userId,
          role: collaboration.role
        }
      }
    })

    return collaboration
  } catch (error) {
    console.error('Accept invitation error:', error)
    throw error
  }
}

export const getCollaboratorPermissions = async (portfolioId, userId) => {
  try {
    const collaboration = await Collaboration.findOne({
      portfolioId,
      userId,
      status: 'accepted'
    })

    if (!collaboration) {
      return null
    }

    return {
      canEdit: collaboration.permissions.canEdit,
      canInvite: collaboration.permissions.canInvite,
      canDelete: collaboration.permissions.canDelete,
      role: collaboration.role
    }
  } catch (error) {
    console.error('Get collaborator permissions error:', error)
    throw error
  }
}

export const updateCollaboratorRole = async (portfolioId, collaboratorId, newRole, updatedById) => {
  try {
    // Verify updater has permission
    const updaterCollaboration = await Collaboration.findOne({
      portfolioId,
      userId: updatedById,
      status: 'accepted'
    })

    if (!updaterCollaboration || !updaterCollaboration.permissions.canInvite) {
      throw new Error('Insufficient permissions to update roles')
    }

    const collaboration = await Collaboration.findOne({
      portfolioId,
      userId: collaboratorId
    })

    if (!collaboration) {
      throw new Error('Collaborator not found')
    }

    collaboration.role = newRole
    collaboration.permissions = getPermissionsForRole(newRole)
    await collaboration.save()

    // Update portfolio collaborators array
    await Portfolio.findOneAndUpdate(
      {
        _id: portfolioId,
        'collaborators.user': collaboratorId
      },
      {
        $set: {
          'collaborators.$.role': newRole
        }
      }
    )

    return collaboration
  } catch (error) {
    console.error('Update collaborator role error:', error)
    throw error
  }
}

// Helper functions
const getPermissionsForRole = (role) => {
  const permissions = {
    viewer: {
      canEdit: false,
      canInvite: false,
      canDelete: false
    },
    editor: {
      canEdit: true,
      canInvite: false,
      canDelete: false
    },
    admin: {
      canEdit: true,
      canInvite: true,
      canDelete: true
    }
  }

  return permissions[role] || permissions.viewer
}