import api from './api'

export const integrationService = {
  // Social Media Integrations
  async getSocialIntegrations() {
    const response = await api.get('/integrations/social')
    return response.data
  },

  async connectSocial(platformId) {
    const response = await api.post(`/integrations/social/${platformId}/connect`)
    return response.data
  },

  async disconnectSocial(platformId) {
    const response = await api.post(`/integrations/social/${platformId}/disconnect`)
    return response.data
  },

  async syncSocialData(platformId) {
    const response = await api.post(`/integrations/social/${platformId}/sync`)
    return response.data
  },

  // Job Board Integrations
  async getJobBoardIntegrations() {
    const response = await api.get('/integrations/job-boards')
    return response.data
  },

  async connectJobBoard(boardId) {
    const response = await api.post(`/integrations/job-boards/${boardId}/connect`)
    return response.data
  },

  async getJobRecommendations() {
    const response = await api.get('/integrations/job-boards/recommendations')
    return response.data
  },

  async getResume() {
    const response = await api.get('/integrations/job-boards/resume')
    return response.data
  },

  async uploadResume(formData) {
    const response = await api.post('/integrations/job-boards/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  async applyToJob(jobId, resumeId) {
    const response = await api.post('/integrations/job-boards/apply', {
      jobId,
      resumeId
    })
    return response.data
  },

  // CRM Integrations
  async getCRMIntegrations() {
    const response = await api.get('/integrations/crm')
    return response.data
  },

  async connectCRM(platformId) {
    const response = await api.post(`/integrations/crm/${platformId}/connect`)
    return response.data
  },

  async getCRMContacts() {
    const response = await api.get('/integrations/crm/contacts')
    return response.data
  },

  async getCRMAnalytics() {
    const response = await api.get('/integrations/crm/analytics')
    return response.data
  },

  // Email Marketing Integrations
  async getEmailIntegrations() {
    const response = await api.get('/integrations/email')
    return response.data
  },

  async connectEmail(platformId) {
    const response = await api.post(`/integrations/email/${platformId}/connect`)
    return response.data
  },

  async getEmailCampaigns() {
    const response = await api.get('/integrations/email/campaigns')
    return response.data
  },

  async createEmailCampaign(campaignData) {
    const response = await api.post('/integrations/email/campaigns', campaignData)
    return response.data
  },

  async getEmailAnalytics() {
    const response = await api.get('/integrations/email/analytics')
    return response.data
  },

  // Webhook and API Management
  async getWebhooks() {
    const response = await api.get('/integrations/webhooks')
    return response.data
  },

  async createWebhook(webhookData) {
    const response = await api.post('/integrations/webhooks', webhookData)
    return response.data
  },

  async testWebhook(webhookId) {
    const response = await api.post(`/integrations/webhooks/${webhookId}/test`)
    return response.data
  }
}