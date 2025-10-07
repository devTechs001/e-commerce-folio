import express from 'express'
import { body } from 'express-validator'
import {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate,
  toggleLike,
  rateTemplate,
  getMyTemplates,
  getCategories
} from '../controllers/templateController.js'
import { authenticateToken } from '../middleware/auth.js'
import { handleValidationErrors } from '../middleware/validation.js'

const router = express.Router()

// Public routes
router.get('/', getTemplates)
router.get('/categories', getCategories)
router.get('/:id', getTemplate)

// Protected routes
router.use(authenticateToken)

// User templates
router.get('/user/my-templates', getMyTemplates)

// Template CRUD
router.post('/', [
  body('name').notEmpty().trim().isLength({ min: 1, max: 100 }),
  body('description').notEmpty().trim().isLength({ min: 1, max: 500 }),
  body('category').isIn(['minimal', 'creative', 'professional', 'modern', 'bold', 'portfolio'])
], handleValidationErrors, createTemplate)

router.put('/:id', updateTemplate)
router.delete('/:id', deleteTemplate)

// Template actions
router.post('/:id/duplicate', duplicateTemplate)
router.post('/:id/like', [
  body('action').isIn(['like', 'unlike'])
], handleValidationErrors, toggleLike)

router.post('/:id/rate', [
  body('rating').isInt({ min: 1, max: 5 })
], handleValidationErrors, rateTemplate)

export default router