import { mpesaService } from '../services/mpesaService.js'
import { stripeService } from '../services/stripeService.js'
import { paypalService } from '../services/paypalService.js'
import { smsService } from '../services/smsService.js'
import Payment from '../models/Payment.js'
import User from '../models/User.js'

/**
 * Unified Payment Controller
 * Handles all payment methods (M-Pesa, Stripe, PayPal)
 */

// Initialize payment
export const initiatePayment = async (req, res) => {
  try {
    const { method, amount, currency, planId, returnUrl, cancelUrl } = req.body
    const userId = req.user.id

    // Validate input
    if (!method || !amount) {
      return res.status(400).json({ error: 'Payment method and amount are required' })
    }

    let result

    switch (method.toLowerCase()) {
      case 'mpesa':
        result = await handleMpesaPayment(req.body, userId)
        break
      case 'stripe':
        result = await handleStripePayment(req.body, userId)
        break
      case 'paypal':
        result = await handlePayPalPayment(req.body, userId)
        break
      default:
        return res.status(400).json({ error: 'Invalid payment method' })
    }

    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Payment initiation error:', error)
    res.status(500).json({ error: 'Failed to initiate payment' })
  }
}

// M-Pesa STK Push
async function handleMpesaPayment(data, userId) {
  const { phoneNumber, amount, accountReference, description } = data

  if (!phoneNumber) {
    return { success: false, error: 'Phone number is required for M-Pesa' }
  }

  // Initiate STK Push
  const result = await mpesaService.initiateSTKPush(
    phoneNumber,
    amount,
    accountReference || `USER-${userId}`,
    description || 'E-Folio Payment'
  )

  if (result.success) {
    // Save payment record
    const payment = await Payment.create({
      userId,
      method: 'mpesa',
      amount,
      currency: 'KES',
      status: 'pending',
      transactionId: result.checkoutRequestID,
      metadata: {
        merchantRequestID: result.merchantRequestID,
        phoneNumber,
        accountReference
      }
    })

    return {
      success: true,
      paymentId: payment._id,
      checkoutRequestID: result.checkoutRequestID,
      message: result.customerMessage
    }
  }

  return result
}

// Stripe Payment Intent
async function handleStripePayment(data, userId) {
  const { amount, currency = 'usd', planId } = data

  // Get or create Stripe customer
  const user = await User.findById(userId)
  let customerId = user.stripeCustomerId

  if (!customerId) {
    const customerResult = await stripeService.createCustomer(
      user.email,
      `${user.firstName} ${user.lastName}`,
      { userId: userId.toString() }
    )

    if (customerResult.success) {
      customerId = customerResult.customerId
      user.stripeCustomerId = customerId
      await user.save()
    }
  }

  // Create payment intent
  const result = await stripeService.createPaymentIntent(
    Math.round(amount * 100), // Convert to cents
    currency,
    {
      userId: userId.toString(),
      planId,
      customerId
    }
  )

  if (result.success) {
    // Save payment record
    const payment = await Payment.create({
      userId,
      method: 'stripe',
      amount,
      currency: currency.toUpperCase(),
      status: 'pending',
      transactionId: result.paymentIntentId,
      metadata: {
        clientSecret: result.clientSecret,
        customerId
      }
    })

    return {
      success: true,
      paymentId: payment._id,
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId
    }
  }

  return result
}

// PayPal Order
async function handlePayPalPayment(data, userId) {
  const { amount, currency = 'USD', description, returnUrl, cancelUrl } = data

  const result = await paypalService.createOrder(
    amount,
    currency,
    description || 'E-Folio Payment',
    returnUrl || `${process.env.CLIENT_URL}/payment/success`,
    cancelUrl || `${process.env.CLIENT_URL}/payment/cancel`
  )

  if (result.success) {
    // Save payment record
    const payment = await Payment.create({
      userId,
      method: 'paypal',
      amount,
      currency: currency.toUpperCase(),
      status: 'pending',
      transactionId: result.orderId,
      metadata: {
        approvalUrl: result.approvalUrl
      }
    })

    return {
      success: true,
      paymentId: payment._id,
      orderId: result.orderId,
      approvalUrl: result.approvalUrl
    }
  }

  return result
}

// M-Pesa Callback Handler
export const mpesaCallback = async (req, res) => {
  try {
    console.log('M-Pesa Callback received:', JSON.stringify(req.body, null, 2))

    const paymentDetails = mpesaService.processCallback(req.body)

    // Find and update payment record
    const payment = await Payment.findOne({
      transactionId: paymentDetails.checkoutRequestID
    })

    if (payment) {
      payment.status = paymentDetails.success ? 'completed' : 'failed'
      payment.completedAt = new Date()
      payment.metadata = {
        ...payment.metadata,
        ...paymentDetails
      }
      await payment.save()

      // Update user subscription if payment successful
      if (paymentDetails.success) {
        await updateUserSubscription(payment.userId, payment.amount)
        
        // Send SMS notification
        const user = await User.findById(payment.userId)
        if (user.phone) {
          await smsService.sendPaymentNotification(user.phone, {
            amount: payment.amount,
            currency: payment.currency,
            transactionId: paymentDetails.mpesaReceiptNumber,
            status: 'successful'
          })
        }
      }
    }

    // Always respond with success to M-Pesa
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch (error) {
    console.error('M-Pesa callback error:', error)
    res.json({ ResultCode: 1, ResultDesc: 'Failed' })
  }
}

// Stripe Webhook Handler
export const stripeWebhook = async (req, res) => {
  try {
    const signature = req.headers['stripe-signature']

    // Verify webhook signature
    const verification = stripeService.verifyWebhookSignature(req.body, signature)

    if (!verification.success) {
      return res.status(400).json({ error: 'Invalid signature' })
    }

    const event = verification.event
    const processedEvent = await stripeService.processWebhookEvent(event)

    // Handle different event types
    switch (processedEvent.type) {
      case 'payment_success':
        await handleStripePaymentSuccess(processedEvent)
        break
      case 'payment_failed':
        await handleStripePaymentFailed(processedEvent)
        break
      case 'subscription_updated':
        await handleStripeSubscriptionUpdate(processedEvent)
        break
      case 'subscription_cancelled':
        await handleStripeSubscriptionCancel(processedEvent)
        break
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    res.status(400).json({ error: 'Webhook processing failed' })
  }
}

// PayPal Webhook Handler
export const paypalWebhook = async (req, res) => {
  try {
    // Verify webhook signature
    const verification = await paypalService.verifyWebhookSignature(
      req.headers,
      req.body
    )

    if (!verification.success || !verification.verified) {
      return res.status(400).json({ error: 'Invalid signature' })
    }

    const event = req.body
    const eventType = event.event_type

    // Handle different event types
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePayPalPaymentCompleted(event.resource)
        break
      case 'PAYMENT.CAPTURE.DENIED':
        await handlePayPalPaymentDenied(event.resource)
        break
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handlePayPalSubscriptionActivated(event.resource)
        break
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handlePayPalSubscriptionCancelled(event.resource)
        break
    }

    res.json({ received: true })
  } catch (error) {
    console.error('PayPal webhook error:', error)
    res.status(400).json({ error: 'Webhook processing failed' })
  }
}

// Verify Payment Status
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params
    const userId = req.user.id

    const payment = await Payment.findOne({ _id: paymentId, userId })

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' })
    }

    // Check payment status from provider
    let providerStatus
    switch (payment.method) {
      case 'mpesa':
        providerStatus = await mpesaService.verifyPayment(payment.transactionId)
        break
      case 'stripe':
        providerStatus = await stripeService.retrievePaymentIntent(payment.transactionId)
        break
      case 'paypal':
        providerStatus = await paypalService.getOrder(payment.transactionId)
        break
    }

    res.json({
      payment,
      providerStatus
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    res.status(500).json({ error: 'Failed to verify payment' })
  }
}

// Get Payment History
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id
    const { page = 1, limit = 10 } = req.query

    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Payment.countDocuments({ userId })

    res.json({
      payments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    })
  } catch (error) {
    console.error('Get payment history error:', error)
    res.status(500).json({ error: 'Failed to get payment history' })
  }
}

// Helper Functions
async function handleStripePaymentSuccess(event) {
  const payment = await Payment.findOne({ transactionId: event.paymentIntentId })
  if (payment) {
    payment.status = 'completed'
    payment.completedAt = new Date()
    await payment.save()
    await updateUserSubscription(payment.userId, payment.amount)
  }
}

async function handleStripePaymentFailed(event) {
  const payment = await Payment.findOne({ transactionId: event.paymentIntentId })
  if (payment) {
    payment.status = 'failed'
    payment.metadata.error = event.error
    await payment.save()
  }
}

async function handleStripeSubscriptionUpdate(event) {
  // Update user subscription based on Stripe subscription
  console.log('Stripe subscription updated:', event)
}

async function handleStripeSubscriptionCancel(event) {
  // Handle subscription cancellation
  console.log('Stripe subscription cancelled:', event)
}

async function handlePayPalPaymentCompleted(resource) {
  const payment = await Payment.findOne({ transactionId: resource.id })
  if (payment) {
    payment.status = 'completed'
    payment.completedAt = new Date()
    await payment.save()
    await updateUserSubscription(payment.userId, payment.amount)
  }
}

async function handlePayPalPaymentDenied(resource) {
  const payment = await Payment.findOne({ transactionId: resource.id })
  if (payment) {
    payment.status = 'failed'
    await payment.save()
  }
}

async function handlePayPalSubscriptionActivated(resource) {
  console.log('PayPal subscription activated:', resource)
}

async function handlePayPalSubscriptionCancelled(resource) {
  console.log('PayPal subscription cancelled:', resource)
}

async function updateUserSubscription(userId, amount) {
  const user = await User.findById(userId)
  if (!user) return

  // Determine plan based on amount
  let plan = 'free'
  if (amount >= 49) {
    plan = 'enterprise'
  } else if (amount >= 19) {
    plan = 'professional'
  }

  user.subscription = {
    plan,
    status: 'active',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    autoRenew: true
  }

  await user.save()
}
