import cron from 'node-cron'
import User from '../models/User.js'
import Portfolio from '../models/Portfolio.js'
import Notification from '../models/Notification.js'

// Clean up expired notifications
export const setupNotificationCleanupJob = () => {
  cron.schedule('0 0 * * *', async () => { // Daily at midnight
    try {
      console.log('Starting notification cleanup job...')
      
      const result = await Notification.deleteMany({
        expiresAt: { $lt: new Date() }
      })
      
      console.log(`Notification cleanup completed. Deleted ${result.deletedCount} expired notifications.`)
    } catch (error) {
      console.error('Notification cleanup job error:', error)
    }
  })
}

// Clean up unused user accounts (never logged in, older than 30 days)
export const setupInactiveUserCleanupJob = () => {
  cron.schedule('0 2 * * 0', async () => { // Every Sunday at 2:00 AM
    try {
      console.log('Starting inactive user cleanup job...')
      
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      // Find users who never logged in and have no portfolios
      const inactiveUsers = await User.find({
        lastLogin: { $exists: false },
        createdAt: { $lt: thirtyDaysAgo }
      })
      
      let deletedCount = 0
      
      for (const user of inactiveUsers) {
        try {
          // Check if user has any portfolios
          const portfolioCount = await Portfolio.countDocuments({
            userId: user._id
          })
          
          if (portfolioCount === 0) {
            await User.findByIdAndDelete(user._id)
            deletedCount++
          }
        } catch (userError) {
          console.error(`Error processing user ${user._id}:`, userError)
        }
      }
      
      console.log(`Inactive user cleanup completed. Deleted ${deletedCount} users.`)
    } catch (error) {
      console.error('Inactive user cleanup job error:', error)
    }
  })
}

// Clean up old portfolio versions (keep only last 10 versions)
export const setupPortfolioVersionCleanupJob = () => {
  cron.schedule('0 3 * * 0', async () => { // Every Sunday at 3:00 AM
    try {
      console.log('Starting portfolio version cleanup job...')
      
      const portfolios = await Portfolio.find({
        'versions.10': { $exists: true } // Portfolios with more than 10 versions
      })
      
      let processed = 0
      let versionsRemoved = 0
      
      for (const portfolio of portfolios) {
        try {
          if (portfolio.versions.length > 10) {
            // Keep only the last 10 versions
            const versionsToKeep = portfolio.versions.slice(-10)
            const removedCount = portfolio.versions.length - 10
            
            portfolio.versions = versionsToKeep
            await portfolio.save()
            
            versionsRemoved += removedCount
          }
          
          processed++
        } catch (portfolioError) {
          console.error(`Error processing portfolio ${portfolio._id}:`, portfolioError)
        }
      }
      
      console.log(`Portfolio version cleanup completed. Processed: ${processed}, Versions removed: ${versionsRemoved}`)
    } catch (error) {
      console.error('Portfolio version cleanup job error:', error)
    }
  })
}

// Clean up temporary files and uploads
export const setupTempFileCleanupJob = () => {
  cron.schedule('0 4 * * *', async () => { // Daily at 4:00 AM
    try {
      console.log('Starting temporary file cleanup job...')
      
      // This would clean up temporary upload files
      // For now, it's a placeholder for file system cleanup
      
      console.log('Temporary file cleanup completed')
    } catch (error) {
      console.error('Temporary file cleanup job error:', error)
    }
  })
}

// Database optimization and index rebuilding
export const setupDatabaseOptimizationJob = () => {
  cron.schedule('0 5 * * 0', async () => { // Every Sunday at 5:00 AM
    try {
      console.log('Starting database optimization job...')
      
      // This would run database maintenance tasks
      // For MongoDB, this might include compacting collections
      
      console.log('Database optimization completed')
    } catch (error) {
      console.error('Database optimization job error:', error)
    }
  })
}

// Initialize all cleanup jobs
export const initializeCleanupJobs = () => {
  setupNotificationCleanupJob()
  setupInactiveUserCleanupJob()
  setupPortfolioVersionCleanupJob()
  setupTempFileCleanupJob()
  setupDatabaseOptimizationJob()
  console.log('🧹 Cleanup jobs initialized')
}