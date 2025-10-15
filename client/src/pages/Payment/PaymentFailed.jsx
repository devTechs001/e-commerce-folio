import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { XCircle, ArrowLeft, RefreshCw, HelpCircle, Mail } from 'lucide-react'
import Button from '../../components/common/Button/Button'

const PaymentFailed = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const errorData = location.state || {}
  const {
    error,
    portfolioId,
    amount,
    method
  } = errorData

  const commonIssues = [
    {
      title: 'Insufficient Funds',
      description: 'Ensure your account has enough balance to complete the payment',
      icon: '💳'
    },
    {
      title: 'Card Declined',
      description: 'Your bank may have declined the transaction. Contact your bank for details',
      icon: '🏦'
    },
    {
      title: 'Incorrect Details',
      description: 'Double-check your payment information for any errors',
      icon: '✏️'
    },
    {
      title: 'Network Issues',
      description: 'Poor internet connection can cause payment failures. Try again with a stable connection',
      icon: '📡'
    }
  ]

  const handleRetry = () => {
    // Go back to checkout with the same details
    navigate(`/checkout?portfolio=${portfolioId}&amount=${amount}`)
  }

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@efolio.com?subject=Payment Failed - Need Help'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Failed Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse opacity-20"></div>
              <div className="relative bg-gradient-to-br from-red-500 to-red-600 rounded-full p-6">
                <XCircle className="h-16 w-16 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Payment Failed
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We couldn't process your payment. Don't worry, no charges were made.
          </p>

          {/* Error Details */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start space-x-3">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-left flex-1">
                  <h3 className="text-sm font-medium text-red-900 mb-1">Error Details</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Common Issues */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-gray-600" />
              Common Issues & Solutions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commonIssues.map((issue, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{issue.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{issue.title}</h3>
                      <p className="text-sm text-gray-600">{issue.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Button
              variant="primary"
              size="lg"
              onClick={handleRetry}
              icon={RefreshCw}
              className="w-full"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleContactSupport}
              icon={Mail}
              className="w-full"
            >
              Contact Support
            </Button>
          </div>

          {/* Back Link */}
          <button
            onClick={() => navigate('/templates')}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Browse Other Templates</span>
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Need More Help?</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email Support</p>
                <a 
                  href="mailto:support@efolio.com" 
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  support@efolio.com
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <HelpCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Help Center</p>
                <a 
                  href="/help" 
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Browse our FAQ and guides
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            💡 Tip: Try using a different payment method if the issue persists
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailed
