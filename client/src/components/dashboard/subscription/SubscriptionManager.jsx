import React, { useState, useEffect } from 'react'
import { 
  Crown, 
  Check, 
  X, 
  CreditCard, 
  Calendar, 
  AlertTriangle,
  Star,
  Zap,
  Shield,
  Download
} from 'lucide-react'
import { subscriptionService } from '../../../services/subscription'
import { paymentService } from '../../../services/payment'

const SubscriptionManager = () => {
  const [currentSubscription, setCurrentSubscription] = useState(null)
  const [plans, setPlans] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadSubscriptionData()
  }, [])

  const loadSubscriptionData = async () => {
    try {
      const [subscription, availablePlans, userInvoices] = await Promise.all([
        subscriptionService.getCurrentSubscription(),
        subscriptionService.getPlans(),
        subscriptionService.getInvoices()
      ])
      
      setCurrentSubscription(subscription)
      setPlans(availablePlans)
      setInvoices(userInvoices)
      setLoading(false)
    } catch (error) {
      console.error('Error loading subscription data:', error)
      setLoading(false)
    }
  }

  const handleUpgrade = async (planId) => {
    setActionLoading(true)
    try {
      const result = await paymentService.createCheckoutSession(
        planId,
        `${window.location.origin}/dashboard/billing?success=true`,
        `${window.location.origin}/dashboard/billing?canceled=true`
      )
      
      if (result.url) {
        window.location.href = result.url
      } else {
        alert(result.message || 'Subscription upgrade initiated in demo mode')
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error)
      alert('Error upgrading subscription. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return
    
    setActionLoading(true)
    try {
      const result = await subscriptionService.cancelSubscription()
      alert(result.message || 'Subscription canceled successfully')
      loadSubscriptionData()
    } catch (error) {
      console.error('Error canceling subscription:', error)
      alert('Error canceling subscription. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReactivate = async () => {
    setActionLoading(true)
    try {
      const result = await subscriptionService.reactivateSubscription()
      alert(result.message || 'Subscription reactivated successfully')
      loadSubscriptionData()
    } catch (error) {
      console.error('Error reactivating subscription:', error)
      alert('Error reactivating subscription. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getPlanIcon = (planName) => {
    switch (planName.toLowerCase()) {
      case 'free': return Star
      case 'professional': return Zap
      case 'enterprise': return Crown
      default: return Shield
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Current Subscription
        </h2>
        
        {currentSubscription && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${
                currentSubscription.plan.tier === 'premium' 
                  ? 'bg-purple-100' 
                  : 'bg-blue-100'
              }`}>
                {React.createElement(getPlanIcon(currentSubscription.plan.name), {
                  className: `h-6 w-6 ${
                    currentSubscription.plan.tier === 'premium' 
                      ? 'text-purple-600' 
                      : 'text-blue-600'
                  }`
                })}
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center">
                  {currentSubscription.plan.name}
                  {currentSubscription.plan.tier === 'premium' && (
                    <Crown className="h-4 w-4 ml-2 text-yellow-500" />
                  )}
                </h3>
                <p className="text-sm text-gray-600">
                  ${currentSubscription.plan.price}/month
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                currentSubscription.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {currentSubscription.status === 'active' ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {currentSubscription.status}
                  </>
                )}
              </div>
              
              {currentSubscription.currentPeriodEnd && (
                <p className="text-sm text-gray-500 mt-1">
                  {currentSubscription.cancelAtPeriodEnd ? 'Expires' : 'Renews'} on{' '}
                  {formatDate(currentSubscription.currentPeriodEnd)}
                </p>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-6 flex space-x-3">
          {currentSubscription?.plan?.name !== 'Enterprise' && (
            <button
              onClick={() => handleUpgrade('plan_enterprise')}
              disabled={actionLoading}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {actionLoading ? 'Processing...' : 'Upgrade Plan'}
            </button>
          )}
          
          {currentSubscription?.status === 'active' && currentSubscription?.plan?.price > 0 && (
            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              Cancel Subscription
            </button>
          )}
          
          {currentSubscription?.cancelAtPeriodEnd && (
            <button
              onClick={handleReactivate}
              disabled={actionLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Reactivate
            </button>
          )}
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Plans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(plan => {
            const Icon = getPlanIcon(plan.name)
            const isCurrent = currentSubscription?.plan?.id === plan.id
            
            return (
              <div
                key={plan.id}
                className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                  isCurrent
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-200'
                } ${plan.popular ? 'ring-2 ring-primary-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <Icon className={`h-8 w-8 mx-auto mb-2 ${
                    plan.tier === 'premium' ? 'text-purple-600' : 'text-blue-600'
                  }`} />
                  
                  <h3 className="font-semibold text-gray-900 mb-1">{plan.name}</h3>
                  <div className="text-2xl font-bold text-gray-900 mb-4">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-600">/month</span>
                  </div>
                  
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {!isCurrent ? (
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={actionLoading}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                        plan.popular
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'border border-primary-600 text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                    </button>
                  ) : (
                    <div className="w-full py-2 px-4 rounded-lg bg-green-100 text-green-800 font-medium">
                      Current Plan
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Billing History
        </h2>
        
        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plan</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {invoice.planName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      ${invoice.amount}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No billing history available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionManager
