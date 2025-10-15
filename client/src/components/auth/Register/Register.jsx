import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User } from 'lucide-react'
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
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      })

      // API returns { message, user, token }
      if (response.token && response.user) {
        // Auto-login after registration
        await login(response) // Pass the full response object
        navigate('/dashboard')
      } else {
        setError(response.message || 'Registration failed')
      }
    } catch (err) {
      console.error('Registration error:', err)
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'An error occurred during registration'
      setError(errorMsg)
    } finally {
      setLoading(false)
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
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
              sign in to your existing account
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
            {formData.password && (
              <div className="mt-2">
                <div className="flex space-x-1 mb-1">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {passwordStrength === 0 && 'Enter a password'}
                  {passwordStrength === 1 && 'Weak password'}
                  {passwordStrength === 2 && 'Fair password'}
                  {passwordStrength === 3 && 'Good password'}
                  {passwordStrength === 4 && 'Strong password'}
                </p>
              </div>
            )}
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
        </form>
      </div>
    </div>
  )
}

export default Register