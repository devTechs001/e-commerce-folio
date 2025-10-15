import React, { useState, useEffect } from 'react'
import { Smartphone, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react'
import { paymentService } from '../../services/payment'
import Button from '../common/Button/Button'

const MpesaCheckout = ({ amount, portfolioId, onSuccess, onError }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [processing, setProcessing] = useState(false)
  const [checkoutRequestID, setCheckoutRequestID] = useState(null)
  const [status, setStatus] = useState('idle') // idle, waiting, checking, success, failed
  const [message, setMessage] = useState('')
  const [checkInterval, setCheckInterval] = useState(null)

  useEffect(() => {
    // Cleanup interval on unmount
    return () => {
      if (checkInterval) {
        clearInterval(checkInterval)
      }
    }
  }, [checkInterval])

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    let cleaned = value.replace(/\D/g, '')
    
    // If starts with 0, replace with 254
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1)
    }
    
    // If doesn't start with 254, add it
    if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned
    }
    
    return cleaned
  }

  const validatePhoneNumber = (phone) => {
    const formatted = formatPhoneNumber(phone)
    // Kenyan phone numbers: 254XXXXXXXXX (12 digits total)
    return /^254\d{9}$/.test(formatted)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validatePhoneNumber(phoneNumber)) {
      setMessage('Please enter a valid Kenyan phone number (e.g., 0712345678)')
      return
    }

    setProcessing(true)
    setStatus('waiting')
    setMessage('Initiating M-Pesa payment...')

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber)

      // Initiate STK Push
      const response = await paymentService.initiatePayment({
        method: 'mpesa',
        phoneNumber: formattedPhone,
        amount,
        currency: 'KES',
        portfolioId,
        accountReference: `PORTFOLIO-${portfolioId}`,
        description: 'Portfolio Purchase'
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to initiate M-Pesa payment')
      }

      setCheckoutRequestID(response.checkoutRequestID)
      setMessage(response.message || 'Check your phone for M-Pesa prompt')
      setStatus('waiting')

      // Start checking payment status
      startStatusCheck(response.checkoutRequestID)
    } catch (err) {
      console.error('M-Pesa initiation error:', err)
      setMessage(err.message || 'Failed to initiate payment')
      setStatus('failed')
      onError(err)
    } finally {
      setProcessing(false)
    }
  }

  const startStatusCheck = (requestID) => {
    let attempts = 0
    const maxAttempts = 30 // Check for 2.5 minutes (30 * 5 seconds)

    const interval = setInterval(async () => {
      attempts++
      
      if (attempts > maxAttempts) {
        clearInterval(interval)
        setStatus('failed')
        setMessage('Payment timeout. Please try again.')
        return
      }

      try {
        setStatus('checking')
        const statusResult = await paymentService.checkMpesaStatus(requestID)

        if (statusResult.success) {
          if (statusResult.status === 'completed') {
            clearInterval(interval)
            setStatus('success')
            setMessage('Payment successful!')
            
            onSuccess({
              paymentId: statusResult.paymentId,
              checkoutRequestID: requestID,
              method: 'mpesa'
            })
          } else if (statusResult.status === 'failed') {
            clearInterval(interval)
            setStatus('failed')
            setMessage(statusResult.message || 'Payment failed')
            onError({ message: statusResult.message || 'Payment failed' })
          }
          // If pending, continue checking
        }
      } catch (err) {
        console.error('Status check error:', err)
      }
    }, 5000) // Check every 5 seconds

    setCheckInterval(interval)
  }

  const handleRetry = () => {
    setStatus('idle')
    setMessage('')
    setCheckoutRequestID(null)
    if (checkInterval) {
      clearInterval(checkInterval)
      setCheckInterval(null)
    }
  }

  const getStatusDisplay = () => {
    switch (status) {
      case 'waiting':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Smartphone className="h-6 w-6 text-blue-600 animate-pulse flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-900">Check Your Phone</h3>
                <p className="text-sm text-blue-700 mt-1">{message}</p>
                <p className="text-xs text-blue-600 mt-2">
                  Enter your M-Pesa PIN when prompted to complete the payment
                </p>
              </div>
            </div>
          </div>
        )
      
      case 'checking':
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Clock className="h-6 w-6 text-yellow-600 animate-spin flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-yellow-900">Verifying Payment</h3>
                <p className="text-sm text-yellow-700 mt-1">Please wait while we confirm your payment...</p>
              </div>
            </div>
          </div>
        )
      
      case 'success':
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-green-900">Payment Successful!</h3>
                <p className="text-sm text-green-700 mt-1">{message}</p>
              </div>
            </div>
          </div>
        )
      
      case 'failed':
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-900">Payment Failed</h3>
                <p className="text-sm text-red-700 mt-1">{message}</p>
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  size="sm"
                  icon={RefreshCw}
                  className="mt-3"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Smartphone className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-green-900">Pay with M-Pesa</h3>
            <p className="text-sm text-green-700 mt-1">
              Enter your Safaricom phone number to receive an M-Pesa payment prompt
            </p>
          </div>
        </div>
      </div>

      {/* Amount Display */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Total Amount:</span>
          <span className="text-2xl font-bold text-gray-900">KES {amount.toFixed(2)}</span>
        </div>
      </div>

      {/* Status Display */}
      {status !== 'idle' && getStatusDisplay()}

      {/* Payment Form */}
      {(status === 'idle' || status === 'failed') && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">+254</span>
              </div>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="712345678"
                required
                maxLength="10"
                className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Enter your Safaricom number (e.g., 0712345678 or 712345678)
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={processing || !phoneNumber}
            loading={processing}
            icon={Smartphone}
          >
            {processing ? 'Initiating Payment...' : `Pay KES ${amount.toFixed(2)}`}
          </Button>
        </form>
      )}

      {/* Instructions */}
      {status === 'idle' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">How it works:</h4>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start space-x-2">
              <span className="font-medium text-gray-900">1.</span>
              <span>Enter your M-Pesa registered phone number</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-medium text-gray-900">2.</span>
              <span>You'll receive an M-Pesa prompt on your phone</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-medium text-gray-900">3.</span>
              <span>Enter your M-Pesa PIN to complete the payment</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-medium text-gray-900">4.</span>
              <span>Wait for confirmation (usually takes a few seconds)</span>
            </li>
          </ol>
        </div>
      )}

      {/* Demo Mode Notice */}
      {import.meta.env.DEV && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-800 font-medium mb-1">Sandbox Mode</p>
          <p className="text-xs text-yellow-700">
            Use test number: 254708374149 for testing. Real payments are disabled in development mode.
          </p>
        </div>
      )}
    </div>
  )
}

export default MpesaCheckout
