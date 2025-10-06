import React, { useState } from 'react'
import { CreditCard, Lock, CheckCircle } from 'lucide-react'
import Button from '../../../components/common/Button/Button'
import { paymentService } from '../../../services/payment'

const StripePayment = ({ amount, planId, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await paymentService.processStripePayment({
        amount,
        planId,
        cardDetails,
        currency: 'usd'
      })

      if (response.success) {
        onSuccess?.(response.data)
      } else {
        onError?.(response.message)
      }
    } catch (error) {
      onError?.(error.response?.data?.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    return parts.length ? parts.join(' ') : value
  }

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '')
    }
    return value
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Lock className="h-4 w-4" />
          <span>Secure payment</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.number}
              onChange={(e) => setCardDetails(prev => ({
                ...prev,
                number: formatCardNumber(e.target.value)
              }))}
              maxLength={19}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails(prev => ({
                ...prev,
                expiry: formatExpiry(e.target.value)
              }))}
              maxLength={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          {/* CVC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVC
            </label>
            <input
              type="text"
              placeholder="123"
              value={cardDetails.cvc}
              onChange={(e) => setCardDetails(prev => ({
                ...prev,
                cvc: e.target.value.replace(/\D/g, '')
              }))}
              maxLength={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={cardDetails.name}
            onChange={(e) => setCardDetails(prev => ({
              ...prev,
              name: e.target.value
            }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        {/* Amount Display */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Amount</span>
            <span className="text-2xl font-bold text-gray-900">${amount}</span>
          </div>
        </div>

        {/* Security Features */}
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            <span>256-bit SSL secure</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            <span>PCI compliant</span>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full"
        >
          Pay ${amount}
        </Button>

        <p className="text-center text-xs text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </div>
  )
}

export default StripePayment