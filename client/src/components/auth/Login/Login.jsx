import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Github, Twitter } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext.jsx'
import Button from '../../common/Button/Button'
import Input from '../../common/Form/Input'
import { authService } from '../../../services/auth'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('🚀 Starting login...')
      const response = await authService.login(formData)
      
      console.log('✅ Login response:', response)
      
      // Check if response has data property (nested structure)
      const userData = response.data || response
      const token = userData.token
      const user = userData.user
      
      console.log('📦 Extracted data:', { hasToken: !!token, hasUser: !!user })
      
      // API returns { data: { user, token } } or { user, token }
      if (token && user) {
        console.log('🔐 Logging in user...')
        await login({ user, token }) // Pass formatted object
        console.log('✅ Login successful, navigating to:', from)
        
        // Small delay to ensure state updates
        setTimeout(() => {
          navigate(from, { replace: true })
        }, 100)
      } else {
        console.error('❌ Invalid response format:', response)
        setError(response.message || 'Login failed - invalid response')
      }
    } catch (err) {
      console.error('❌ Login error:', err)
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'An error occurred during login'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider) => {
    try {
      // Redirect to OAuth provider
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`
    } catch (err) {
      setError(`Failed to connect to ${provider}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-primary-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary-100/10 to-blue-100/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-blue-600 rounded-lg" />
            <span className="text-2xl font-bold text-gray-900">E-Folio</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              create a new account
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full"
          >
            Sign in
          </Button>

          {/* OAuth Providers */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                icon={Github}
                onClick={() => handleOAuthLogin('github')}
                className="w-full"
              >
                GitHub
              </Button>
              <Button
                type="button"
                variant="outline"
                icon={Twitter}
                onClick={() => handleOAuthLogin('twitter')}
                className="w-full"
              >
                Twitter
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login