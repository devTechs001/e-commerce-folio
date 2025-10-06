import stripe from '../config/stripe.js'
import User from '../models/User.js'

export const createCheckoutSession = async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.CLIENT_URL}/dashboard?success=true`,
      cancel_url: cancelUrl || `${process.env.CLIENT_URL}/pricing?canceled=true`,
      customer_email: req.user.email,
      client_reference_id: req.user.id,
      metadata: {
        userId: req.user.id
      }
    })

    res.json({ sessionId: session.id })
  } catch (error) {
    console.error('Create checkout session error:', error)
    res.status(500).json({ error: 'Server error creating checkout session' })
  }
}

export const createPortalSession = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    
    if (!user.subscription.stripeCustomerId) {
      return res.status(400).json({ error: 'No subscription found' })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.subscription.stripeCustomerId,
      return_url: `${process.env.CLIENT_URL}/dashboard/settings`,
    })

    res.json({ url: session.url })
  } catch (error) {
    console.error('Create portal session error:', error)
    res.status(500).json({ error: 'Server error creating portal session' })
  }
}

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
}

const handleCheckoutSessionCompleted = async (session) => {
  const userId = session.client_reference_id
  const subscription = await stripe.subscriptions.retrieve(session.subscription)

  await User.findByIdAndUpdate(userId, {
    $set: {
      'subscription.plan': 'pro',
      'subscription.status': 'active',
      'subscription.stripeCustomerId': session.customer,
      'subscription.stripeSubscriptionId': session.subscription,
      'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000)
    }
  })
}

const handleSubscriptionUpdated = async (subscription) => {
  const user = await User.findOne({
    'subscription.stripeSubscriptionId': subscription.id
  })

  if (user) {
    user.subscription.status = subscription.status
    user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000)
    await user.save()
  }
}

const handleSubscriptionDeleted = async (subscription) => {
  const user = await User.findOne({
    'subscription.stripeSubscriptionId': subscription.id
  })

  if (user) {
    user.subscription.plan = 'free'
    user.subscription.status = 'inactive'
    user.subscription.stripeSubscriptionId = null
    await user.save()
  }
}

export const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    
    res.json({
      subscription: user.subscription,
      isActive: user.subscription.status === 'active'
    })
  } catch (error) {
    console.error('Get subscription status error:', error)
    res.status(500).json({ error: 'Server error fetching subscription status' })
  }
}