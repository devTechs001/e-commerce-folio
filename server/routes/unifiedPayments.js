import express from 'express'
import {
  initiatePayment,
  mpesaCallback,
  stripeWebhook,
  paypalWebhook,
  verifyPayment,
  getPaymentHistory
} from '../controllers/unifiedPaymentController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Initiate payment (protected)
router.post('/initiate', authenticateToken, initiatePayment)

// Payment verification (protected)
router.get('/verify/:paymentId', authenticateToken, verifyPayment)

// Payment history (protected)
router.get('/history', authenticateToken, getPaymentHistory)

// M-Pesa callback (public - called by Safaricom)
router.post('/mpesa/callback', mpesaCallback)

// Stripe webhook (public - called by Stripe)
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook)

// PayPal webhook (public - called by PayPal)
router.post('/paypal/webhook', paypalWebhook)

export default router
