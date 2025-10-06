import express from 'express'
import { body } from 'express-validator'
import {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  rateTemplate
} from '../controllers/templateController.js'
import auth from '../middleware/auth.js'
import { handleValidationErrors } from '../middleware/validation.js'

const router = express.Router()

// @route   GET /api/templates
// @desc    Get all templates
// @access  Public
router.get('/', getTemplates)

// @route   GET /api/templates/:templateId
// @desc    Get specific template
// @access  Public
router.get('/:templateId', getTemplate)

// Protected routes
router.use(auth)

// @route   POST /api/templates
// @desc    Create a new template (admin/creator)
// @access  Private
router.post('/', [
  body('name').notEmpty().trim().isLength({ min: 1, max: 100 }),
  body('description').notEmpty().trim().isLength({ min: 1, max: 500 }),
  body('category').isIn(['minimal', 'creative', 'professional', 'modern', 'bold']),
  body('price').isFloat({ min: 0 }),
  body('previewImage').notEmpty()
], handleValidationErrors, createTemplate)

// @route   PUT /api/templates/:templateId
// @desc    Update template
// @access  Private
router.put('/:templateId', updateTemplate)

// @route   POST /api/templates/:templateId/rate
// @desc    Rate a template
// @access  Private
router.post('/:templateId/rate', [
  body('rating').isInt({ min: 1, max: 5 })
], handleValidationErrors, rateTemplate)

export default router