import api from './api'

export const collaborationService = {
  // Team Management
  async getTeamMembers(portfolioId) {
    const response = await api.get(`/collaboration/teams/${portfolioId}/members`)
    return response.data
  },

  async inviteTeamMember(portfolioId, email, role) {
    const response = await api.post(`/collaboration/teams/${portfolioId}/invite`, {
      email,
      role
    })
    return response.data
  },

  async updateTeamMemberRole(portfolioId, memberId, role) {
    const response = await api.put(`/collaboration/teams/${portfolioId}/members/${memberId}`, {
      role
    })
    return response.data
  },

  async removeTeamMember(portfolioId, memberId) {
    const response = await api.delete(`/collaboration/teams/${portfolioId}/members/${memberId}`)
    return response.data
  },

  // Real-time Collaboration
  async joinEditingSession(portfolioId) {
    const response = await api.post(`/collaboration/sessions/${portfolioId}/join`)
    return response.data
  },

  async leaveEditingSession(portfolioId) {
    const response = await api.post(`/collaboration/sessions/${portfolioId}/leave`)
    return response.data
  },

  async getActiveSessions(portfolioId) {
    const response = await api.get(`/collaboration/sessions/${portfolioId}/active`)
    return response.data
  },

  // Comments and Feedback
  async addComment(portfolioId, sectionId, comment) {
    const response = await api.post(`/collaboration/comments/${portfolioId}`, {
      sectionId,
      comment
    })
    return response.data
  },

  async getComments(portfolioId, sectionId = null) {
    const params = sectionId ? { sectionId } : {}
    const response = await api.get(`/collaboration/comments/${portfolioId}`, { params })
    return response.data
  },

  async resolveComment(portfolioId, commentId) {
    const response = await api.put(`/collaboration/comments/${portfolioId}/${commentId}/resolve`)
    return response.data
  },

  async deleteComment(portfolioId, commentId) {
    const response = await api.delete(`/collaboration/comments/${portfolioId}/${commentId}`)
    return response.data
  },

  // Version Control
  async getVersions(portfolioId) {
    const response = await api.get(`/collaboration/versions/${portfolioId}`)
    return response.data
  },

  async createVersion(portfolioId, description) {
    const response = await api.post(`/collaboration/versions/${portfolioId}`, {
      description
    })
    return response.data
  },

  async restoreVersion(portfolioId, versionId) {
    const response = await api.post(`/collaboration/versions/${portfolioId}/${versionId}/restore`)
    return response.data
  },

  async compareVersions(portfolioId, version1, version2) {
    const response = await api.get(`/collaboration/versions/${portfolioId}/compare`, {
      params: { version1, version2 }
    })
    return response.data
  },

  // Sharing and Permissions
  async createShareLink(portfolioId, settings) {
    const response = await api.post(`/collaboration/share/${portfolioId}/link`, settings)
    return response.data
  },

  async getShareLinks(portfolioId) {
    const response = await api.get(`/collaboration/share/${portfolioId}/links`)
    return response.data
  },

  async updateShareLink(portfolioId, linkId, settings) {
    const response = await api.put(`/collaboration/share/${portfolioId}/links/${linkId}`, settings)
    return response.data
  },

  async revokeShareLink(portfolioId, linkId) {
    const response = await api.delete(`/collaboration/share/${portfolioId}/links/${linkId}`)
    return response.data
  },

  // Notifications
  async getCollaborationNotifications() {
    const response = await api.get('/collaboration/notifications')
    return response.data
  },

  async markNotificationAsRead(notificationId) {
    const response = await api.put(`/collaboration/notifications/${notificationId}/read`)
    return response.data
  },

  // Activity Log
  async getActivityLog(portfolioId, limit = 50) {
    const response = await api.get(`/collaboration/activity/${portfolioId}`, {
      params: { limit }
    })
    return response.data
  },

  // Approval Workflow
  async requestApproval(portfolioId, sectionId, message) {
    const response = await api.post(`/collaboration/approvals/${portfolioId}/request`, {
      sectionId,
      message
    })
    return response.data
  },

  async getApprovalRequests(portfolioId) {
    const response = await api.get(`/collaboration/approvals/${portfolioId}/requests`)
    return response.data
  },

  async approveChange(portfolioId, requestId, comments = '') {
    const response = await api.post(`/collaboration/approvals/${portfolioId}/approve`, {
      requestId,
      comments
    })
    return response.data
  },

  async rejectChange(portfolioId, requestId, reason) {
    const response = await api.post(`/collaboration/approvals/${portfolioId}/reject`, {
      requestId,
      reason
    })
    return response.data
  }
}