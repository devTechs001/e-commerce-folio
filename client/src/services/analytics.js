import api from './api'

export const analyticsService = {
  // Visitor Geography
  async getVisitorGeography(timeRange = '7d') {
    const response = await api.get('/analytics/visitors/geography', {
      params: { timeRange }
    })
    return response.data
  },

  // Performance Metrics
  async getPerformanceMetrics(timeRange = '7d') {
    const response = await api.get('/analytics/performance', {
      params: { timeRange }
    })
    return response.data
  },

  // SEO Analysis
  async getSEOReport() {
    const response = await api.get('/analytics/seo')
    return response.data
  },

  async fixSEIssue(issueId) {
    const response = await api.post(`/analytics/seo/issues/${issueId}/fix`)
    return response.data
  },

  // Traffic Sources
  async getTrafficSources(timeRange = '7d') {
    const response = await api.get('/analytics/traffic-sources', {
      params: { timeRange }
    })
    return response.data
  },

  // Portfolio Views
  async trackPortfolioView(portfolioId, data) {
    const response = await api.post(`/analytics/portfolios/${portfolioId}/view`, data)
    return response.data
  },

  async getPortfolioViews(portfolioId, timeRange = '7d') {
    const response = await api.get(`/analytics/portfolios/${portfolioId}/views`, {
      params: { timeRange }
    })
    return response.data
  },

  // Engagement Metrics
  async getEngagementMetrics(portfolioId, timeRange = '7d') {
    const response = await api.get(`/analytics/portfolios/${portfolioId}/engagement`, {
      params: { timeRange }
    })
    return response.data
  },

  // Export Analytics
  async exportAnalyticsData(portfolioId, format = 'csv') {
    const response = await api.get(`/analytics/portfolios/${portfolioId}/export`, {
      params: { format },
      responseType: 'blob'
    })
    return response.data
  },

  // Real-time Analytics
  async getRealtimeVisitors(portfolioId) {
    const response = await api.get(`/analytics/portfolios/${portfolioId}/realtime`)
    return response.data
  },

  // Goal Tracking
  async trackConversion(portfolioId, goalId, data) {
    const response = await api.post(`/analytics/portfolios/${portfolioId}/goals/${goalId}/conversion`, data)
    return response.data
  },

  async getGoalPerformance(portfolioId, timeRange = '7d') {
    const response = await api.get(`/analytics/portfolios/${portfolioId}/goals`, {
      params: { timeRange }
    })
    return response.data
  }
}