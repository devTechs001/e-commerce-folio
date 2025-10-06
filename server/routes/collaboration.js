import express from 'express'
import { body } from 'express-validator'
import {
  addCollaborator,
  removeCollaborator,
  updateCollaboratorRole,
  getCollaborators
} from '../controllers/collaborationController.js'
import auth from '../middleware/auth.js'
import { handleValidationErrors } from '../middleware/validation.js'

const router = express.Router()

// All routes are protected
router.use(auth)

// @route   POST /api/collaboration/portfolio/:portfolioId/collaborators
// @desc    Add collaborator to portfolio
// @access  Private
router.post('/portfolio/:portfolioId/collaborators', [
  body('email').isEmail().normalizeEmail(),
  body('role').isIn(['viewer', 'editor', 'admin'])
], handleValidationErrors, addCollaborator)

// @route   GET /api/collaboration/portfolio/:portfolioId/collaborators
// @desc    Get portfolio collaborators
// @access  Private
router.get('/portfolio/:portfolioId/collaborators', getCollaborators)

// @route   PUT /api/collaboration/portfolio/:portfolioId/collaborators/:userId
// @desc    Update collaborator role
// @access  Private
router.put('/portfolio/:portfolioId/collaborators/:userId', [
  body('role').isIn(['viewer', 'editor', 'admin'])
], handleValidationErrors, updateCollaboratorRole)

// @route   DELETE /api/collaboration/portfolio/:portfolioId/collaborators/:userId
// @desc    Remove collaborator from portfolio
// @access  Private
router.delete('/portfolio/:portfolioId/collaborators/:userId', removeCollaborator)

export default router