import cron from 'node-cron'
import User from '../models/User.js'
import Portfolio from '../models/Portfolio.js'
import Analytics from '../models/Analytics.js'
import { sendWeeklyAnalytics } from '../services/notificationService.js'

// Send weekly analytics emails every Monday at 9 AM
export const setupWeeklyAnalyticsJob = () => {
  cron.schedule('0 9 * * 1', async () => { // Every Monday at 9:00 AM
    try {
      console.log('Starting weekly analytics email job...')
      
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      
      // Get all users with published portfolios
      const users = await User.find({
        'preferences.notifications.portfolioViews': true
      })
      
      for (const user of users) {
        try {
          const portfolios = await Portfolio.find({
            userId: user._id,
            'settings.isPublished': true
          })
          
          for (const portfolio of portfolios) {
            // Get analytics for the past week
            const analytics = await Analytics.find({
              portfolioId: portfolio._id,
              date: { $gte: oneWeekAgo }
            })
            
            const weeklyStats = {
              views: analytics.reduce((sum, item) => sum + item.views, 0),
              uniqueVisitors: analytics.reduce((sum, item) => sum + item.uniqueVisitors, 0)
            }
            
            // Only send email if there was activity
            if (weeklyStats.views > 0) {
              await sendWeeklyAnalytics(user, portfolio, weeklyStats)
            }
          }
        } catch (userError) {
          console.error(`Error processing user ${user._id}:`, userError)
        }
      }
      
      console.log('Weekly analytics email job completed')
    } catch (error) {
      console.error('Weekly analytics job error:', error)
    }
  })
}

// Clean up old analytics data (keep only 1 year)
export const setupAnalyticsCleanupJob = () => {
  cron.schedule('0 2 * * 0', async () => { // Every Sunday at 2:00 AM
    try {
      console.log('Starting analytics cleanup job...')
      
      const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      
      const result = await Analytics.deleteMany({
        date: { $lt: oneYearAgo }
      })
      
      console.log(`Analytics cleanup completed. Deleted ${result.deletedCount} records.`)
    } catch (error) {
      console.error('Analytics cleanup job error:', error)
    }
  })
}

// Send trial expiration reminders
export const setupTrialReminderJob = () => {
  cron.schedule('0 10 * * *', async () => { // Daily at 10:00 AM
    try {
      console.log('Starting trial reminder job...')
      
      const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      
      // This would check for users with expiring trials
      // For now, it's a placeholder for future implementation
      
      console.log('Trial reminder job completed')
    } catch (error) {
      console.error('Trial reminder job error:', error)
    }
  })
}

// Initialize all email jobs
export const initializeEmailJobs = () => {
  setupWeeklyAnalyticsJob()
  setupAnalyticsCleanupJob()
  setupTrialReminderJob()
  console.log('📧 Email jobs initialized')
}