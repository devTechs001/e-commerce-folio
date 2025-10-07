import axios from 'axios'
import { socketService } from './socket'

class RealTimeService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    this.updateCallbacks = new Map()
  }

  // Initialize real-time connection
  init(token) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      socketService.connect(token)
    }
  }

  // Subscribe to real-time updates
  subscribe(entity, callback) {
    if (!this.updateCallbacks.has(entity)) {
      this.updateCallbacks.set(entity, new Set())
    }
    this.updateCallbacks.get(entity).add(callback)

    // Listen for socket events
    socketService.on(`${entity}_updated`, callback)
    socketService.on(`${entity}_created`, callback)
    socketService.on(`${entity}_deleted`, callback)
  }

  // Unsubscribe from updates
  unsubscribe(entity, callback) {
    if (this.updateCallbacks.has(entity)) {
      this.updateCallbacks.get(entity).delete(callback)
    }
    socketService.off(`${entity}_updated`, callback)
    socketService.off(`${entity}_created`, callback)
    socketService.off(`${entity}_deleted`, callback)
  }

  // Analytics API
  async getAnalytics(timeRange = '7d') {
    try {
      const { data } = await axios.get(`${this.apiUrl}/api/analytics`, {
        params: { timeRange }
      })
      return data
    } catch (error) {
      console.error('Analytics fetch error:', error)
      return this.getMockAnalytics()
    }
  }

  async getVisitorStats() {
    try {
      const { data } = await axios.get(`${this.apiUrl}/api/analytics/visitors`)
      return data
    } catch (error) {
      return {
        total: 12543,
        today: 245,
        trend: '+12.5%',
        data: [1200, 1900, 1500, 2100, 1800, 2400, 2000]
      }
    }
  }

  async getRevenueStats() {
    try {
      const { data } = await axios.get(`${this.apiUrl}/api/analytics/revenue`)
      return data
    } catch (error) {
      return {
        total: 8945.50,
        monthly: [4500, 5200, 4800, 6100, 5800, 8945],
        trend: '+23.1%'
      }
    }
  }

  // Portfolio API
  async getPortfolios() {
    try {
      const { data } = await axios.get(`${this.apiUrl}/api/portfolios`)
      return data
    } catch (error) {
      console.error('Portfolios fetch error:', error)
      return []
    }
  }

  // Freelancing API
  async getFreelancingJobs(params = {}) {
    try {
      const { data } = await axios.get(`${this.apiUrl}/api/freelancing/jobs`, { params })
      return data
    } catch (error) {
      console.error('Jobs fetch error:', error)
      return {
        jobs: [
          {
            id: 1,
            title: 'Full Stack Developer Needed',
            description: 'Looking for an experienced developer to build a modern web application',
            budgetRange: '$5000 - $8000',
            duration: '2-3 months',
            skills: ['React', 'Node.js', 'MongoDB'],
            postedBy: { profile: { firstName: 'John', lastName: 'Doe' } },
            proposalCount: 12,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
          }
        ],
        total: 1
      }
    }
  }

  async getFreelancers(params = {}) {
    try {
      const { data } = await axios.get(`${this.apiUrl}/api/freelancing/freelancers`, { params })
      return data
    } catch (error) {
      console.error('Freelancers fetch error:', error)
      return {
        freelancers: [
          {
            _id: '1',
            profile: {
              firstName: 'Sarah',
              lastName: 'Johnson',
              title: 'Full Stack Developer',
              skills: ['React', 'Node.js', 'Python'],
              rating: 4.9,
              reviewCount: 156,
              hourlyRate: 85,
              completedJobs: 89,
              isFreelancer: true
            },
            email: 'sarah@example.com'
          }
        ],
        total: 1
      }
    }
  }

  async createJob(jobData) {
    try {
      const { data } = await axios.post(`${this.apiUrl}/api/freelancing/jobs`, jobData)
      return data
    } catch (error) {
      throw error
    }
  }

  async submitProposal(jobId, proposalData) {
    try {
      const { data } = await axios.post(`${this.apiUrl}/api/freelancing/jobs/${jobId}/proposals`, proposalData)
      return data
    } catch (error) {
      throw error
    }
  }

  async createPortfolio(portfolioData) {
    try {
      const { data } = await axios.post(`${this.apiUrl}/api/portfolios`, portfolioData)
      socketService.emit('portfolio_created', data)
      return data
    } catch (error) {
      throw error
    }
  }

  async updatePortfolio(id, updates) {
    try {
      const { data } = await axios.put(`${this.apiUrl}/api/portfolios/${id}`, updates)
      socketService.emit('portfolio_updated', { id, updates })
      return data
    } catch (error) {
      throw error
    }
  }

  // User/Visitor Tracking
  async trackVisitor(portfolioId, visitorData) {
    try {
      const { data } = await axios.post(`${this.apiUrl}/api/analytics/track`, {
        portfolioId,
        ...visitorData,
        timestamp: new Date().toISOString()
      })
      socketService.emit('visitor_tracked', data)
      return data
    } catch (error) {
      console.error('Visitor tracking error:', error)
    }
  }

  async getRecentVisitors(limit = 10) {
    try {
      const { data } = await axios.get(`${this.apiUrl}/api/analytics/visitors/recent`, {
        params: { limit }
      })
      return data
    } catch (error) {
      return [
        { visitor: 'Anonymous User', location: 'New York, US', page: '/portfolio/projects', time: '2 min ago', duration: '3:45' },
        { visitor: 'John Doe', location: 'London, UK', page: '/portfolio/about', time: '5 min ago', duration: '2:30' }
      ]
    }
  }

  // AI Generation
  async generatePortfolioContent(userData) {
    try {
      const { data } = await axios.post(`${this.apiUrl}/api/ai/generate`, userData)
      return data
    } catch (error) {
      // Fallback to client-side generation
      return this.generateContentLocally(userData)
    }
  }

  generateContentLocally(userData) {
    return {
      bio: `${userData.name} is a ${userData.profession} with ${userData.experience} years of experience. Specializing in ${userData.skills}, they have successfully delivered numerous projects and continue to push the boundaries of innovation in their field.`,
      
      about: `As a passionate ${userData.profession}, I bring ${userData.experience} years of hands-on experience in creating exceptional digital solutions. My expertise spans across ${userData.skills}, allowing me to tackle complex challenges with creative and efficient approaches.\n\nThroughout my career, I've had the privilege of working on diverse projects including ${userData.projects}. Each project has strengthened my commitment to delivering high-quality work that exceeds client expectations.\n\nI believe in continuous learning and staying updated with the latest industry trends. My approach combines technical excellence with strong communication skills, ensuring successful project outcomes and satisfied clients.`,
      
      skills: userData.skills.split(',').map(skill => ({
        name: skill.trim(),
        level: Math.floor(Math.random() * 30) + 70,
        category: 'Technical'
      })),
      
      projects: userData.projects.split(',').slice(0, 3).map((project, index) => ({
        title: project.trim(),
        description: `A comprehensive ${userData.profession.toLowerCase()} project that showcases advanced ${userData.skills.split(',')[0]} capabilities. This project demonstrates problem-solving skills and technical expertise.`,
        technologies: userData.skills.split(',').slice(0, 3).map(s => s.trim()),
        link: '#'
      }))
    }
  }

  // Payment/Billing
  async createCheckoutSession(planId, billingDetails) {
    try {
      const { data } = await axios.post(`${this.apiUrl}/api/payments/create-checkout-session`, {
        planId,
        billingDetails,
        successUrl: `${window.location.origin}/dashboard/billing?success=true`,
        cancelUrl: `${window.location.origin}/checkout?canceled=true`
      })
      return data
    } catch (error) {
      throw error
    }
  }

  async getBillingHistory() {
    try {
      const { data } = await axios.get(`${this.apiUrl}/api/billing/history`)
      return data
    } catch (error) {
      return { history: [], paymentMethod: null }
    }
  }

  // Notifications
  async getNotifications() {
    try {
      const { data } = await axios.get(`${this.apiUrl}/api/notifications`)
      return data
    } catch (error) {
      return []
    }
  }

  async markNotificationRead(id) {
    try {
      await axios.put(`${this.apiUrl}/api/notifications/${id}/read`)
      socketService.emit('notification_read', { id })
    } catch (error) {
      console.error('Mark notification error:', error)
    }
  }

  // Mock data for development
  getMockAnalytics() {
    return {
      visitors: {
        total: 12543,
        trend: '+12.5%',
        data: [1200, 1900, 1500, 2100, 1800, 2400, 2000]
      },
      views: {
        total: 45678,
        trend: '+8.2%'
      },
      revenue: {
        total: 8945.50,
        trend: '+23.1%',
        monthly: [4500, 5200, 4800, 6100, 5800, 8945]
      },
      conversion: {
        rate: 3.2,
        trend: '-0.3%'
      },
      trafficSources: {
        labels: ['Direct', 'Social Media', 'Search', 'Referral', 'Email'],
        data: [35, 25, 20, 15, 5]
      },
      topPages: [
        { page: '/portfolio/projects', views: 5432, percentage: 85 },
        { page: '/portfolio/about', views: 3210, percentage: 65 },
        { page: '/portfolio/contact', views: 2145, percentage: 45 },
        { page: '/portfolio/skills', views: 1876, percentage: 35 }
      ]
    }
  }
}

export const realTimeService = new RealTimeService()
export default realTimeService
