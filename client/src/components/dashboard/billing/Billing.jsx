import React, { useState, useEffect } from 'react'
import { CreditCard, Check, Zap, Crown, Star, AlertCircle } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import Button from '../../common/Button/Button'
import SubscriptionManager from '../subscription/SubscriptionManager'
import toast from 'react-hot-toast'
import axios from 'axios'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'forever',
    icon: Star,
    color: 'gray',
    features: [
      '1 Portfolio',
      'Basic Templates',
      'E-Folio Subdomain',
      'Basic Analytics',
      'Community Support'
    ],
    limitations: [
      'No custom domain',
      'No AI assistance',
      'Limited templates'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 12,
    interval: 'month',
    icon: Zap,
    color: 'blue',
    popular: true,
    features: [
      'Unlimited Portfolios',
      'All Premium Templates',
      'Custom Domain',
      'AI Content Assistant',
      'Advanced Analytics',
      'Priority Support',
      'Remove Branding',
      'SEO Tools'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 49,
    interval: 'month',
    icon: Crown,
    color: 'purple',
    features: [
      'Everything in Pro',
      'Team Collaboration',
      'White Label Solution',
      'API Access',
      'Dedicated Support',
      'Custom Integrations',
      'SLA Guarantee',
      'Training Sessions'
    ]
  }
]

const Billing = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [billingHistory, setBillingHistory] = useState([])
  const [paymentMethod, setPaymentMethod] = useState(null)

  useEffect(() => {
    fetchBillingData()
  }, [])

  const fetchBillingData = async () => {
    try {
      const response = await axios.get('/api/billing/history')
      setBillingHistory(response.data.history || [])
      setPaymentMethod(response.data.paymentMethod)
    } catch (error) {
      console.error('Error fetching billing data:', error)
    }
  }

  const handleUpgrade = async (planId) => {
    if (user?.subscription?.plan === planId) {
      toast.error('You are already on this plan')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post('/api/payments/create-checkout-session', {
        planId,
        successUrl: `${window.location.origin}/dashboard/billing?success=true`,
        cancelUrl: `${window.location.origin}/dashboard/billing?canceled=true`
      })

      if (response.data.url) {
        window.location.href = response.data.url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      toast.error(error.response?.data?.error || 'Failed to start checkout')
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/api/payments/create-portal-session', {
        returnUrl: `${window.location.origin}/dashboard/billing`
      })

      if (response.data.url) {
        window.location.href = response.data.url
      }
    } catch (error) {
      console.error('Error opening billing portal:', error)
      toast.error('Failed to open billing portal')
    } finally {
      setLoading(false)
    }
  }
  const currentPlan = user?.subscription?.plan || 'free'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
        <p className="text-gray-600">Manage your subscription and billing information</p>
      </div>

      {/* Subscription Manager */}
      <SubscriptionManager />

      {/* Current Plan Card */}
      <div className="bg-gradient-to-r from-primary-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mt-1 capitalize">{currentPlan}</h2>
            {user?.subscription?.status && (
              <p className="text-sm mt-2 opacity-90">
                Status: <span className="font-semibold capitalize">{user.subscription.status}</span>
              </p>
            )}
          </div>
          {currentPlan !== 'free' && (
            <Button
              onClick={handleManageSubscription}
              variant="outline"
              className="bg-white text-primary-600 hover:bg-gray-100"
              loading={loading}
            >
              Manage Subscription
            </Button>
          )}
        </div>
      </div>

      {/* Pricing Plans */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrentPlan = currentPlan === plan.id
            const isPremium = plan.id !== 'free'

            return (
              <div
                key={plan.id}
                className={`relative rounded-xl border-2 p-6 transition-all ${
                  plan.popular
                    ? 'border-primary-500 shadow-xl scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                } ${isCurrentPlan ? 'bg-primary-50' : 'bg-white'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Current
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${plan.color}-100 mb-4`}>
                    <Icon className={`w-6 h-6 text-${plan.color}-600`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/{plan.interval}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation) => (
                    <li key={limitation} className="flex items-start opacity-60">
                      <AlertCircle className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrentPlan || loading}
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full"
                  loading={loading}
                >
                  {isCurrentPlan ? 'Current Plan' : isPremium ? 'Upgrade' : 'Downgrade'}
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Payment Method */}
      {paymentMethod && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  •••• •••• •••• {paymentMethod.last4}
                </p>
                <p className="text-sm text-gray-600">
                  Expires {paymentMethod.exp_month}/{paymentMethod.exp_year}
                </p>
              </div>
            </div>
            <Button
              onClick={handleManageSubscription}
              variant="outline"
              loading={loading}
            >
              Update
            </Button>
          </div>
        </div>
      )}

      {/* Billing History */}
      {billingHistory.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {new Date(invoice.created * 1000).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{invoice.description}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                      ${(invoice.amount / 100).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={invoice.invoice_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Billing
