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

  async trackConversion(portfolioId, goalId, data) {
    const response = await api.post(`/analytics/portfolios/${portfolioId}/goals/${goalId}/conversion`, data)
    return response.data
  },

  async getGoalPerformance(portfolioId, timeRange = '7d') {
    const response = await api.get(`/analytics/portfolios/${portfolioId}/goals`, {
      params: { timeRange }
    })
    return response.data
  },

  // Recent Activity
  async getRecentActivity(limit = 10) {
    try {
      const response = await api.get('/analytics/recent-activity', {
        params: { limit }
      })
      return response.data
    } catch (error) {
      // Return mock data if API is not available
      console.warn('Analytics API not available, returning mock data')
      return [
        {
          id: 1,
          type: 'portfolio_view',
          message: 'Portfolio "Creative Showcase" was viewed',
          timestamp: new Date(Date.now() - 300000),
          user: 'Anonymous'
        },
        {
          id: 2,
          type: 'template_download',
          message: 'Template "Modern Portfolio" was downloaded',
          timestamp: new Date(Date.now() - 600000),
          user: 'John Doe'
        },
        {
          id: 3,
          type: 'user_signup',
          message: 'New user registered',
          timestamp: new Date(Date.now() - 900000),
          user: 'Jane Smith'
        }
      ]
    }
  },

  // Dashboard Overview Data
  async getDashboardOverview() {
    try {
      const response = await api.get('/analytics/dashboard-overview')
      return response.data
    } catch (error) {
      // Return mock data if API is not available
      console.warn('Analytics API not available, returning mock data')
      return {
        totalViews: 12543,
        uniqueVisitors: 8921,
        bounceRate: 34.2,
        avgSessionDuration: '2m 34s',
        topPages: [
          { path: '/', views: 3421, title: 'Home' },
          { path: '/portfolio/creative', views: 2134, title: 'Creative Portfolio' },
          { path: '/templates', views: 1876, title: 'Templates' }
        ],
        recentActivity: [
          {
            id: 1,
            type: 'portfolio_view',
            message: 'Portfolio "Creative Showcase" was viewed',
            timestamp: new Date(Date.now() - 300000),
            user: 'Anonymous'
          },
          {
            id: 2,
            type: 'template_download',
            message: 'Template "Modern Portfolio" was downloaded',
            timestamp: new Date(Date.now() - 600000),
            user: 'John Doe'
          }
        ]
      }
    }
  }
}