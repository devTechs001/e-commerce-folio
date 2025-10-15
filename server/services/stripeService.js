import Stripe from 'stripe'

class StripeService {
  constructor() {
    this.stripe = process.env.STRIPE_SECRET_KEY 
      ? new Stripe(process.env.STRIPE_SECRET_KEY)
      : null
  }

  /**
   * Create a payment intent
   * @param {number} amount - Amount in cents (e.g., 2000 for $20.00)
   * @param {string} currency - Currency code (default: usd)
   * @param {object} metadata - Additional metadata
   */
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      if (!this.stripe) {
        throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY.')
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: currency.toLowerCase(),
        metadata,
        automatic_payment_methods: {
          enabled: true
        }
      })

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      }
    } catch (error) {
      console.error('Stripe payment intent error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Create a checkout session
   * @param {array} lineItems - Array of line items
   * @param {string} successUrl - Success redirect URL
   * @param {string} cancelUrl - Cancel redirect URL
   * @param {object} metadata - Additional metadata
   */
  async createCheckoutSession(lineItems, successUrl, cancelUrl, metadata = {}) {
    try {
      if (!this.stripe) {
        throw new Error('Stripe is not configured')
      }

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata
      })

      return {
        success: true,
        sessionId: session.id,
        url: session.url
      }
    } catch (error) {
      console.error('Stripe checkout session error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Create a subscription
   * @param {string} customerId - Stripe customer ID
   * @param {string} priceId - Stripe price ID
   * @param {object} metadata - Additional metadata
   */
  async createSubscription(customerId, priceId, metadata = {}) {
    try {
      if (!this.stripe) {
        throw new Error('Stripe is not configured')
      }

      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata
      })

      return {
        success: true,
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        status: subscription.status
      }
    } catch (error) {
      console.error('Stripe subscription error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Create or retrieve a customer
   * @param {string} email - Customer email
   * @param {string} name - Customer name
   * @param {object} metadata - Additional metadata
   */
  async createCustomer(email, name, metadata = {}) {
    try {
      if (!this.stripe) {
        throw new Error('Stripe is not configured')
      }

      // Check if customer already exists
      const existingCustomers = await this.stripe.customers.list({
        email,
        limit: 1
      })

      if (existingCustomers.data.length > 0) {
        return {
          success: true,
          customerId: existingCustomers.data[0].id,
          isExisting: true
        }
      }

      // Create new customer
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata
      })

      return {
        success: true,
        customerId: customer.id,
        isExisting: false
      }
    } catch (error) {
      console.error('Stripe customer creation error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Retrieve payment intent
   * @param {string} paymentIntentId - Payment intent ID
   */
  async retrievePaymentIntent(paymentIntentId) {
    try {
      if (!this.stripe) {
        throw new Error('Stripe is not configured')
      }

      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId)

      return {
        success: true,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        paymentIntent
      }
    } catch (error) {
      console.error('Stripe retrieve payment intent error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Cancel a subscription
   * @param {string} subscriptionId - Subscription ID
   */
  async cancelSubscription(subscriptionId) {
    try {
      if (!this.stripe) {
        throw new Error('Stripe is not configured')
      }

      const subscription = await this.stripe.subscriptions.cancel(subscriptionId)

      return {
        success: true,
        subscriptionId: subscription.id,
        status: subscription.status
      }
    } catch (error) {
      console.error('Stripe cancel subscription error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Create a billing portal session
   * @param {string} customerId - Stripe customer ID
   * @param {string} returnUrl - Return URL after portal session
   */
  async createBillingPortalSession(customerId, returnUrl) {
    try {
      if (!this.stripe) {
        throw new Error('Stripe is not configured')
      }

      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl
      })

      return {
        success: true,
        url: session.url
      }
    } catch (error) {
      console.error('Stripe billing portal error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Verify webhook signature
   * @param {string} payload - Request body
   * @param {string} signature - Stripe signature header
   */
  verifyWebhookSignature(payload, signature) {
    try {
      if (!this.stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('Stripe webhook is not configured')
      }

      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )

      return {
        success: true,
        event
      }
    } catch (error) {
      console.error('Stripe webhook verification error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Process webhook event
   * @param {object} event - Stripe event object
   */
  async processWebhookEvent(event) {
    try {
      const { type, data } = event

      switch (type) {
        case 'payment_intent.succeeded':
          return {
            type: 'payment_success',
            paymentIntentId: data.object.id,
            amount: data.object.amount,
            currency: data.object.currency
          }

        case 'payment_intent.payment_failed':
          return {
            type: 'payment_failed',
            paymentIntentId: data.object.id,
            error: data.object.last_payment_error?.message
          }

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          return {
            type: 'subscription_updated',
            subscriptionId: data.object.id,
            status: data.object.status,
            customerId: data.object.customer
          }

        case 'customer.subscription.deleted':
          return {
            type: 'subscription_cancelled',
            subscriptionId: data.object.id,
            customerId: data.object.customer
          }

        default:
          return {
            type: 'unhandled_event',
            eventType: type
          }
      }
    } catch (error) {
      console.error('Stripe webhook processing error:', error)
      throw error
    }
  }
}

export const stripeService = new StripeService()
export default stripeService
