import api from './api'

export const templateService = {
  async getTemplates(filters = {}) {
    const response = await api.get('/templates', { params: filters })
    return response.data
  },

  async getTemplateById(id) {
    const response = await api.get(`/templates/${id}`)
    return response.data
  },

  async purchaseTemplate(templateId) {
    const response = await api.post(`/templates/${templateId}/purchase`)
    return response.data
  },

  async addToFavorites(templateId) {
    const response = await api.post(`/templates/${templateId}/favorite`)
    return response.data
  },

  async removeFromFavorites(templateId) {
    const response = await api.delete(`/templates/${templateId}/favorite`)
    return response.data
  },

  async getMyTemplates() {
    const response = await api.get('/templates/my-templates')
    return response.data
  },

  async applyTemplate(portfolioId, templateId) {
    const response = await api.post(`/portfolios/${portfolioId}/apply-template/${templateId}`)
    return response.data
  }
}