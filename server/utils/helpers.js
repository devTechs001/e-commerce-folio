import jwt from 'jsonwebtoken'

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate random slug
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100)
}

// Format portfolio data for response
export const formatPortfolioResponse = (portfolio) => {
  return {
    id: portfolio._id,
    title: portfolio.title,
    slug: portfolio.slug,
    sections: portfolio.sections,
    styles: portfolio.styles,
    settings: portfolio.settings,
    analytics: portfolio.analytics,
    createdAt: portfolio.createdAt,
    updatedAt: portfolio.updatedAt
  }
}

// Calculate reading time for content
export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Sanitize HTML (basic)
export const sanitizeHTML = (html) => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
}