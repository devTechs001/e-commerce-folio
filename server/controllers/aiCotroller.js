import { generatePortfolioContent, optimizeSEOText } from '../services/aiService.js'
import Portfolio from '../models/Portfolio.js'

export const generateContent = async (req, res) => {
  try {
    const { sectionType, prompt, tone = 'professional' } = req.body
    const { portfolioId } = req.params

    // Get portfolio and user data
    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId: req.user.id
    }).populate('userId', 'profile')

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' })
    }

    const userData = {
      profile: portfolio.userId.profile
    }

    // Generate content using AI
    const content = await generatePortfolioContent(userData, sectionType, prompt, tone)

    res.json({
      success: true,
      content,
      sectionType,
      generatedAt: new Date()
    })
  } catch (error) {
    console.error('AI content generation error:', error)
    res.status(500).json({ 
      error: 'Failed to generate content',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

export const optimizeSEO = async (req, res) => {
  try {
    const { text, keywords } = req.body

    if (!text) {
      return res.status(400).json({ error: 'Text is required' })
    }

    const optimizedText = await optimizeSEOText(text, keywords || [])

    res.json({
      success: true,
      original: text,
      optimized: optimizedText,
      improvements: optimizedText !== text ? 'Text has been optimized for SEO' : 'No optimization needed'
    })
  } catch (error) {
    console.error('SEO optimization error:', error)
    res.status(500).json({ error: 'Failed to optimize SEO' })
  }
}

export const suggestImprovements = async (req, res) => {
  try {
    const { portfolioId } = req.params
    const { sectionType, currentContent } = req.body

    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId: req.user.id
    })

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' })
    }

    // This would integrate with AI service for suggestions
    const suggestions = {
      readability: 'Consider breaking long paragraphs into shorter ones',
      keywords: 'Add more industry-specific keywords',
      structure: 'Use bullet points for better scannability',
      callToAction: 'Include a clear call to action'
    }

    res.json({
      success: true,
      suggestions,
      sectionType,
      generatedAt: new Date()
    })
  } catch (error) {
    console.error('AI suggestions error:', error)
    res.status(500).json({ error: 'Failed to generate suggestions' })
  }
}