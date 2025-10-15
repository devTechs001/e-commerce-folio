import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CreditCard, Smartphone, Wallet, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import StripeCheckout from '../../components/payment/StripeCheckout'
import PayPalCheckout from '../../components/payment/PayPalCheckout'
import MpesaCheckout from '../../components/payment/MpesaCheckout'
import { paymentService } from '../../services/payment'
import Button from '../../components/common/Button/Button'

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo')

const PortfolioCheckout = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [selectedMethod, setSelectedMethod] = useState('stripe')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [portfolioDetails, setPortfolioDetails] = useState(null)

  // Get portfolio details from URL params
  const portfolioId = searchParams.get('portfolio')
  const plan = searchParams.get('plan') || 'professional'
  const amount = searchParams.get('amount') || 19

  useEffect(() => {
    loadPortfolioDetails()
  }, [portfolioId])

  const loadPortfolioDetails = async () => {
    try {
      // Mock portfolio details - replace with actual API call
      setPortfolioDetails({
        id: portfolioId || 'demo',
        name: 'Premium Portfolio Template',
        description: 'Professional portfolio template with advanced features',
        price: parseFloat(amount),
        features: [
          'Fully customizable design',
          'AI-powered content generation',
          'SEO optimization',
          'Mobile responsive',
          'Lifetime updates',
          'Priority support'
        ]
      })
    } catch (err) {
      setError('Failed to load portfolio details')
      console.error('Load portfolio error:', err)
    }
  }

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Pay securely with Stripe',
      icon: CreditCard,
      available: true,
      currencies: ['USD', 'EUR', 'GBP']
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Fast & secure PayPal payment',
      icon: Wallet,
      available: true,
      currencies: ['USD', 'EUR', 'GBP']
    },
    {
      id: 'mpesa',
      name: 'M-Pesa',
      description: 'Mobile money payment (Kenya)',
      icon: Smartphone,
      available: true,
      currencies: ['KES']
    }
  ]

  const handlePaymentSuccess = async (paymentData) => {
    try {
      console.log('Payment successful:', paymentData)
      
      // Navigate to success page with payment details
      navigate('/payment/success', { 
        state: { 
          paymentId: paymentData.paymentId,
          portfolioId: portfolioDetails?.id,
          amount: portfolioDetails?.price
        }
      })
    } catch (err) {
      console.error('Post-payment error:', err)
      setError('Payment successful but failed to complete purchase')
    }
  }

  const handlePaymentError = (error) => {
    setError(error.message || 'Payment failed')
    console.error('Payment error:', error)
  }

  if (!portfolioDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
          <p className="text-gray-600">Secure checkout powered by industry-leading providers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary - Left/Top */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                {/* Portfolio Details */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{portfolioDetails.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{portfolioDetails.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Includes:</h4>
                    {portfolioDetails.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${portfolioDetails.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (0%)</span>
                    <span className="text-gray-900">$0.00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-primary-600">
                      ${portfolioDetails.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start space-x-2">
                  <Lock className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Secure Payment</p>
                    <p className="text-xs text-green-700">Your payment information is encrypted and secure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods - Right/Bottom */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Select Payment Method</h2>

              {/* Payment Method Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <button
                      key={method.id}
                      onClick={() => {
                        setSelectedMethod(method.id)
                        setError(null)
                      }}
                      disabled={!method.available}
                      className={`relative p-4 rounded-lg border-2 transition-all ${
                        selectedMethod === method.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!method.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <Icon className={`h-8 w-8 mb-2 ${
                          selectedMethod === method.id ? 'text-primary-600' : 'text-gray-400'
                        }`} />
                        <div className="font-medium text-sm text-gray-900">{method.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{method.description}</div>
                      </div>
                      {selectedMethod === method.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="h-5 w-5 text-primary-600" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-900">Payment Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Payment Forms */}
              <div className="border-t border-gray-200 pt-6">
                {selectedMethod === 'stripe' && (
                  <Elements stripe={stripePromise}>
                    <StripeCheckout
                      amount={portfolioDetails.price}
                      portfolioId={portfolioDetails.id}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Elements>
                )}

                {selectedMethod === 'paypal' && (
                  <PayPalCheckout
                    amount={portfolioDetails.price}
                    portfolioId={portfolioDetails.id}
                    description={portfolioDetails.name}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                )}

                {selectedMethod === 'mpesa' && (
                  <MpesaCheckout
                    amount={portfolioDetails.price * 130} // Convert USD to KES (approximate)
                    portfolioId={portfolioDetails.id}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                )}
              </div>

              {/* Terms */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By completing this purchase, you agree to our{' '}
                  <a href="/terms" className="text-primary-600 hover:text-primary-700">Terms of Service</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>
                </p>
              </div>
            </div>

            {/* Money-back Guarantee */}
            <div className="mt-6 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-8 w-8 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">30-Day Money-Back Guarantee</h3>
                  <p className="text-primary-100">
                    Not satisfied? Get a full refund within 30 days, no questions asked.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioCheckout
