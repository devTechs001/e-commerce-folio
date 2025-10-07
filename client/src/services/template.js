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
  },

  // Template Categories
  async getCategories() {
    try {
      const response = await api.get('/templates/categories')
      return response.data
    } catch (error) {
      console.warn('Template categories API not available, returning mock data')
      return [
        { id: 1, name: 'Creative', count: 25 },
        { id: 2, name: 'Business', count: 18 },
        { id: 3, name: 'Developer', count: 22 },
        { id: 4, name: 'Photography', count: 15 },
        { id: 5, name: 'Design', count: 20 }
      ]
    }
  },

  // Template Preview
  async getTemplatePreview(templateId) {
    try {
      const response = await api.get(`/templates/${templateId}/preview`)
      return response.data
    } catch (error) {
      console.warn('Template preview API not available, returning mock data')
      return {
        id: templateId,
        previewUrl: `/templates/preview/${templateId}`,
        screenshots: [
          `/templates/screenshots/${templateId}_1.jpg`,
          `/templates/screenshots/${templateId}_2.jpg`
        ]
      }
    }
  },

  // Template Purchase with Checkout
  async purchaseTemplateWithCheckout(templateId, priceId) {
    try {
      const response = await api.post(`/templates/${templateId}/purchase-checkout`, {
        priceId
      })
      return response.data
    } catch (error) {
      console.error('Error purchasing template:', error)
      // Return mock checkout URL for development
      return {
        checkoutUrl: `/pricing?template=${templateId}&checkout=demo`,
        success: false,
        message: 'Demo mode - template purchase simulation'
      }
    }
  },

  // Check if user owns template
  async checkTemplateOwnership(templateId) {
    try {
      const response = await api.get(`/templates/${templateId}/ownership`)
      return response.data
    } catch (error) {
      console.warn('Template ownership API not available, returning mock data')
      return {
        owned: false,
        purchaseDate: null,
        canUse: false
      }
    }
  },

  // Get featured templates
  async getFeaturedTemplates() {
    try {
      const response = await api.get('/templates/featured')
      return response.data
    } catch (error) {
      console.warn('Featured templates API not available, returning mock data')
      return [
        {
          id: 1,
          name: 'Creative Portfolio',
          description: 'A stunning creative portfolio template',
          price: 29,
          image: '/templates/creative-portfolio.jpg',
          category: 'Creative',
          featured: true
        },
        {
          id: 2,
          name: 'Business Professional',
          description: 'Clean and professional business template',
          price: 39,
          image: '/templates/business-pro.jpg',
          category: 'Business',
          featured: true
        },
        {
          id: 3,
          name: 'Developer Showcase',
          description: 'Perfect for showcasing development projects',
          price: 35,
          image: '/templates/dev-showcase.jpg',
          category: 'Developer',
          featured: true
        }
      ]
    }
  }
}