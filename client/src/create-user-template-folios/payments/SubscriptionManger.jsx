import React, { useState, useEffect } from 'react'
import { Calendar, CreditCard, Download, AlertTriangle } from 'lucide-react'
import Button from '../../../components/common/Button/Button'
import { subscriptionService } from '../../../services/subscription'

const SubscriptionManager = () => {
  const [subscription, setSubscription] = useState(null)
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubscriptionData()
  }, [])

  const loadSubscriptionData = async () => {
    try {
      const [subResponse, invoicesResponse] = await Promise.all([
        subscriptionService.getCurrentSubscription(),
        subscriptionService.getInvoices()
      ])

      if (subResponse.success) {
        setSubscription(subResponse.data)
      }

      if (invoicesResponse.success) {
        setInvoices(invoicesResponse.data)
      }
    } catch (error) {
      console.error('Error loading subscription data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return
    }

    try {
      const response = await subscriptionService.cancelSubscription()
      if (response.success) {
        setSubscription(prev => prev ? { ...prev, status: 'cancelled' } : null)
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error)
    }
  }

  const handleReactivateSubscription = async () => {
    try {
      const response = await subscriptionService.reactivateSubscription()
      if (response.success) {
        setSubscription(prev => prev ? { ...prev, status: 'active' } : null)
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error)
    }
  }

  const handleDownloadInvoice = async (invoiceId) => {
    try {
      const response = await subscriptionService.downloadInvoice(invoiceId)
      if (response.success) {
        // Create download link
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `invoice-${invoiceId}.pdf`
        link.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error downloading invoice:', error)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-6 rounded w-1/4 mb-4"></div>
          <div className="bg-gray-200 h-20 rounded mb-4"></div>
          <div className="bg-gray-200 h-32 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Subscription Management</h3>
        <CreditCard className="h-6 w-6 text-primary-600" />
      </div>

      {/* Current Subscription */}
      {subscription ? (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{subscription.planName}</h4>
              <p className="text-gray-600">${subscription.amount} / {subscription.interval}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscription.status === 'active' 
                ? 'bg-green-100 text-green-800'
                : subscription.status === 'cancelled'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span className="text-gray-600">Next billing date:</span>
              <p className="font-medium">{new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-gray-600">Payment method:</span>
              <p className="font-medium">{subscription.paymentMethod}</p>
            </div>
          </div>

          <div className="flex space-x-3">
            {subscription.status === 'active' ? (
              <Button variant="outline" onClick={handleCancelSubscription}>
                Cancel Subscription
              </Button>
            ) : subscription.status === 'cancelled' ? (
              <Button variant="primary" onClick={handleReactivateSubscription}>
                Reactivate Subscription
              </Button>
            ) : null}
            <Button variant="outline">
              Update Payment Method
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <h4 className="font-medium text-yellow-800">No Active Subscription</h4>
              <p className="text-yellow-700 text-sm">Upgrade to access premium features</p>
            </div>
          </div>
        </div>
      )}

      {/* Billing History */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h4>
        
        {invoices.length > 0 ? (
          <div className="border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Download}
                        onClick={() => handleDownloadInvoice(invoice._id)}
                      >
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 border border-gray-200 rounded-lg">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No billing history available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionManager