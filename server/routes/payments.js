import express from 'express'
import { body } from 'express-validator'
import {
  createCheckoutSession,
  createPortalSession,
  handleWebhook,
  getSubscriptionStatus
} from '../controllers/paymentController.js'
import auth from '../middleware/auth.js'
import { handleValidationErrors } from '../middleware/validation.js'

const router = express.Router()

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhooks
// @access  Public (Stripe calls this)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook)

// Protected routes
router.use(auth)

// @route   POST /api/payments/create-checkout-session
// @desc    Create Stripe checkout session
// @access  Private
router.post('/create-checkout-session', [
  body('priceId').notEmpty()
], handleValidationErrors, createCheckoutSession)

// @route   POST /api/payments/create-portal-session
// @desc    Create Stripe customer portal session
// @access  Private
router.post('/create-portal-session', createPortalSession)

// @route   GET /api/payments/subscription-status
// @desc    Get user subscription status
// @access  Private
router.get('/subscription-status', getSubscriptionStatus)

export default router