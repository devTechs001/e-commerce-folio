import express from 'express'
import {
  getPortfolioAnalytics,
  trackPortfolioView,
  getPopularPortfolios
} from '../controllers/analyticsController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// Protected routes
router.use(auth)

// @route   GET /api/analytics/portfolio/:portfolioId
// @desc    Get portfolio analytics
// @access  Private
router.get('/portfolio/:portfolioId', getPortfolioAnalytics)

// @route   POST /api/analytics/portfolio/:portfolioId/track
// @desc    Track portfolio view
// @access  Public (for embedded portfolios)
router.post('/portfolio/:portfolioId/track', trackPortfolioView)

// @route   GET /api/analytics/popular
// @desc    Get popular portfolios
// @access  Private
router.get('/popular', getPopularPortfolios)

export default router