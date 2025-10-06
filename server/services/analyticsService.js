import Analytics from '../models/Analytics.js'
import Portfolio from '../models/Portfolio.js'

export const generateAnalyticsReport = async (portfolioId, startDate, endDate) => {
  try {
    const analytics = await Analytics.find({
      portfolioId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: 1 })

    // Calculate metrics
    const totalViews = analytics.reduce((sum, item) => sum + item.views, 0)
    const totalUniqueVisitors = analytics.reduce((sum, item) => sum + item.uniqueVisitors, 0)
    const averageViewsPerDay = analytics.length > 0 ? totalViews / analytics.length : 0

    // Calculate traffic sources
    const sources = {
      direct: analytics.reduce((sum, item) => sum + (item.sources?.direct || 0), 0),
      organic: analytics.reduce((sum, item) => sum + (item.sources?.organic || 0), 0),
      social: analytics.reduce((sum, item) => sum + (item.sources?.social || 0), 0),
      referral: analytics.reduce((sum, item) => sum + (item.sources?.referral || 0), 0)
    }

    // Calculate popular times
    const hourlyData = Array(24).fill(0)
    analytics.forEach(day => {
      day.visitors.forEach(visitor => {
        const hour = new Date(visitor.timestamp).getHours()
        hourlyData[hour]++
      })
    })

    return {
      period: {
        start: startDate,
        end: endDate,
        days: analytics.length
      },
      overview: {
        totalViews,
        totalUniqueVisitors,
        averageViewsPerDay: Math.round(averageViewsPerDay),
        bounceRate: calculateBounceRate(analytics)
      },
      trafficSources: sources,
      hourlyDistribution: hourlyData,
      dailyData: analytics.map(day => ({
        date: day.date,
        views: day.views,
        uniqueVisitors: day.uniqueVisitors
      }))
    }
  } catch (error) {
    console.error('Generate analytics report error:', error)
    throw new Error('Failed to generate analytics report')
  }
}

export const trackEvent = async (portfolioId, eventType, eventData = {}) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let analytics = await Analytics.findOne({
      portfolioId,
      date: today
    })

    if (!analytics) {
      analytics = new Analytics({
        portfolioId,
        date: today
      })
    }

    // Add event
    analytics.events.push({
      type: eventType,
      element: eventData.element,
      metadata: eventData.metadata,
      timestamp: new Date()
    })

    await analytics.save()
    return true
  } catch (error) {
    console.error('Track event error:', error)
    return false
  }
}

export const getPortfolioInsights = async (portfolioId) => {
  try {
    const portfolio = await Portfolio.findById(portfolioId)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const recentAnalytics = await Analytics.find({
      portfolioId,
      date: { $gte: thirtyDaysAgo }
    })

    const totalViews = recentAnalytics.reduce((sum, item) => sum + item.views, 0)
    const growthRate = calculateGrowthRate(recentAnalytics)

    return {
      performance: {
        score: calculatePerformanceScore(recentAnalytics),
        trend: growthRate > 0 ? 'up' : growthRate < 0 ? 'down' : 'stable',
        growthRate
      },
      engagement: {
        averageTimeOnPage: calculateAverageEngagement(recentAnalytics),
        popularSections: getPopularSections(recentAnalytics)
      },
      recommendations: generateRecommendations(portfolio, recentAnalytics)
    }
  } catch (error) {
    console.error('Get portfolio insights error:', error)
    throw new Error('Failed to get portfolio insights')
  }
}

// Helper functions
const calculateBounceRate = (analytics) => {
  // Simplified bounce rate calculation
  const totalSessions = analytics.reduce((sum, item) => sum + item.uniqueVisitors, 0)
  const bouncedSessions = analytics.reduce((sum, item) => {
    return sum + item.visitors.filter(v => v.events && v.events.length <= 1).length
  }, 0)
  
  return totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0
}

const calculateGrowthRate = (analytics) => {
  if (analytics.length < 2) return 0
  
  const firstWeek = analytics.slice(0, 7).reduce((sum, item) => sum + item.views, 0)
  const lastWeek = analytics.slice(-7).reduce((sum, item) => sum + item.views, 0)
  
  return firstWeek > 0 ? ((lastWeek - firstWeek) / firstWeek) * 100 : 0
}

const calculatePerformanceScore = (analytics) => {
  // Calculate a performance score based on various metrics
  const totalViews = analytics.reduce((sum, item) => sum + item.views, 0)
  const uniqueVisitors = analytics.reduce((sum, item) => sum + item.uniqueVisitors, 0)
  const engagement = calculateAverageEngagement(analytics)
  
  // Simple scoring algorithm
  let score = (totalViews * 0.4) + (uniqueVisitors * 0.4) + (engagement * 0.2)
  return Math.min(Math.round(score), 100)
}

const calculateAverageEngagement = (analytics) => {
  // Simplified engagement calculation
  return analytics.length > 0 ? analytics.reduce((sum, item) => sum + item.views, 0) / analytics.length : 0
}

const getPopularSections = (analytics) => {
  // Extract popular sections from events
  const sectionClicks = {}
  
  analytics.forEach(day => {
    day.events.forEach(event => {
      if (event.type === 'click' && event.element) {
        sectionClicks[event.element] = (sectionClicks[event.element] || 0) + 1
      }
    })
  })
  
  return Object.entries(sectionClicks)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([section, clicks]) => ({ section, clicks }))
}

const generateRecommendations = (portfolio, analytics) => {
  const recommendations = []
  
  // Sample recommendations based on analytics
  if (analytics.length > 0) {
    const recentViews = analytics.slice(-7).reduce((sum, item) => sum + item.views, 0)
    
    if (recentViews < 10) {
      recommendations.push({
        type: 'visibility',
        title: 'Increase Portfolio Visibility',
        description: 'Your portfolio has low traffic. Consider sharing it on social media or with your network.',
        priority: 'high'
      })
    }
    
    if (!portfolio.settings.seo?.description) {
      recommendations.push({
        type: 'seo',
        title: 'Add SEO Description',
        description: 'Adding an SEO description can improve your search engine visibility.',
        priority: 'medium'
      })
    }
  }
  
  return recommendations
}