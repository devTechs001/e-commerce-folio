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
  }
}