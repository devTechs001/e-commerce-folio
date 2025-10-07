import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import User from '../models/User.js'

const router = express.Router()

// Get billing history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    
    // Mock billing history
    const history = [
      {
        id: 'inv_001',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        amount: 12.00,
        status: 'paid',
        plan: 'Pro',
        description: 'Monthly subscription'
      },
      {
        id: 'inv_002',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        amount: 12.00,
        status: 'paid',
        plan: 'Pro',
        description: 'Monthly subscription'
      }
    ]

    const paymentMethod = {
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2025
    }

    res.json({
      history,
      paymentMethod,
      nextBilling: user.subscription?.currentPeriodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    })
  } catch (error) {
    console.error('Billing history error:', error)
    res.status(500).json({ error: 'Failed to fetch billing history' })
  }
})

// Update payment method
router.put('/payment-method', authenticateToken, async (req, res) => {
  try {
    const { paymentMethodId } = req.body
    
    // In a real app, you'd update the Stripe customer's payment method
    // For now, just return success
    
    res.json({ 
      success: true,
      message: 'Payment method updated successfully'
    })
  } catch (error) {
    console.error('Update payment method error:', error)
    res.status(500).json({ error: 'Failed to update payment method' })
  }
})

// Cancel subscription
router.post('/cancel', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    
    // Update user subscription status
    user.subscription.status = 'canceled'
    await user.save()
    
    res.json({ 
      success: true,
      message: 'Subscription canceled successfully'
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    res.status(500).json({ error: 'Failed to cancel subscription' })
  }
})

export default router
