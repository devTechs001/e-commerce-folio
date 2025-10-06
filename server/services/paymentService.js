import stripe from '../config/stripe.js'
import Payment from '../models/Payment.js'
import User from '../models/User.js'
import Subscription from '../models/Subscription.js'

export const createPaymentIntent = async (userId, plan, paymentMethod = 'card') => {
  try {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const planPrices = {
      pro: 1999, // $19.99 in cents
      enterprise: 4999 // $49.99 in cents
    }

    const amount = planPrices[plan]
    if (!amount) {
      throw new Error('Invalid plan')
    }

    // Create Stripe customer if not exists
    let stripeCustomerId = user.subscription.stripeCustomerId
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.profile.firstName} ${user.profile.lastName}`,
        metadata: {
          userId: user._id.toString()
        }
      })
      stripeCustomerId = customer.id

      // Update user with Stripe customer ID
      await User.findByIdAndUpdate(userId, {
        'subscription.stripeCustomerId': stripeCustomerId
      })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: stripeCustomerId,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: user._id.toString(),
        plan: plan
      }
    })

    // Create payment record
    const payment = new Payment({
      userId,
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId,
      amount,
      plan,
      paymentMethod,
      billingPeriod: {
        start: new Date(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    })

    await payment.save()

    return {
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    }
  } catch (error) {
    console.error('Create payment intent error:', error)
    throw error
  }
}

export const handlePaymentSuccess = async (paymentIntentId) => {
  try {
    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId })
    if (!payment) {
      throw new Error('Payment not found')
    }

    // Mark payment as successful
    payment.status = 'succeeded'
    await payment.save()

    // Update user subscription
    const user = await User.findById(payment.userId)
    user.subscription.plan = payment.plan
    user.subscription.status = 'active'
    user.subscription.currentPeriodEnd = payment.billingPeriod.end
    await user.save()

    // Update subscription record
    await Subscription.findOneAndUpdate(
      { userId: payment.userId },
      {
        plan: payment.plan,
        status: 'active',
        currentPeriodStart: payment.billingPeriod.start,
        currentPeriodEnd: payment.billingPeriod.end,
        stripeCustomerId: payment.stripeCustomerId,
        price: payment.amount
      },
      { upsert: true, new: true }
    )

    return payment
  } catch (error) {
    console.error('Handle payment success error:', error)
    throw error
  }
}

export const handlePaymentFailure = async (paymentIntentId, error) => {
  try {
    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId })
    if (!payment) {
      throw new Error('Payment not found')
    }

    payment.status = 'failed'
    payment.error = {
      code: error.code,
      message: error.message
    }
    await payment.save()

    return payment
  } catch (error) {
    console.error('Handle payment failure error:', error)
    throw error
  }
}

export const getPaymentHistory = async (userId, limit = 10, page = 1) => {
  try {
    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Payment.countDocuments({ userId })

    return {
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }
  } catch (error) {
    console.error('Get payment history error:', error)
    throw error
  }
}

export const refundPayment = async (paymentId, reason = 'requested_by_customer') => {
  try {
    const payment = await Payment.findById(paymentId)
    if (!payment) {
      throw new Error('Payment not found')
    }

    if (payment.status !== 'succeeded') {
      throw new Error('Only successful payments can be refunded')
    }

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      reason
    })

    // Update payment status
    payment.status = 'refunded'
    await payment.save()

    // Downgrade user subscription
    await User.findByIdAndUpdate(payment.userId, {
      'subscription.plan': 'free',
      'subscription.status': 'active'
    })

    await Subscription.findOneAndUpdate(
      { userId: payment.userId },
      {
        plan: 'free',
        status: 'active'
      }
    )

    return refund
  } catch (error) {
    console.error('Refund payment error:', error)
    throw error
  }
}