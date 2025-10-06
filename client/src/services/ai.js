import api from './api'

export const aiService = {
  // Content Generation
  async generateContent(prompt, options = {}) {
    const response = await api.post('/ai/generate/content', {
      prompt,
      tone: options.tone || 'professional',
      length: options.length || 'medium',
      language: options.language || 'en'
    })
    return response.data
  },

  async generateSection(sectionType, data) {
    const response = await api.post('/ai/generate/section', {
      sectionType,
      data
    })
    return response.data
  },

  // Content Optimization
  async optimizeContent(content, type) {
    const response = await api.post('/ai/optimize/content', {
      content,
      type
    })
    return response.data
  },

  async improveSEO(content) {
    const response = await api.post('/ai/optimize/seo', { content })
    return response.data
  },

  // Design Suggestions
  async getDesignSuggestions(portfolioId) {
    const response = await api.get(`/ai/design/suggestions/${portfolioId}`)
    return response.data
  },

  async applyDesignSuggestion(portfolioId, suggestionId) {
    const response = await api.post(`/ai/design/apply/${portfolioId}`, {
      suggestionId
    })
    return response.data
  },

  // Code Generation
  async generateCustomCode(requirements) {
    const response = await api.post('/ai/generate/code', { requirements })
    return response.data
  },

  // Image Generation
  async generateImage(prompt, style = 'professional') {
    const response = await api.post('/ai/generate/image', {
      prompt,
      style,
      size: '1024x1024'
    })
    return response.data
  },

  // Analytics Insights
  async getAnalyticsInsights(portfolioId) {
    const response = await api.get(`/ai/analytics/insights/${portfolioId}`)
    return response.data
  },

  // Career Suggestions
  async getCareerSuggestions(profileData) {
    const response = await api.post('/ai/career/suggestions', profileData)
    return response.data
  },

  // Resume Optimization
  async optimizeResume(resumeContent, targetRole) {
    const response = await api.post('/ai/optimize/resume', {
      resumeContent,
      targetRole
    })
    return response.data
  },

  // A/B Testing Suggestions
  async getABTestSuggestions(portfolioId) {
    const response = await api.get(`/ai/testing/suggestions/${portfolioId}`)
    return response.data
  },

  // Performance Recommendations
  async getPerformanceRecommendations(portfolioId) {
    const response = await api.get(`/ai/performance/recommendations/${portfolioId}`)
    return response.data
  },

  // Chat with AI Assistant
  async chatWithAssistant(message, context = {}) {
    const response = await api.post('/ai/chat', {
      message,
      context
    })
    return response.data
  },

  // Template Recommendations
  async getTemplateRecommendations(userPreferences) {
    const response = await api.post('/ai/templates/recommendations', userPreferences)
    return response.data
  },

  // Content Translation
  async translateContent(content, targetLanguage) {
    const response = await api.post('/ai/translate', {
      content,
      targetLanguage
    })
    return response.data
  },

  // Grammar and Spell Check
  async checkGrammar(content) {
    const response = await api.post('/ai/grammar/check', { content })
    return response.data
  },

  // Content Summarization
  async summarizeContent(content, maxLength = 200) {
    const response = await api.post('/ai/summarize', {
      content,
      maxLength
    })
    return response.data
  }
}