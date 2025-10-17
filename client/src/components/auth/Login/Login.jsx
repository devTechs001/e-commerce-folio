import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Github, Twitter, Chrome, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-primary-900 to-blue-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <motion.div 
        className="max-w-md w-full space-y-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 group">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-r from-primary-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span className="text-white font-bold text-xl">E</span>
            </motion.div>
            <span className="text-2xl font-bold text-white group-hover:text-primary-300 transition-colors">E-Folio</span>
          </Link>
          <motion.h2 
            className="mt-6 text-3xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome back!
          </motion.h2>
          <p className="mt-2 text-sm text-gray-300">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-400 hover:text-primary-300 transition-colors">
              Sign up for free <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>

        {/* Form */}
        <motion.form 
          className="mt-8 space-y-6 bg-white/95 backdrop-blur-md p-8 rounded-2xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
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

            <div className="mt-6 grid grid-cols-3 gap-3">
              <motion.button
                type="button"
                onClick={() => handleOAuthLogin('github')}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Github className="h-5 w-5" />
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleOAuthLogin('google')}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Chrome className="h-5 w-5" />
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleOAuthLogin('twitter')}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Twitter className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </motion.form>
        
        {/* Additional Links */}
        <motion.div 
          className="text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-gray-300">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-primary-400 hover:text-primary-300">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary-400 hover:text-primary-300">Privacy Policy</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login