import api from './api'

export const portfolioService = {
  // Get all user portfolios
  async getUserPortfolios() {
    const response = await api.get('/portfolios')
    return response.data
  },

  // Get specific portfolio
  async getPortfolio(portfolioId) {
    const response = await api.get(`/portfolios/${portfolioId}`)
    return response.data
  },

  // Create new portfolio
  async createPortfolio(portfolioData) {
    const response = await api.post('/portfolios', portfolioData)
    return response.data
  },

  // Update portfolio
  async updatePortfolio(portfolioId, updates) {
    const response = await api.put(`/portfolios/${portfolioId}`, updates)
    return response.data
  },

  // Update portfolio sections
  async updatePortfolioSections(portfolioId, sections) {
    const response = await api.put(`/portfolios/${portfolioId}/sections`, { sections })
    return response.data
  },

  // Delete portfolio
  async deletePortfolio(portfolioId) {
    const response = await api.delete(`/portfolios/${portfolioId}`)
    return response.data
  },

  // Publish portfolio
  async publishPortfolio(portfolioId) {
    const response = await api.post(`/portfolios/${portfolioId}/publish`)
    return response.data
  },

  // Duplicate portfolio
  async duplicatePortfolio(portfolioId) {
    const portfolio = await this.getPortfolio(portfolioId)
    const duplicateData = {
      title: `${portfolio.portfolio.title} (Copy)`,
      templateId: portfolio.portfolio.templateId
    }
    return await this.createPortfolio(duplicateData)
  },

  // Get public portfolio
  async getPublicPortfolio(slug) {
    const response = await api.get(`/portfolios/public/${slug}`)
    return response.data
  },

  // Export portfolio
  async exportPortfolio(portfolioId, format) {
    const response = await api.get(`/export/portfolio/${portfolioId}/${format}`, {
      responseType: 'blob'
    })
    return response.data
  }
}