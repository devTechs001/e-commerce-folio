import cron from 'node-cron'
import Portfolio from '../models/Portfolio.js'
import { analyzePortfolioContent, generateKeywords } from '../utils/aiHelpers.js'

// Analyze portfolio content for SEO improvements
export const setupSEOAnalysisJob = () => {
  cron.schedule('0 6 * * *', async () => { // Daily at 6:00 AM
    try {
      console.log('Starting SEO analysis job...')
      
      // Get portfolios that haven't been analyzed in the last 7 days
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      
      const portfolios = await Portfolio.find({
        $or: [
          { 'settings.seo.lastAnalyzed': { $lt: oneWeekAgo } },
          { 'settings.seo.lastAnalyzed': { $exists: false } }
        ],
        'settings.isPublished': true
      }).limit(50) // Process max 50 portfolios per run
      
      let processed = 0
      let improved = 0
      
      for (const portfolio of portfolios) {
        try {
          // Extract content from portfolio sections
          const content = portfolio.sections
            .filter(section => section.isVisible && section.data)
            .map(section => section.data.content || section.data.description)
            .filter(Boolean)
            .join(' ')
          
          if (content) {
            // Analyze content
            const analysis = await analyzePortfolioContent({ content })
            
            // Generate keywords
            const keywords = await generateKeywords(content, 15)
            
            // Update portfolio with SEO data
            portfolio.settings.seo = {
              ...portfolio.settings.seo,
              keywords: keywords,
              readability: analysis.readability,
              score: analysis.score,
              lastAnalyzed: new Date(),
              suggestions: analysis.suggestions
            }
            
            await portfolio.save()
            improved++
          }
          
          processed++
        } catch (portfolioError) {
          console.error(`Error processing portfolio ${portfolio._id}:`, portfolioError)
        }
      }
      
      console.log(`SEO analysis completed. Processed: ${processed}, Improved: ${improved}`)
    } catch (error) {
      console.error('SEO analysis job error:', error)
    }
  })
}

// Generate content suggestions for inactive portfolios
export const setupContentSuggestionJob = () => {
  cron.schedule('0 12 * * 0', async () => { // Every Sunday at noon
    try {
      console.log('Starting content suggestion job...')
      
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      // Find portfolios with low engagement
      const inactivePortfolios = await Portfolio.find({
        'analytics.lastViewed': { $lt: oneMonthAgo },
        'settings.isPublished': true
      }).limit(20)
      
      let suggestionsGenerated = 0
      
      for (const portfolio of inactivePortfolios) {
        try {
          // Generate improvement suggestions
          const suggestions = await generatePortfolioSuggestions(portfolio)
          
          // Store suggestions (could be sent via email or in-app notification)
          portfolio.settings.improvementSuggestions = suggestions
          portfolio.settings.suggestionsGeneratedAt = new Date()
          
          await portfolio.save()
          suggestionsGenerated++
        } catch (portfolioError) {
          console.error(`Error generating suggestions for portfolio ${portfolio._id}:`, portfolioError)
        }
      }
      
      console.log(`Content suggestion job completed. Generated: ${suggestionsGenerated} suggestions`)
    } catch (error) {
      console.error('Content suggestion job error:', error)
    }
  })
}

// Process bulk AI operations during off-peak hours
export const setupBulkAIProcessingJob = () => {
  cron.schedule('0 3 * * *', async () => { // Daily at 3:00 AM
    try {
      console.log('Starting bulk AI processing job...')
      
      // This would process queued AI operations
      // For now, it's a placeholder for future bulk processing
      
      console.log('Bulk AI processing completed')
    } catch (error) {
      console.error('Bulk AI processing job error:', error)
    }
  })
}

// Helper function to generate portfolio suggestions
const generatePortfolioSuggestions = async (portfolio) => {
  // This would use AI to generate specific suggestions
  // For now, return generic suggestions based on portfolio data
  
  const suggestions = []
  
  // Check for missing sections
  const sectionTypes = portfolio.sections.map(s => s.type)
  
  if (!sectionTypes.includes('projects')) {
    suggestions.push('Consider adding a projects section to showcase your work')
  }
  
  if (!sectionTypes.includes('skills')) {
    suggestions.push('Add a skills section to highlight your expertise')
  }
  
  if (!sectionTypes.includes('contact')) {
    suggestions.push('Include a contact section to make it easy for visitors to reach you')
  }
  
  // Check for content quality
  const totalContent = portfolio.sections
    .filter(s => s.data)
    .reduce((total, section) => {
      return total + (section.data.content?.length || 0) + (section.data.description?.length || 0)
    }, 0)
  
  if (totalContent < 500) {
    suggestions.push('Add more detailed content to better engage visitors')
  }
  
  return suggestions.slice(0, 5) // Return top 5 suggestions
}

// Initialize all AI processing jobs
export const initializeAIJobs = () => {
  setupSEOAnalysisJob()
  setupContentSuggestionJob()
  setupBulkAIProcessingJob()
  console.log('🤖 AI processing jobs initialized')
}