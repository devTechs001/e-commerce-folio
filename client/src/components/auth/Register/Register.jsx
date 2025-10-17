import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, CheckCircle, Chrome, Github, Twitter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../../context/AuthContext.jsx'
import Button from '../../common/Button/Button'
import Input from '../../common/Form/Input'
import { authService } from '../../../services/auth'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')

    if (field === 'password') {
      calculatePasswordStrength(value)
    }
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    setPasswordStrength(strength)
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-gray-200'
      case 1: return 'bg-red-500'
      case 2: return 'bg-orange-500'
      case 3: return 'bg-yellow-500'
      case 4: return 'bg-green-500'
      default: return 'bg-gray-200'
    }
  }

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('All fields are required')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return false
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      console.log('🚀 Starting registration...')
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      })

      console.log('✅ Registration response:', response)

      // Check if response has data property (nested structure)
      const userData = response.data || response
      const token = userData.token
      const user = userData.user
      
      console.log('📦 Extracted data:', { hasToken: !!token, hasUser: !!user })

      // API returns { data: { user, token } } or { user, token }
      if (token && user) {
        console.log('🔐 Logging in user...')
        // Auto-login after registration
        await login({ user, token }) // Pass formatted object
        console.log('✅ Login successful, navigating to dashboard...')
        
        // Small delay to ensure state updates
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 100)
      } else {
        console.error('❌ Invalid response format:', response)
        setError(response.message || 'Registration failed - invalid response')
      }
    } catch (err) {
      console.error('❌ Registration error:', err)
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'An error occurred during registration'
      setError(errorMsg)
    } finally {
      setLoading(false)
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
            Start your journey
          </motion.h2>
          <p className="mt-2 text-sm text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300 transition-colors">
              Sign in <ArrowRight className="inline h-4 w-4" />
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

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First name"
              type="text"
              icon={User}
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
              autoComplete="given-name"
            />

            <Input
              label="Last name"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
              autoComplete="family-name"
            />
          </div>

          <Input
            label="Email address"
            type="email"
            icon={Mail}
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            autoComplete="email"
          />

          <div>
            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
              autoComplete="new-password"
            />
            
            {/* Password Strength Meter */}
            <AnimatePresence>
              {formData.password && (
                <motion.div 
                  className="mt-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="flex space-x-1 mb-1">
                    {[1, 2, 3, 4].map(i => (
                      <motion.div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: i <= passwordStrength ? 1 : 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    {passwordStrength === 0 && 'Enter a password'}
                    {passwordStrength === 1 && 'Weak password'}
                    {passwordStrength === 2 && 'Fair password'}
                    {passwordStrength === 3 && '✓ Good password'}
                    {passwordStrength === 4 && <><CheckCircle className="h-3 w-3 text-green-500" /> Strong password</>}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Input
            label="Confirm password"
            type="password"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            required
            autoComplete="new-password"
            error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
          />

          <div className="flex items-center">
            <input
              id="agree-to-terms"
              name="agree-to-terms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="agree-to-terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full"
          >
            Create account
          </Button>
          
          {/* Social Registration */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <motion.button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Github className="h-5 w-5" />
              </motion.button>
              <motion.button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Chrome className="h-5 w-5" />
              </motion.button>
              <motion.button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Twitter className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </motion.form>
        
        {/* Additional Info */}
        <motion.div 
          className="text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-gray-300">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-primary-400 hover:text-primary-300">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary-400 hover:text-primary-300">Privacy Policy</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Register