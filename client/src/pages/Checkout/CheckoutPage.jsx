import React, { useState } from 'react'
import { CreditCard, Lock, Check, ArrowLeft, Shield } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'

const CheckoutForm = ({ plan, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create checkout session
      const { data } = await axios.post('/api/payments/create-checkout-session', {
        planId: plan.id,
        billingDetails,
        successUrl: `${window.location.origin}/dashboard/billing?success=true`,
        cancelUrl: `${window.location.origin}/checkout?canceled=true`
      })

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else {
        toast.success('Payment processed successfully!')
        onSuccess()
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error.response?.data?.error || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Billing Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={billingDetails.name}
              onChange={(e) => setBillingDetails({ ...billingDetails, name: e.target.value })}
              required
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={billingDetails.email}
              onChange={(e) => setBillingDetails({ ...billingDetails, email: e.target.value })}
              required
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <input
            type="text"
            placeholder="Address"
            value={billingDetails.address}
            onChange={(e) => setBillingDetails({ ...billingDetails, address: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="City"
              value={billingDetails.city}
              onChange={(e) => setBillingDetails({ ...billingDetails, city: e.target.value })}
              required
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="Country"
              value={billingDetails.country}
              onChange={(e) => setBillingDetails({ ...billingDetails, country: e.target.value })}
              required
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="ZIP Code"
              value={billingDetails.zipCode}
              onChange={(e) => setBillingDetails({ ...billingDetails, zipCode: e.target.value })}
              required
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Card Number"
            value={billingDetails.cardNumber}
            onChange={(e) => setBillingDetails({ ...billingDetails, cardNumber: e.target.value })}
            maxLength="19"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              value={billingDetails.expiry}
              onChange={(e) => setBillingDetails({ ...billingDetails, expiry: e.target.value })}
              maxLength="5"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="CVC"
              value={billingDetails.cvc}
              onChange={(e) => setBillingDetails({ ...billingDetails, cvc: e.target.value })}
              maxLength="4"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-start space-x-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">Secure Payment</p>
          <p className="text-sm text-blue-700">Your payment information is encrypted and secure</p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        <Lock className="w-5 h-5" />
        <span>{loading ? 'Processing...' : `Pay $${plan.price}/month`}</span>
      </button>
    </form>
  )
}

const CheckoutPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const plan = location.state?.plan || {
    id: 'pro',
    name: 'Pro',
    price: 12,
    features: [
      'Unlimited Portfolios',
      'All Premium Templates',
      'Custom Domain',
      'AI Content Assistant',
      'Advanced Analytics',
      'Priority Support'
    ]
  }

  const handleSuccess = () => {
    navigate('/dashboard/billing?success=true')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Purchase</h1>
          <p className="text-gray-600 mt-2">Subscribe to {plan.name} plan and unlock all features</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <CheckoutForm plan={plan} onSuccess={handleSuccess} />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {/* Plan Details */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">{plan.name} Plan</span>
                  <span className="font-semibold text-gray-900">${plan.price}/mo</span>
                </div>
                <div className="text-sm text-gray-500">Billed monthly</div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Included Features:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">${plan.price}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-900">$0.00</span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary-600">${plan.price}/mo</span>
                </div>
              </div>

              {/* Money Back Guarantee */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900 mb-1">30-Day Money Back Guarantee</p>
                <p className="text-sm text-green-700">Cancel anytime, no questions asked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex items-center justify-center space-x-8 text-gray-400">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <span className="text-sm">Secure Checkout</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm">SSL Encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span className="text-sm">Stripe Powered</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
