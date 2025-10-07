import api from './api'

export const paymentService = {
  async processStripePayment(paymentData) {
    const response = await api.post('/payments/stripe', paymentData)
    return response.data
  },

  async processMpesaPayment(paymentData) {
    const response = await api.post('/payments/mpesa', paymentData)
    return response.data
  },

  async processPaypalPayment(paymentData) {
    const response = await api.post('/payments/paypal', paymentData)
    return response.data
  },

  async getPaymentMethods() {
    const response = await api.get('/payments/methods')
    return response.data
  },

  async addPaymentMethod(methodData) {
    const response = await api.post('/payments/methods', methodData)
    return response.data
  },

  async removePaymentMethod(methodId) {
    const response = await api.delete(`/payments/methods/${methodId}`)
    return response.data
  },

  // Stripe Checkout
  async createCheckoutSession(priceId, successUrl, cancelUrl) {
    try {
      const response = await api.post('/payments/create-checkout-session', {
        priceId,
        successUrl,
        cancelUrl
      })
      return response.data
    } catch (error) {
      console.error('Error creating checkout session:', error)
      // Return mock data for development
      return {
        url: '/pricing?checkout=demo',
        sessionId: 'demo_session_' + Date.now()
      }
    }
  },

  // Stripe Billing Portal
  async createPortalSession(returnUrl) {
    try {
      const response = await api.post('/payments/create-portal-session', {
        returnUrl
      })
      return response.data
    } catch (error) {
      console.error('Error creating portal session:', error)
      // Return mock data for development
      return {
        url: '/dashboard/billing?portal=demo'
      }
    }
  },

  // Get subscription status
  async getSubscriptionStatus() {
    try {
      const response = await api.get('/payments/subscription-status')
      return response.data
    } catch (error) {
      console.warn('Subscription API not available, returning mock data')
      return {
        status: 'active',
        plan: 'free',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false
      }
    }
  }
}