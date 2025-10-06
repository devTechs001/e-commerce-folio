import express from 'express'
import { body } from 'express-validator'
import {
  generateContent,
  optimizeSEO,
  suggestImprovements
} from '../controllers/aiController.js'
import auth from '../middleware/auth.js'
import { handleValidationErrors } from '../middleware/validation.js'

const router = express.Router()

// All routes are protected
router.use(auth)

// @route   POST /api/ai/portfolio/:portfolioId/generate-content
// @desc    Generate AI content for portfolio section
// @access  Private
router.post('/portfolio/:portfolioId/generate-content', [
  body('sectionType').isIn(['hero', 'about', 'experience', 'education', 'projects', 'skills', 'contact']),
  body('prompt').optional().isLength({ max: 500 }),
  body('tone').optional().isIn(['professional', 'creative', 'casual', 'technical'])
], handleValidationErrors, generateContent)

// @route   POST /api/ai/optimize-seo
// @desc    Optimize text for SEO
// @access  Private
router.post('/optimize-seo', [
  body('text').isLength({ min: 1, max: 2000 }),
  body('keywords').optional().isArray()
], handleValidationErrors, optimizeSEO)

// @route   POST /api/ai/portfolio/:portfolioId/suggest-improvements
// @desc    Get AI suggestions for portfolio improvements
// @access  Private
router.post('/portfolio/:portfolioId/suggest-improvements', [
  body('sectionType').isIn(['hero', 'about', 'experience', 'education', 'projects', 'skills', 'contact']),
  body('currentContent').optional().isLength({ max: 5000 })
], handleValidationErrors, suggestImprovements)

export default router