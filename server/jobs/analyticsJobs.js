import cron from 'node-cron'
import Analytics from '../models/Analytics.js'
import Portfolio from '../models/Portfolio.js'

// Generate daily analytics summaries
export const setupDailyAnalyticsJob = () => {
  cron.schedule('0 1 * * *', async () => { // Daily at 1:00 AM
    try {
      console.log('Starting daily analytics summary job...')
      
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      // Get all published portfolios
      const portfolios = await Portfolio.find({
        'settings.isPublished': true
      })
      
      let processed = 0
      let created = 0
      
      for (const portfolio of portfolios) {
        try {
          // Check if analytics record already exists for today
          const existingAnalytics = await Analytics.findOne({
            portfolioId: portfolio._id,
            date: today
          })
          
          if (!existingAnalytics) {
            // Create a new analytics record for today
            await Analytics.create({
              portfolioId: portfolio._id,
              date: today,
              views: 0,
              uniqueVisitors: 0,
              sources: {
                direct: 0,
                organic: 0,
                social: 0,
                referral: 0
              }
            })
            created++
          }
          
          processed++
        } catch (portfolioError) {
          console.error(`Error processing portfolio ${portfolio._id}:`, portfolioError)
        }
      }
      
      console.log(`Daily analytics summary completed. Processed: ${processed}, Created: ${created}`)
    } catch (error) {
      console.error('Daily analytics job error:', error)
    }
  })
}

// Calculate portfolio popularity scores
export const setupPopularityCalculationJob = () => {
  cron.schedule('0 3 * * *', async () => { // Daily at 3:00 AM
    try {
      console.log('Starting popularity calculation job...')
      
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      // Aggregate views and unique visitors for the past 30 days
      const popularPortfolios = await Analytics.aggregate([
        {
          $match: {
            date: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: '$portfolioId',
            totalViews: { $sum: '$views' },
            totalUniqueVisitors: { $sum: '$uniqueVisitors' },
            averageDailyViews: { $avg: '$views' }
          }
        },
        {
          $sort: { totalViews: -1 }
        },
        {
          $limit: 100
        }
      ])
      
      // Update portfolios with popularity score
      for (const stats of popularPortfolios) {
        try {
          const popularityScore = calculatePopularityScore(stats)
          
          await Portfolio.findByIdAndUpdate(stats._id, {
            $set: {
              'analytics.popularityScore': popularityScore,
              'analytics.lastCalculated': new Date()
            }
          })
        } catch (updateError) {
          console.error(`Error updating portfolio ${stats._id}:`, updateError)
        }
      }
      
      console.log(`Popularity calculation completed. Processed: ${popularPortfolios.length} portfolios`)
    } catch (error) {
      console.error('Popularity calculation job error:', error)
    }
  })
}

// Clean up visitor IP data for privacy (keep for 30 days only)
export const setupVisitorDataCleanupJob = () => {
  cron.schedule('0 4 * * 0', async () => { // Every Sunday at 4:00 AM
    try {
      console.log('Starting visitor data cleanup job...')
      
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      const result = await Analytics.updateMany(
        {
          date: { $lt: thirtyDaysAgo }
        },
        {
          $set: {
            visitors: [] // Remove IP addresses and personal data
          }
        }
      )
      
      console.log(`Visitor data cleanup completed. Updated ${result.modifiedCount} records.`)
    } catch (error) {
      console.error('Visitor data cleanup job error:', error)
    }
  })
}

// Helper function to calculate popularity score
const calculatePopularityScore = (stats) => {
  const { totalViews, totalUniqueVisitors, averageDailyViews } = stats
  
  // Simple scoring algorithm
  const viewScore = Math.min(totalViews / 1000, 10) // Max 10 points for views
  const uniqueVisitorScore = Math.min(totalUniqueVisitors / 100, 5) // Max 5 points for unique visitors
  const consistencyScore = Math.min(averageDailyViews * 10, 5) // Max 5 points for consistency
  
  return Math.round((viewScore + uniqueVisitorScore + consistencyScore) * 10) / 10
}

// Initialize all analytics jobs
export const initializeAnalyticsJobs = () => {
  setupDailyAnalyticsJob()
  setupPopularityCalculationJob()
  setupVisitorDataCleanupJob()
  console.log('📊 Analytics jobs initialized')
}