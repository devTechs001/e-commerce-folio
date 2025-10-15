import React, { useState, useEffect, useRef } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { paymentService } from '../../services/payment'

const PayPalCheckout = ({ amount, portfolioId, description, onSuccess, onError }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orderId, setOrderId] = useState(null)
  const paypalRef = useRef(null)

  useEffect(() => {
    // Load PayPal SDK
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID || 'demo'}&currency=USD`
    script.async = true
    
    script.onload = () => {
      setLoading(false)
      initializePayPalButton()
    }
    
    script.onerror = () => {
      setError('Failed to load PayPal SDK')
      setLoading(false)
    }

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
      // Clear PayPal button container
      if (paypalRef.current) {
        paypalRef.current.innerHTML = ''
      }
    }
  }, [])

  const initializePayPalButton = () => {
    if (!window.paypal || !paypalRef.current) {
      return
    }

    // Clear any existing buttons
    paypalRef.current.innerHTML = ''

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal',
        height: 48
      },

      createOrder: async () => {
        try {
          // Create order on backend
          const response = await paymentService.initiatePayment({
            method: 'paypal',
            amount,
            currency: 'USD',
            portfolioId,
            description: description || 'Portfolio Purchase',
            returnUrl: `${window.location.origin}/payment/success`,
            cancelUrl: `${window.location.origin}/payment/cancel`
          })

          if (!response.success || !response.orderId) {
            throw new Error('Failed to create PayPal order')
          }

          setOrderId(response.orderId)
          return response.orderId
        } catch (err) {
          console.error('Create order error:', err)
          setError(err.message)
          throw err
        }
      },

      onApprove: async (data) => {
        try {
          // Capture payment on backend
          const response = await paymentService.capturePayPalPayment(data.orderID)

          if (response.success) {
            onSuccess({
              paymentId: response.paymentId,
              orderId: data.orderID,
              method: 'paypal'
            })
          } else {
            throw new Error('Failed to capture payment')
          }
        } catch (err) {
          console.error('Capture payment error:', err)
          onError(err)
        }
      },

      onError: (err) => {
        console.error('PayPal error:', err)
        setError('Payment failed. Please try again.')
        onError(err)
      },

      onCancel: () => {
        setError('Payment was cancelled')
        onError({ message: 'Payment cancelled by user' })
      }
    }).render(paypalRef.current)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mb-4"></div>
        <p className="text-gray-600">Loading PayPal...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-red-900">Error</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">Fast & Secure with PayPal</h3>
            <p className="text-sm text-blue-700 mt-1">
              Pay with your PayPal balance, bank account, or credit card. Your financial information is never shared.
            </p>
          </div>
        </div>
      </div>

      {/* Amount Display */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Total Amount:</span>
          <span className="text-2xl font-bold text-gray-900">${amount.toFixed(2)} USD</span>
        </div>
      </div>

      {/* PayPal Button Container */}
      <div ref={paypalRef} id="paypal-button-container"></div>

      {/* Security Note */}
      <div className="text-center text-xs text-gray-500">
        <p>Protected by PayPal's Buyer Protection</p>
      </div>

      {/* Demo Mode Notice */}
      {import.meta.env.DEV && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-800 font-medium mb-1">Demo Mode</p>
          <p className="text-xs text-yellow-700">
            Use PayPal sandbox account for testing. Real payments are disabled in development mode.
          </p>
        </div>
      )}
    </div>
  )
}

export default PayPalCheckout
