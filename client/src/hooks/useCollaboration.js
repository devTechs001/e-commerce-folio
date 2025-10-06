import { useState, useEffect, useCallback } from 'react'
import { collaborationService } from '../services/collaboration'
import { useSocket } from './useSocket'

/**
 * Custom hook for real-time collaboration features
 * @param {string} portfolioId - Portfolio ID to collaborate on
 * @returns {Object} Collaboration state and methods
 */
export const useCollaboration = (portfolioId) => {
  const [teamMembers, setTeamMembers] = useState([])
  const [activeSessions, setActiveSessions] = useState([])
  const [comments, setComments] = useState([])
  const [versions, setVersions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { isConnected, on, off, emit } = useSocket([
    'user_joined',
    'user_left',
    'content_updated',
    'cursor_moved',
    'comment_added',
    'comment_resolved'
  ])

  // Load initial data
  useEffect(() => {
    if (portfolioId) {
      loadCollaborationData()
    }
  }, [portfolioId])

  // Socket event handlers
  useEffect(() => {
    if (!portfolioId || !isConnected) return

    const handleUserJoined = (data) => {
      if (data.portfolioId === portfolioId) {
        setActiveSessions(prev => [...prev.filter(s => s.userId !== data.userId), data])
      }
    }

    const handleUserLeft = (data) => {
      if (data.portfolioId === portfolioId) {
        setActiveSessions(prev => prev.filter(s => s.userId !== data.userId))
      }
    }

    const handleCommentAdded = (data) => {
      if (data.portfolioId === portfolioId) {
        setComments(prev => [...prev, data.comment])
      }
    }

    const handleCommentResolved = (data) => {
      if (data.portfolioId === portfolioId) {
        setComments(prev => prev.map(comment => 
          comment.id === data.commentId 
            ? { ...comment, resolved: true, resolvedAt: data.resolvedAt }
            : comment
        ))
      }
    }

    // Register event listeners
    on('user_joined', handleUserJoined)
    on('user_left', handleUserLeft)
    on('comment_added', handleCommentAdded)
    on('comment_resolved', handleCommentResolved)

    // Join portfolio room
    emit('join_portfolio', { portfolioId })

    return () => {
      // Cleanup
      off('user_joined', handleUserJoined)
      off('user_left', handleUserLeft)
      off('comment_added', handleCommentAdded)
      off('comment_resolved', handleCommentResolved)
      
      // Leave portfolio room
      emit('leave_portfolio', { portfolioId })
    }
  }, [portfolioId, isConnected, on, off, emit])

  const loadCollaborationData = useCallback(async () => {
    if (!portfolioId) return

    setLoading(true)
    setError(null)

    try {
      const [teamResponse, commentsResponse, versionsResponse] = await Promise.all([
        collaborationService.getTeamMembers(portfolioId),
        collaborationService.getComments(portfolioId),
        collaborationService.getVersions(portfolioId)
      ])

      if (teamResponse.success) setTeamMembers(teamResponse.data)
      if (commentsResponse.success) setComments(commentsResponse.data)
      if (versionsResponse.success) setVersions(versionsResponse.data)

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load collaboration data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [portfolioId])

  const inviteTeamMember = useCallback(async (email, role = 'editor') => {
    setLoading(true)
    setError(null)

    try {
      const response = await collaborationService.inviteTeamMember(portfolioId, email, role)
      if (response.success) {
        await loadCollaborationData() // Reload team members
      }
      return response
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to invite team member'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [portfolioId, loadCollaborationData])

  const addComment = useCallback(async (sectionId, comment) => {
    setError(null)

    try {
      const response = await collaborationService.addComment(portfolioId, sectionId, comment)
      if (response.success) {
        // Comment will be added via socket event
        return response
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add comment'
      setError(errorMessage)
      throw err
    }
  }, [portfolioId])

  const resolveComment = useCallback(async (commentId) => {
    setError(null)

    try {
      const response = await collaborationService.resolveComment(portfolioId, commentId)
      if (response.success) {
        // Comment will be updated via socket event
        return response
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to resolve comment'
      setError(errorMessage)
      throw err
    }
  }, [portfolioId])

  const createVersion = useCallback(async (description) => {
    setLoading(true)
    setError(null)

    try {
      const response = await collaborationService.createVersion(portfolioId, description)
      if (response.success) {
        setVersions(prev => [response.data, ...prev])
      }
      return response
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create version'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [portfolioId])

  const updateContent = useCallback((sectionId, content) => {
    emit('content_update', {
      portfolioId,
      sectionId,
      content,
      timestamp: Date.now()
    })
  }, [portfolioId, emit])

  const updateCursor = useCallback((position) => {
    emit('cursor_update', {
      portfolioId,
      position,
      timestamp: Date.now()
    })
  }, [portfolioId, emit])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // State
    teamMembers,
    activeSessions,
    comments,
    versions,
    loading,
    error,
    isConnected,

    // Team management
    inviteTeamMember,
    updateTeamMemberRole: collaborationService.updateTeamMemberRole,
    removeTeamMember: collaborationService.removeTeamMember,

    // Comments
    addComment,
    resolveComment,
    deleteComment: collaborationService.deleteComment,

    // Version control
    createVersion,
    restoreVersion: collaborationService.restoreVersion,
    compareVersions: collaborationService.compareVersions,

    // Real-time collaboration
    updateContent,
    updateCursor,
    startTyping: () => emit('typing_start', { portfolioId }),
    stopTyping: () => emit('typing_stop', { portfolioId }),

    // Utility
    clearError,
    reload: loadCollaborationData
  }
}