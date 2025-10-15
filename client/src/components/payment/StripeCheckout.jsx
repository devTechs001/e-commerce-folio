import React, { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Lock, CreditCard } from 'lucide-react'
import { paymentService } from '../../services/payment'
import Button from '../common/Button/Button'

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#1F2937',
      fontFamily: '"Inter", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#9CA3AF'
      }
    },
    invalid: {
      color: '#EF4444',
      iconColor: '#EF4444'
    }
  }
}

const StripeCheckout = ({ amount, portfolioId, onSuccess, onError }) => {
  const stripe = useStripe()
  const elements = useElements()
  
  const [processing, setProcessing] = useState(false)
  const [cardComplete, setCardComplete] = useState(false)
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: ''
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    if (!cardComplete) {
      onError({ message: 'Please complete your card details' })
      return
    }

    setProcessing(true)

    try {
      // Create payment intent
      const paymentData = await paymentService.initiatePayment({
        method: 'stripe',
        amount,
        currency: 'usd',
        portfolioId
      })

      if (!paymentData.success || !paymentData.clientSecret) {
        throw new Error('Failed to create payment intent')
      }

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        paymentData.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: billingDetails.name,
              email: billingDetails.email
            }
          }
        }
      )

      if (error) {
        throw error
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess({
          paymentId: paymentData.paymentId,
          paymentIntentId: paymentIntent.id,
          method: 'stripe'
        })
      } else {
        throw new Error('Payment not completed')
      }
    } catch (err) {
      console.error('Stripe payment error:', err)
      onError(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleCardChange = (event) => {
    setCardComplete(event.complete)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Billing Details */}
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name
          </label>
          <input
            id="name"
            type="text"
            value={billingDetails.name}
            onChange={(e) => setBillingDetails({ ...billingDetails, name: e.target.value })}
            placeholder="John Doe"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={billingDetails.email}
            onChange={(e) => setBillingDetails({ ...billingDetails, email: e.target.value })}
            placeholder="john@example.com"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Card Element */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="p-4 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={handleCardChange}
          />
        </div>
      </div>

      {/* Security Info */}
      <div className="flex items-start space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <Lock className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <p>
          Your payment is secured with 256-bit SSL encryption. We never store your card details.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!stripe || processing || !cardComplete || !billingDetails.name || !billingDetails.email}
        loading={processing}
        icon={CreditCard}
      >
        {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </Button>

      {/* Test Cards Info */}
      {import.meta.env.DEV && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-800 font-medium mb-1">Test Mode - Use these cards:</p>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>Success: 4242 4242 4242 4242</li>
            <li>Decline: 4000 0000 0000 0002</li>
            <li>3D Secure: 4000 0027 6000 3184</li>
          </ul>
        </div>
      )}
    </form>
  )
}

export default StripeCheckout
