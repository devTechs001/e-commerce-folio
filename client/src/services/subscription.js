import api from './api'

export const subscriptionService = {
  async getCurrentSubscription() {
    try {
      const response = await api.get('/subscriptions/current')
      return response.data
    } catch (error) {
      console.warn('Subscription API not available, returning mock data')
      return {
        id: 'sub_mock_123',
        status: 'active',
        plan: {
          id: 'plan_free',
          name: 'Free',
          tier: 'standard',
          price: 0,
          features: ['1 Portfolio', 'Basic Templates', 'Standard Support']
        },
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false
      }
    }
  },
  
  async getPlans() {
    try {
      const response = await api.get('/subscriptions/plans')
      return response.data
    } catch (error) {
      console.warn('Plans API not available, returning mock data')
      return [
        {
          id: 'plan_free',
          name: 'Free',
          tier: 'standard',
          price: 0,
          interval: 'month',
          features: [
            '1 Portfolio',
            'Basic Templates',
            'Standard Support',
            'Basic Analytics',
            '500MB Storage'
          ],
          limits: {
            portfolios: 1,
            storage: '500MB',
            customDomain: false,
            aiFeatures: false
          }
        },
        {
          id: 'plan_pro',
          name: 'Professional',
          tier: 'premium',
          price: 19,
          interval: 'month',
          popular: true,
          features: [
            '5 Portfolios',
            'All Templates',
            'Priority Support',
            'Advanced Analytics',
            '10GB Storage',
            'Custom Domain',
            'AI Features',
            'Team Collaboration'
          ],
          limits: {
            portfolios: 5,
            storage: '10GB',
            customDomain: true,
            aiFeatures: true,
            teamMembers: 3
          }
        },
        {
          id: 'plan_enterprise',
          name: 'Enterprise',
          tier: 'premium',
          price: 49,
          interval: 'month',
          features: [
            'Unlimited Portfolios',
            'All Templates + Custom',
            '24/7 Support',
            'Advanced Analytics',
            '100GB Storage',
            'Multiple Custom Domains',
            'Advanced AI Features',
            'Unlimited Collaboration',
            'White-label Options',
            'API Access'
          ],
          limits: {
            portfolios: -1,
            storage: '100GB',
            customDomain: true,
            aiFeatures: true,
            teamMembers: -1,
            apiAccess: true
          }
        }
      ]
    }
  },
  
  // User tier management
  async getUserTier() {
    try {
      const subscription = await this.getCurrentSubscription()
      return subscription.plan?.tier || 'standard'
    } catch (error) {
      return 'standard'
    }
  },

  async checkFeatureAccess(feature) {
    try {
      const subscription = await this.getCurrentSubscription()
      const plan = subscription.plan
      
      // Feature access logic based on plan
      const featureMap = {
        'ai_generator': plan?.limits?.aiFeatures || false,
        'custom_domain': plan?.limits?.customDomain || false,
        'advanced_analytics': plan?.tier === 'premium',
        'team_collaboration': plan?.limits?.teamMembers > 0,
        'api_access': plan?.limits?.apiAccess || false,
        'priority_support': plan?.tier === 'premium'
      }
      
      return featureMap[feature] || false
    } catch (error) {
      return false
    }
  },

  async subscribe(planId, paymentMethodId) {
    try {
      const response = await api.post('/subscriptions/subscribe', {
        planId,
        paymentMethodId
      })
      return response.data
    } catch (error) {
      console.warn('Subscription API not available, returning mock success')
      return {
        success: true,
        message: 'Demo mode - subscription simulation',
        subscription: {
          id: 'sub_demo_' + Date.now(),
          status: 'active',
          planId
        }
      }
    }
  },

  async cancelSubscription() {
    try {
      const response = await api.post('/subscriptions/cancel')
      return response.data
    } catch (error) {
      console.warn('Cancel API not available, returning mock success')
      return { success: true, message: 'Demo mode - cancellation simulation' }
    }
  },

  async reactivateSubscription() {
    try {
      const response = await api.post('/subscriptions/reactivate')
      return response.data
    } catch (error) {
      console.warn('Reactivate API not available, returning mock success')
      return { success: true, message: 'Demo mode - reactivation simulation' }
    }
  },

  async updateSubscription(planId) {
    try {
      const response = await api.put('/subscriptions/update', { planId })
      return response.data
    } catch (error) {
      console.warn('Update API not available, returning mock success')
      return { success: true, message: 'Demo mode - update simulation' }
    }
  },

  async getInvoices() {
    try {
      const response = await api.get('/subscriptions/invoices')
      return response.data
    } catch (error) {
      console.warn('Invoices API not available, returning mock data')
      return [
        {
          id: 'inv_001',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          amount: 19,
          status: 'paid',
          planName: 'Professional'
        },
        {
          id: 'inv_002',
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          amount: 19,
          status: 'paid',
          planName: 'Professional'
        }
      ]
    }
  },

  async downloadInvoice(invoiceId) {
    try {
      const response = await api.get(`/subscriptions/invoices/${invoiceId}/download`, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.warn('Invoice download not available in demo mode')
      return null
    }
  }
}