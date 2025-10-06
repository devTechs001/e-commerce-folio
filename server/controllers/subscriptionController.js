import Subscription from '../models/Subscription.js'
import User from '../models/User.js'

export const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        features: [
          '1 Portfolio',
          'Basic Templates',
          'Standard Support',
          'Basic Analytics'
        ],
        limitations: {
          portfolios: 1,
          collaborators: 0,
          customDomain: false,
          advancedAnalytics: false
        }
      },
      {
        id: 'pro',
        name: 'Professional',
        price: 19.99,
        features: [
          '5 Portfolios',
          'All Templates',
          'Priority Support',
          'Advanced Analytics',
          'Custom Domain',
          'Team Collaboration'
        ],
        limitations: {
          portfolios: 5,
          collaborators: 3,
          customDomain: true,
          advancedAnalytics: true
        }
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 49.99,
        features: [
          'Unlimited Portfolios',
          'All Templates + Custom',
          '24/7 Support',
          'Advanced Analytics',
          'Multiple Custom Domains',
          'Unlimited Collaboration',
          'White-label Options'
        ],
        limitations: {
          portfolios: -1, // unlimited
          collaborators: -1, // unlimited
          customDomain: true,
          advancedAnalytics: true
        }
      }
    ]

    res.json({ plans })
  } catch (error) {
    console.error('Get subscription plans error:', error)
    res.status(500).json({ error: 'Failed to fetch subscription plans' })
  }
}

export const getUserSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('subscription')
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Get subscription details
    const subscription = await Subscription.findOne({ userId: req.user.id })

    res.json({
      subscription: user.subscription,
      details: subscription || null,
      isActive: user.subscription.status === 'active',
      canUpgrade: user.subscription.plan === 'free'
    })
  } catch (error) {
    console.error('Get user subscription error:', error)
    res.status(500).json({ error: 'Failed to fetch subscription' })
  }
}

export const upgradeSubscription = async (req, res) => {
  try {
    const { plan } = req.body

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Validate plan
    const validPlans = ['free', 'pro', 'enterprise']
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ error: 'Invalid subscription plan' })
    }

    // Update user subscription
    user.subscription.plan = plan
    user.subscription.status = plan === 'free' ? 'active' : 'pending_payment'
    
    await user.save()

    // Create or update subscription record
    await Subscription.findOneAndUpdate(
      { userId: req.user.id },
      {
        plan,
        status: plan === 'free' ? 'active' : 'pending_payment',
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    )

    res.json({
      success: true,
      message: `Subscription updated to ${plan} plan`,
      subscription: user.subscription
    })
  } catch (error) {
    console.error('Upgrade subscription error:', error)
    res.status(500).json({ error: 'Failed to upgrade subscription' })
  }
}

export const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Downgrade to free plan
    user.subscription.plan = 'free'
    user.subscription.status = 'active'
    user.subscription.stripeSubscriptionId = null
    
    await user.save()

    // Update subscription record
    await Subscription.findOneAndUpdate(
      { userId: req.user.id },
      {
        plan: 'free',
        status: 'active',
        canceledAt: new Date()
      }
    )

    res.json({
      success: true,
      message: 'Subscription canceled successfully',
      subscription: user.subscription
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    res.status(500).json({ error: 'Failed to cancel subscription' })
  }
}