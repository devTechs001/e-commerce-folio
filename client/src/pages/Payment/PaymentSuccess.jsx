import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Download, ArrowRight, Home, Mail } from 'lucide-react'
import Confetti from 'react-confetti'
import Button from '../../components/common/Button/Button'

const PaymentSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showConfetti, setShowConfetti] = useState(true)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  const paymentData = location.state || {}
  const {
    paymentId,
    portfolioId,
    amount,
    method
  } = paymentData

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    // Handle window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleDownload = () => {
    // TODO: Implement portfolio download
    console.log('Downloading portfolio:', portfolioId)
    alert('Portfolio download started! Check your downloads folder.')
  }

  const handleViewPortfolio = () => {
    navigate(`/dashboard/portfolio/${portfolioId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-primary-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Success Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-full p-6">
                <CheckCircle className="h-16 w-16 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Payment Successful! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your portfolio purchase has been completed successfully
          </p>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {paymentId && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment ID</p>
                  <p className="font-mono text-sm font-medium text-gray-900">{paymentId}</p>
                </div>
              )}
              {amount && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
                  <p className="text-lg font-bold text-green-600">${amount.toFixed(2)}</p>
                </div>
              )}
              {method && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                  <p className="font-medium text-gray-900 capitalize">{method}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500 mb-1">Date</p>
                <p className="font-medium text-gray-900">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8 text-left">
            <h2 className="text-lg font-bold text-blue-900 mb-4">What's Next?</h2>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-800">
                  A confirmation email has been sent to your email address
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-800">
                  Your portfolio is now available in your dashboard
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-800">
                  You can customize and publish your portfolio anytime
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleViewPortfolio}
              icon={ArrowRight}
              className="w-full"
            >
              View My Portfolio
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleDownload}
              icon={Download}
              className="w-full"
            >
              Download Files
            </Button>
          </div>

          {/* Additional Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Go to Dashboard</span>
            </button>
            <span className="text-gray-300 hidden sm:block">|</span>
            <button
              onClick={() => window.location.href = 'mailto:support@efolio.com'}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>Contact Support</span>
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@efolio.com" className="text-primary-600 hover:text-primary-700 font-medium">
              support@efolio.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
