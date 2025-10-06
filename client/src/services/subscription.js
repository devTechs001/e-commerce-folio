import api from './api'

export const subscriptionService = {
  async getCurrentSubscription() {
    const response = await api.get('/subscriptions/current')
    return response.data
  },

  async getPlans() {
    const response = await api.get('/subscriptions/plans')
    return response.data
  },

  async subscribe(planId, paymentMethodId) {
    const response = await api.post('/subscriptions/subscribe', {
      planId,
      paymentMethodId
    })
    return response.data
  },

  async cancelSubscription() {
    const response = await api.post('/subscriptions/cancel')
    return response.data
  },

  async reactivateSubscription() {
    const response = await api.post('/subscriptions/reactivate')
    return response.data
  },

  async updateSubscription(planId) {
    const response = await api.put('/subscriptions/update', { planId })
    return response.data
  },

  async getInvoices() {
    const response = await api.get('/subscriptions/invoices')
    return response.data
  },

  async downloadInvoice(invoiceId) {
    const response = await api.get(`/subscriptions/invoices/${invoiceId}/download`, {
      responseType: 'blob'
    })
    return response.data
  }
}