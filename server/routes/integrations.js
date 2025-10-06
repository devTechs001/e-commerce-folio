import express from 'express'
import { body } from 'express-validator'
import {
  getIntegrations,
  connectIntegration,
  disconnectIntegration,
  syncToPlatform
} from '../controllers/integrationController.js'
import auth from '../middleware/auth.js'
import { handleValidationErrors } from '../middleware/validation.js'

const router = express.Router()

// All routes are protected
router.use(auth)

// @route   GET /api/integrations
// @desc    Get user's integrations
// @access  Private
router.get('/', getIntegrations)

// @route   POST /api/integrations/connect
// @desc    Connect a new integration
// @access  Private
router.post('/connect', [
  body('platform').isIn(['linkedin', 'github', 'wordpress', 'medium', 'behance', 'dribbble']),
  body('credentials').isObject(),
  body('settings').optional().isObject()
], handleValidationErrors, connectIntegration)

// @route   DELETE /api/integrations/:integrationId
// @desc    Disconnect integration
// @access  Private
router.delete('/:integrationId', disconnectIntegration)

// @route   POST /api/integrations/:integrationId/sync/:portfolioId
// @desc    Sync portfolio to platform
// @access  Private
router.post('/:integrationId/sync/:portfolioId', syncToPlatform)

export default router