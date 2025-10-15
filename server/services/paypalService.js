import axios from 'axios'

class PayPalService {
  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET
    this.mode = process.env.PAYPAL_MODE || 'sandbox' // sandbox or live
    this.baseUrl = this.mode === 'live' 
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com'
    this.accessToken = null
    this.tokenExpiry = null
  }

  /**
   * Get OAuth access token
   */
  async getAccessToken() {
    try {
      // Check if we have a valid token
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken
      }

      if (!this.clientId || !this.clientSecret) {
        throw new Error('PayPal credentials not configured')
      }

      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')

      const response = await axios.post(
        `${this.baseUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      this.accessToken = response.data.access_token
      // Token expires in seconds, refresh 1 minute early
      this.tokenExpiry = Date.now() + ((response.data.expires_in - 60) * 1000)

      return this.accessToken
    } catch (error) {
      console.error('PayPal access token error:', error.response?.data || error.message)
      throw new Error('Failed to get PayPal access token')
    }
  }

  /**
   * Create an order
   * @param {number} amount - Amount to charge
   * @param {string} currency - Currency code (default: USD)
   * @param {string} description - Order description
   * @param {string} returnUrl - Success return URL
   * @param {string} cancelUrl - Cancel return URL
   */
  async createOrder(amount, currency = 'USD', description = 'E-Folio Payment', returnUrl, cancelUrl) {
    try {
      const accessToken = await this.getAccessToken()

      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount.toFixed(2)
          },
          description
        }],
        application_context: {
          return_url: returnUrl,
          cancel_url: cancelUrl,
          brand_name: 'E-Folio',
          user_action: 'PAY_NOW'
        }
      }

      const response = await axios.post(
        `${this.baseUrl}/v2/checkout/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const approvalUrl = response.data.links.find(link => link.rel === 'approve')?.href

      return {
        success: true,
        orderId: response.data.id,
        status: response.data.status,
        approvalUrl,
        links: response.data.links
      }
    } catch (error) {
      console.error('PayPal create order error:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data || error.message
      }
    }
  }

  /**
   * Capture an order payment
   * @param {string} orderId - PayPal order ID
   */
  async captureOrder(orderId) {
    try {
      const accessToken = await this.getAccessToken()

      const response = await axios.post(
        `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const capture = response.data.purchase_units[0].payments.captures[0]

      return {
        success: true,
        orderId: response.data.id,
        status: response.data.status,
        captureId: capture.id,
        amount: capture.amount.value,
        currency: capture.amount.currency_code,
        payerEmail: response.data.payer?.email_address,
        payerName: response.data.payer?.name?.given_name + ' ' + response.data.payer?.name?.surname
      }
    } catch (error) {
      console.error('PayPal capture order error:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data || error.message
      }
    }
  }

  /**
   * Get order details
   * @param {string} orderId - PayPal order ID
   */
  async getOrder(orderId) {
    try {
      const accessToken = await this.getAccessToken()

      const response = await axios.get(
        `${this.baseUrl}/v2/checkout/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        order: response.data,
        status: response.data.status
      }
    } catch (error) {
      console.error('PayPal get order error:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data || error.message
      }
    }
  }

  /**
   * Create a subscription plan
   * @param {object} planData - Plan details
   */
  async createSubscriptionPlan(planData) {
    try {
      const accessToken = await this.getAccessToken()

      const response = await axios.post(
        `${this.baseUrl}/v1/billing/plans`,
        planData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        planId: response.data.id,
        status: response.data.status,
        plan: response.data
      }
    } catch (error) {
      console.error('PayPal create plan error:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data || error.message
      }
    }
  }

  /**
   * Create a subscription
   * @param {string} planId - PayPal plan ID
   * @param {string} returnUrl - Success return URL
   * @param {string} cancelUrl - Cancel return URL
   */
  async createSubscription(planId, returnUrl, cancelUrl) {
    try {
      const accessToken = await this.getAccessToken()

      const subscriptionData = {
        plan_id: planId,
        application_context: {
          brand_name: 'E-Folio',
          return_url: returnUrl,
          cancel_url: cancelUrl,
          user_action: 'SUBSCRIBE_NOW'
        }
      }

      const response = await axios.post(
        `${this.baseUrl}/v1/billing/subscriptions`,
        subscriptionData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const approvalUrl = response.data.links.find(link => link.rel === 'approve')?.href

      return {
        success: true,
        subscriptionId: response.data.id,
        status: response.data.status,
        approvalUrl,
        links: response.data.links
      }
    } catch (error) {
      console.error('PayPal create subscription error:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data || error.message
      }
    }
  }

  /**
   * Cancel a subscription
   * @param {string} subscriptionId - PayPal subscription ID
   * @param {string} reason - Cancellation reason
   */
  async cancelSubscription(subscriptionId, reason = 'User requested cancellation') {
    try {
      const accessToken = await this.getAccessToken()

      await axios.post(
        `${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        subscriptionId,
        status: 'CANCELLED'
      }
    } catch (error) {
      console.error('PayPal cancel subscription error:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data || error.message
      }
    }
  }

  /**
   * Get subscription details
   * @param {string} subscriptionId - PayPal subscription ID
   */
  async getSubscription(subscriptionId) {
    try {
      const accessToken = await this.getAccessToken()

      const response = await axios.get(
        `${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        subscription: response.data,
        status: response.data.status
      }
    } catch (error) {
      console.error('PayPal get subscription error:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data || error.message
      }
    }
  }

  /**
   * Verify webhook signature
   * @param {object} headers - Request headers
   * @param {object} body - Request body
   */
  async verifyWebhookSignature(headers, body) {
    try {
      const accessToken = await this.getAccessToken()

      const verificationData = {
        auth_algo: headers['paypal-auth-algo'],
        cert_url: headers['paypal-cert-url'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: body
      }

      const response = await axios.post(
        `${this.baseUrl}/v1/notifications/verify-webhook-signature`,
        verificationData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        verified: response.data.verification_status === 'SUCCESS'
      }
    } catch (error) {
      console.error('PayPal webhook verification error:', error.response?.data || error.message)
      return {
        success: false,
        verified: false,
        error: error.response?.data || error.message
      }
    }
  }

  /**
   * Create a payout
   * @param {array} items - Payout items
   * @param {string} emailSubject - Email subject
   */
  async createPayout(items, emailSubject = 'You have a payment from E-Folio') {
    try {
      const accessToken = await this.getAccessToken()

      const payoutData = {
        sender_batch_header: {
          sender_batch_id: `batch_${Date.now()}`,
          email_subject: emailSubject,
          email_message: 'You have received a payment. Thanks for using our service!'
        },
        items
      }

      const response = await axios.post(
        `${this.baseUrl}/v1/payments/payouts`,
        payoutData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        payoutBatchId: response.data.batch_header.payout_batch_id,
        batchStatus: response.data.batch_header.batch_status
      }
    } catch (error) {
      console.error('PayPal payout error:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data || error.message
      }
    }
  }
}

export const paypalService = new PayPalService()
export default paypalService
