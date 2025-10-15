import api from './api'

/**
 * AI Service for generating intelligent insights and recommendations
 */
class AIService {
  /**
   * Analyze portfolio performance and generate insights
   * @param {Object} analyticsData - Portfolio analytics data
   * @returns {Promise<Array>} AI-generated insights
   */
  async generateInsights(analyticsData) {
    try {
      // In production, this would call an AI API
      // For now, we'll use intelligent analysis logic
      
      const insights = []
      
      // Analyze engagement time
      if (analyticsData.avgEngagementTime) {
        const avgTime = analyticsData.avgEngagementTime
        if (avgTime > 180) {
          insights.push({
            type: 'performance',
            title: 'Excellent Engagement',
            description: `Visitors spend an average of ${Math.round(avgTime / 60)} minutes on your portfolio`,
            recommendation: 'Your content is highly engaging! Consider adding more interactive elements to maintain this.',
            impact: 'high',
            metric: avgTime,
            trend: 'positive'
          })
        } else if (avgTime < 60) {
          insights.push({
            type: 'performance',
            title: 'Low Engagement Time',
            description: `Average engagement time is only ${avgTime} seconds`,
            recommendation: 'Add more compelling content, videos, or interactive elements to increase engagement.',
            impact: 'high',
            metric: avgTime,
            trend: 'negative'
          })
        }
      }
      
      // Analyze traffic sources
      if (analyticsData.trafficSources) {
        const sources = analyticsData.trafficSources
        const totalTraffic = Object.values(sources).reduce((sum, val) => sum + val, 0)
        
        // Check mobile traffic
        const mobilePercent = ((sources.mobile || 0) / totalTraffic) * 100
        if (mobilePercent > 70) {
          insights.push({
            type: 'optimization',
            title: 'High Mobile Traffic',
            description: `${Math.round(mobilePercent)}% of your traffic comes from mobile devices`,
            recommendation: 'Ensure your portfolio is fully optimized for mobile. Test loading speed and responsiveness.',
            impact: 'high',
            metric: mobilePercent,
            trend: 'neutral'
          })
        }
        
        // Check social media traffic
        const socialPercent = ((sources.social || 0) / totalTraffic) * 100
        if (socialPercent < 10 && totalTraffic > 100) {
          insights.push({
            type: 'marketing',
            title: 'Low Social Media Traffic',
            description: `Only ${Math.round(socialPercent)}% of traffic comes from social media`,
            recommendation: 'Share your portfolio on LinkedIn, Twitter, and other platforms to increase visibility.',
            impact: 'medium',
            metric: socialPercent,
            trend: 'negative'
          })
        }
      }
      
      // Analyze bounce rate
      if (analyticsData.bounceRate !== undefined) {
        const bounceRate = analyticsData.bounceRate
        if (bounceRate > 60) {
          insights.push({
            type: 'content',
            title: 'High Bounce Rate',
            description: `${bounceRate}% of visitors leave after viewing only one page`,
            recommendation: 'Improve your landing page content, add clear navigation, and create compelling calls-to-action.',
            impact: 'high',
            metric: bounceRate,
            trend: 'negative'
          })
        } else if (bounceRate < 30) {
          insights.push({
            type: 'content',
            title: 'Excellent Content Quality',
            description: `Low bounce rate of ${bounceRate}% indicates high-quality content`,
            recommendation: 'Keep up the great work! Your content is resonating with visitors.',
            impact: 'low',
            metric: bounceRate,
            trend: 'positive'
          })
        }
      }
      
      // Analyze conversion rate
      if (analyticsData.conversionRate !== undefined) {
        const conversionRate = analyticsData.conversionRate
        if (conversionRate < 2) {
          insights.push({
            type: 'conversion',
            title: 'Low Conversion Rate',
            description: `Only ${conversionRate.toFixed(1)}% of visitors take desired actions`,
            recommendation: 'Add clearer call-to-action buttons, showcase testimonials, and simplify your contact process.',
            impact: 'high',
            metric: conversionRate,
            trend: 'negative'
          })
        } else if (conversionRate > 5) {
          insights.push({
            type: 'conversion',
            title: 'Strong Conversion Performance',
            description: `${conversionRate.toFixed(1)}% conversion rate is above industry average`,
            recommendation: 'Excellent! Consider A/B testing to push this even higher.',
            impact: 'low',
            metric: conversionRate,
            trend: 'positive'
          })
        }
      }
      
      // Analyze page views trend
      if (analyticsData.viewsTrend && analyticsData.viewsTrend.length >= 7) {
        const recent = analyticsData.viewsTrend.slice(-7)
        const previousWeek = analyticsData.viewsTrend.slice(-14, -7)
        
        const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length
        const prevAvg = previousWeek.reduce((sum, val) => sum + val, 0) / previousWeek.length
        
        const growth = ((recentAvg - prevAvg) / prevAvg) * 100
        
        if (growth > 20) {
          insights.push({
            type: 'growth',
            title: 'Rapid Traffic Growth',
            description: `Your traffic has increased by ${Math.round(growth)}% over the past week`,
            recommendation: 'Capitalize on this momentum! Share more content and engage with your audience.',
            impact: 'medium',
            metric: growth,
            trend: 'positive'
          })
        } else if (growth < -20) {
          insights.push({
            type: 'growth',
            title: 'Declining Traffic',
            description: `Traffic has decreased by ${Math.abs(Math.round(growth))}% over the past week`,
            recommendation: 'Refresh your content, promote on social media, and consider SEO optimization.',
            impact: 'high',
            metric: growth,
            trend: 'negative'
          })
        }
      }
      
      // SEO Analysis
      if (analyticsData.seoScore !== undefined) {
        const seoScore = analyticsData.seoScore
        if (seoScore < 60) {
          insights.push({
            type: 'seo',
            title: 'SEO Needs Improvement',
            description: `Your SEO score is ${seoScore}/100`,
            recommendation: 'Add meta descriptions, optimize images, improve page speed, and use relevant keywords.',
            impact: 'high',
            metric: seoScore,
            trend: 'negative'
          })
        } else if (seoScore > 85) {
          insights.push({
            type: 'seo',
            title: 'Excellent SEO Performance',
            description: `Your SEO score of ${seoScore}/100 is exceptional`,
            recommendation: 'Maintain your current SEO practices and continue creating quality content.',
            impact: 'low',
            metric: seoScore,
            trend: 'positive'
          })
        }
      }
      
      // Sort by impact (high first)
      insights.sort((a, b) => {
        const impactOrder = { high: 0, medium: 1, low: 2 }
        return impactOrder[a.impact] - impactOrder[b.impact]
      })
      
      return insights
    } catch (error) {
      console.error('Error generating AI insights:', error)
      return this.getMockInsights()
    }
  }
  
  /**
   * Generate content recommendations based on portfolio data
   * @param {Object} portfolioData - Portfolio content data
   * @returns {Promise<Array>} Content recommendations
   */
  async generateContentRecommendations(portfolioData) {
    try {
      const recommendations = []
      
      // Analyze section completeness
      const sections = portfolioData.sections || []
      const essentialSections = ['hero', 'about', 'projects', 'skills', 'contact']
      const missingSections = essentialSections.filter(section => 
        !sections.some(s => s.type === section)
      )
      
      if (missingSections.length > 0) {
        recommendations.push({
          title: 'Add Missing Sections',
          description: `Your portfolio is missing: ${missingSections.join(', ')}`,
          action: 'Add these sections to make your portfolio more complete',
          priority: 'high'
        })
      }
      
      // Check for project count
      const projectsSection = sections.find(s => s.type === 'projects')
      if (projectsSection) {
        const projectCount = projectsSection.data?.projects?.length || 0
        if (projectCount < 3) {
          recommendations.push({
            title: 'Add More Projects',
            description: `You have ${projectCount} project(s). Aim for at least 3-5`,
            action: 'Showcase more of your work to demonstrate your skills',
            priority: 'medium'
          })
        }
      }
      
      // Check for testimonials
      const hasTestimonials = sections.some(s => s.type === 'testimonials')
      if (!hasTestimonials) {
        recommendations.push({
          title: 'Add Testimonials',
          description: 'Social proof increases credibility',
          action: 'Request testimonials from clients or colleagues',
          priority: 'medium'
        })
      }
      
      return recommendations
    } catch (error) {
      console.error('Error generating content recommendations:', error)
      return []
    }
  }
  
  /**
   * Predict future trends based on historical data
   * @param {Array} historicalData - Historical analytics data
   * @returns {Object} Trend predictions
   */
  predictTrends(historicalData) {
    try {
      if (!historicalData || historicalData.length < 7) {
        return null
      }
      
      // Simple linear regression for trend prediction
      const n = historicalData.length
      const sumX = historicalData.reduce((sum, _, i) => sum + i, 0)
      const sumY = historicalData.reduce((sum, val) => sum + val, 0)
      const sumXY = historicalData.reduce((sum, val, i) => sum + (i * val), 0)
      const sumX2 = historicalData.reduce((sum, _, i) => sum + (i * i), 0)
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
      const intercept = (sumY - slope * sumX) / n
      
      // Predict next 7 days
      const predictions = []
      for (let i = n; i < n + 7; i++) {
        predictions.push(Math.max(0, Math.round(slope * i + intercept)))
      }
      
      return {
        trend: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
        predictions,
        confidence: this.calculateConfidence(historicalData, slope, intercept)
      }
    } catch (error) {
      console.error('Error predicting trends:', error)
      return null
    }
  }
  
  /**
   * Calculate prediction confidence
   */
  calculateConfidence(data, slope, intercept) {
    const predictions = data.map((_, i) => slope * i + intercept)
    const errors = data.map((actual, i) => Math.abs(actual - predictions[i]))
    const avgError = errors.reduce((sum, err) => sum + err, 0) / errors.length
    const avgValue = data.reduce((sum, val) => sum + val, 0) / data.length
    
    const confidence = Math.max(0, Math.min(100, 100 - (avgError / avgValue) * 100))
    return Math.round(confidence)
  }
  
  /**
   * Get mock insights for development
   */
  getMockInsights() {
    return [
      {
        type: 'performance',
        title: 'High Engagement Time',
        description: 'Visitors spend an average of 3.8 minutes on your portfolio',
        recommendation: 'Your content is engaging! Consider adding video content to maintain interest.',
        impact: 'high',
        trend: 'positive'
      },
      {
        type: 'optimization',
        title: 'Mobile Traffic Dominant',
        description: '78% of your traffic comes from mobile devices',
        recommendation: 'Ensure all images are optimized for mobile loading speeds.',
        impact: 'high',
        trend: 'neutral'
      },
      {
        type: 'content',
        title: 'Projects Section Popular',
        description: 'Your projects section gets 45% of total page views',
        recommendation: 'Add more detailed case studies to your top projects.',
        impact: 'medium',
        trend: 'positive'
      }
    ]
  }
}

export const aiService = new AIService()
export default aiService
