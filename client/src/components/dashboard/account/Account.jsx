import React, { useState, useEffect } from 'react'
import { User, Shield, Bell, Trash2 } from 'lucide-react'
import Button from '../../common/Button/Button'
import Input from '../../common/Form/Input'
import { authService } from '../../../services/auth'

const Account = () => {
  const [account, setAccount] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    marketingEmails: false,
    securityAlerts: true
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadAccountData()
  }, [])

  const loadAccountData = async () => {
    try {
      const response = await authService.getCurrentUser()
      if (response.success) {
        setAccount(prev => ({
          ...prev,
          firstName: response.data.profile?.firstName || '',
          lastName: response.data.profile?.lastName || '',
          email: response.data.email || ''
        }))
      }
    } catch (error) {
      console.error('Error loading account data:', error)
    }
  }

  const handleUpdateAccount = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await authService.updateProfile({
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email
      })

      if (response.success) {
        setMessage('Account updated successfully!')
      }
    } catch (error) {
      setMessage('Error updating account: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    if (account.newPassword !== account.confirmPassword) {
      setMessage('New passwords do not match')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await authService.changePassword({
        currentPassword: account.currentPassword,
        newPassword: account.newPassword
      })

      if (response.success) {
        setMessage('Password changed successfully!')
        setAccount(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
      }
    } catch (error) {
      setMessage('Error changing password: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    try {
      const response = await authService.deleteAccount()
      if (response.success) {
        window.location.href = '/'
      }
    } catch (error) {
      setMessage('Error deleting account: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <User className="h-6 w-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
        </div>

        <form onSubmit={handleUpdateAccount} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={account.firstName}
              onChange={(e) => setAccount(prev => ({ ...prev, firstName: e.target.value }))}
              required
            />
            <Input
              label="Last Name"
              value={account.lastName}
              onChange={(e) => setAccount(prev => ({ ...prev, lastName: e.target.value }))}
              required
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            value={account.email}
            onChange={(e) => setAccount(prev => ({ ...prev, email: e.target.value }))}
            required
          />

          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={loading}>
              Update Account
            </Button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-6 w-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={account.currentPassword}
            onChange={(e) => setAccount(prev => ({ ...prev, currentPassword: e.target.value }))}
            required
          />

          <Input
            label="New Password"
            type="password"
            value={account.newPassword}
            onChange={(e) => setAccount(prev => ({ ...prev, newPassword: e.target.value }))}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={account.confirmPassword}
            onChange={(e) => setAccount(prev => ({ ...prev, confirmPassword: e.target.value }))}
            required
          />

          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={loading}>
              Change Password
            </Button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="h-6 w-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive important updates about your account</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={(e) => setPreferences(prev => ({ ...prev, emailNotifications: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Marketing Emails</h4>
              <p className="text-sm text-gray-600">Receive updates about new features and promotions</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.marketingEmails}
              onChange={(e) => setPreferences(prev => ({ ...prev, marketingEmails: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Security Alerts</h4>
              <p className="text-sm text-gray-600">Get notified about important security events</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.securityAlerts}
              onChange={(e) => setPreferences(prev => ({ ...prev, securityAlerts: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Trash2 className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-red-900">Delete Account</h4>
            <p className="text-sm text-red-700">
              Permanently delete your account and all associated data
            </p>
          </div>
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('Error') 
            ? 'bg-red-50 border border-red-200 text-red-700'
            : 'bg-green-50 border border-green-200 text-green-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
}

export default Account