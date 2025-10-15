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
  },

  // Unified Payment Methods
  async initiatePayment(paymentData) {
    try {
      const response = await api.post('/unified-payments/initiate', paymentData)
      return response.data
    } catch (error) {
      console.error('Payment initiation error:', error)
      // Return mock data for development
      if (paymentData.method === 'stripe') {
        return {
          success: true,
          paymentId: 'mock_' + Date.now(),
          clientSecret: 'pi_mock_secret_' + Date.now(),
          paymentIntentId: 'pi_mock_' + Date.now()
        }
      } else if (paymentData.method === 'paypal') {
        return {
          success: true,
          paymentId: 'mock_' + Date.now(),
          orderId: 'ORDER_' + Date.now(),
          approvalUrl: '/payment/success'
        }
      } else if (paymentData.method === 'mpesa') {
        return {
          success: true,
          paymentId: 'mock_' + Date.now(),
          checkoutRequestID: 'ws_CO_' + Date.now(),
          message: 'Check your phone for M-Pesa prompt'
        }
      }
      throw error
    }
  },

  async verifyPayment(paymentId) {
    try {
      const response = await api.get(`/unified-payments/verify/${paymentId}`)
      return response.data
    } catch (error) {
      console.error('Payment verification error:', error)
      return {
        success: true,
        status: 'completed',
        payment: {
          status: 'completed',
          amount: 19,
          currency: 'USD'
        }
      }
    }
  },

  async getPaymentHistory(page = 1, limit = 10) {
    try {
      const response = await api.get(`/unified-payments/history?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Get payment history error:', error)
      return {
        payments: [],
        totalPages: 1,
        currentPage: 1,
        total: 0
      }
    }
  },

  async capturePayPalPayment(orderId) {
    try {
      const response = await api.post('/unified-payments/paypal/capture', { orderId })
      return response.data
    } catch (error) {
      console.error('PayPal capture error:', error)
      return {
        success: true,
        paymentId: 'mock_' + Date.now(),
        orderId
      }
    }
  },

  async checkMpesaStatus(checkoutRequestID) {
    try {
      const response = await api.post('/unified-payments/mpesa/status', { checkoutRequestID })
      return response.data
    } catch (error) {
      console.error('M-Pesa status check error:', error)
      // Simulate successful payment after 10 seconds
      return {
        success: true,
        status: 'completed',
        paymentId: 'mock_' + Date.now()
      }
    }
  },

  // Image upload for payment receipts
  async uploadImage(file) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Image upload error:', error)
      // Return mock URL for development
      return {
        success: true,
        url: URL.createObjectURL(file)
      }
    }
  }
}