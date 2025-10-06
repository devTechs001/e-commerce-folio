import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, CheckCircle } from 'lucide-react'
import Button from '../../common/Button/Button'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, you would call your password reset API here
      // await authService.forgotPassword(email)
      
      setSuccess(true)
    } catch (err) {
      setError('Failed to send reset email. Please try again.',err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center">
              <div className="bg-gradient-to-r from-primary-600 to-blue-600 p-2 rounded-lg">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="ml-2 text-2xl font-bold text-gray-900">Folio</span>
            </Link>
          </div>

          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Check your email
            </h3>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and follow the instructions.
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors block text-center"
              >
                Back to Login
              </Link>
              <p className="text-sm text-gray-600">
                Didn't receive the email?{' '}
                <button
                  onClick={() => setSuccess(false)}
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center">
            <div className="bg-gradient-to-r from-primary-600 to-blue-600 p-2 rounded-lg">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="ml-2 text-2xl font-bold text-gray-900">Folio</span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              loading={loading}
              className="w-full py-3 text-base"
            >
              Send reset link
            </Button>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-500 font-medium text-sm"
              >
                ← Back to login
              </Link>
            </div>
          </form>
        </div>

        {/* Footer Links */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Remember your password?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword