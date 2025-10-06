import Analytics from '../models/Analytics.js'
import Portfolio from '../models/Portfolio.js'

export const getPortfolioAnalytics = async (req, res) => {
  try {
    const { portfolioId } = req.params
    const { period = '7d' } = req.query

    // Verify portfolio belongs to user
    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId: req.user.id
    })

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' })
    }

    // Calculate date range based on period
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case '1d':
        startDate.setDate(now.getDate() - 1)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Get analytics data
    const analytics = await Analytics.find({
      portfolioId,
      date: { $gte: startDate, $lte: now }
    }).sort({ date: 1 })

    // Calculate summary
    const summary = {
      totalViews: analytics.reduce((sum, item) => sum + item.views, 0),
      totalUniqueVisitors: analytics.reduce((sum, item) => sum + item.uniqueVisitors, 0),
      averageViews: analytics.length > 0 ? 
        Math.round(analytics.reduce((sum, item) => sum + item.views, 0) / analytics.length) : 0
    }

    // Get traffic sources
    const sources = {
      direct: analytics.reduce((sum, item) => sum + (item.sources?.direct || 0), 0),
      organic: analytics.reduce((sum, item) => sum + (item.sources?.organic || 0), 0),
      social: analytics.reduce((sum, item) => sum + (item.sources?.social || 0), 0),
      referral: analytics.reduce((sum, item) => sum + (item.sources?.referral || 0), 0)
    }

    res.json({
      analytics: analytics.map(a => ({
        date: a.date,
        views: a.views,
        uniqueVisitors: a.uniqueVisitors
      })),
      summary,
      sources
    })
  } catch (error) {
    console.error('Get analytics error:', error)
    res.status(500).json({ error: 'Server error fetching analytics' })
  }
}

export const trackPortfolioView = async (req, res) => {
  try {
    const { portfolioId } = req.params
    const { ip, userAgent, referrer, country, city } = req.body

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Find or create analytics record for today
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

    // Increment views
    analytics.views += 1

    // Check if this is a unique visitor
    const isUniqueVisitor = !analytics.visitors.some(
      visitor => visitor.ip === ip && 
                visitor.userAgent === userAgent
    )

    if (isUniqueVisitor) {
      analytics.uniqueVisitors += 1
      analytics.visitors.push({
        ip,
        userAgent,
        referrer,
        country,
        city,
        timestamp: new Date()
      })
    }

    // Update traffic sources
    if (referrer) {
      if (referrer === 'direct') {
        analytics.sources.direct += 1
      } else if (referrer.includes('google') || referrer.includes('bing')) {
        analytics.sources.organic += 1
      } else if (referrer.includes('facebook') || referrer.includes('twitter')) {
        analytics.sources.social += 1
      } else {
        analytics.sources.referral += 1
      }
    } else {
      analytics.sources.direct += 1
    }

    await analytics.save()

    res.json({ message: 'View tracked successfully' })
  } catch (error) {
    console.error('Track view error:', error)
    res.status(500).json({ error: 'Server error tracking view' })
  }
}

export const getPopularPortfolios = async (req, res) => {
  try {
    const { limit = 10 } = req.query

    const popularPortfolios = await Analytics.aggregate([
      {
        $match: {
          date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        }
      },
      {
        $group: {
          _id: '$portfolioId',
          totalViews: { $sum: '$views' },
          totalUniqueVisitors: { $sum: '$uniqueVisitors' }
        }
      },
      {
        $sort: { totalViews: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $lookup: {
          from: 'portfolios',
          localField: '_id',
          foreignField: '_id',
          as: 'portfolio'
        }
      },
      {
        $unwind: '$portfolio'
      },
      {
        $project: {
          portfolioId: '$_id',
          title: '$portfolio.title',
          slug: '$portfolio.slug',
          totalViews: 1,
          totalUniqueVisitors: 1
        }
      }
    ])

    res.json({ portfolios: popularPortfolios })
  } catch (error) {
    console.error('Get popular portfolios error:', error)
    res.status(500).json({ error: 'Server error fetching popular portfolios' })
  }
}