import express from 'express'
import { body } from 'express-validator'
import {
  getSubscriptionPlans,
  getUserSubscription,
  upgradeSubscription,
  cancelSubscription
} from '../controllers/subscriptionController.js'
import auth from '../middleware/auth.js'
import { handleValidationErrors } from '../middleware/validation.js'

const router = express.Router()

// @route   GET /api/subscription/plans
// @desc    Get available subscription plans
// @access  Public
router.get('/plans', getSubscriptionPlans)

// Protected routes
router.use(auth)

// @route   GET /api/subscription
// @desc    Get user's subscription
// @access  Private
router.get('/', getUserSubscription)

// @route   POST /api/subscription/upgrade
// @desc    Upgrade subscription plan
// @access  Private
router.post('/upgrade', [
  body('plan').isIn(['free', 'pro', 'enterprise'])
], handleValidationErrors, upgradeSubscription)

// @route   POST /api/subscription/cancel
// @desc    Cancel subscription
// @access  Private
router.post('/cancel', cancelSubscription)

export default router