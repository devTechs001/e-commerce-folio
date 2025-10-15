import React, { useState } from 'react'
import { User, Mail, Lock, Bell, Shield, Palette, Globe, Save, Key, Link2, Database, Download, Trash2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import Button from '../common/Button/Button'
import Input from '../common/Form/Input'
import toast from 'react-hot-toast'
import axios from 'axios'

const Settings = () => {
  const { user, login } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  
  const [profile, setProfile] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    email: user?.email || '',
    bio: user?.profile?.bio || '',
    title: user?.profile?.title || '',
    avatar: user?.profile?.avatar || ''
  })

  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [preferences, setPreferences] = useState({
    theme: user?.preferences?.theme || 'light',
    notifications: {
      email: user?.preferences?.notifications?.email ?? true,
      portfolioViews: user?.preferences?.notifications?.portfolioViews ?? true,
      newFeatures: user?.preferences?.notifications?.newFeatures ?? true
    }
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Mail },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'api', label: 'API & Keys', icon: Key },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data', icon: Database }
  ]

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await axios.put('/api/auth/profile', {
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio,
        title: profile.title
      })
      
      // Update local user data
      await login({ ...user, profile: response.data.user.profile })
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (password.newPassword !== password.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (password.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      await axios.put('/api/auth/change-password', {
        currentPassword: password.currentPassword,
        newPassword: password.newPassword
      })
      
      toast.success('Password changed successfully')
      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await axios.put('/api/auth/preferences', preferences)
      await login({ ...user, preferences })
      toast.success('Preferences updated successfully')
    } catch (error) {
      toast.error('Failed to update preferences')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              
              {/* Avatar */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.firstName?.[0]}{profile.lastName?.[0]}
                </div>
                <div>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  required
                />
                <Input
                  label="Last Name"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  required
                />
              </div>

              <Input
                label="Professional Title"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                placeholder="e.g., Full Stack Developer"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3"
                  placeholder="Tell us about yourself..."
                />
                <p className="text-sm text-gray-500 mt-1">{profile.bio?.length || 0}/500 characters</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={loading}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Email Address</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Account Role</p>
                    <p className="text-sm text-gray-600 capitalize">{user?.role || 'user'}</p>
                  </div>
                  <span className="badge-primary capitalize">{user?.role || 'user'}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Subscription Plan</p>
                    <p className="text-sm text-gray-600 capitalize">{user?.subscription?.plan || 'free'}</p>
                  </div>
                  <Button variant="outline" size="sm">Upgrade</Button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-red-600 mb-2">Danger Zone</h4>
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Delete Account</p>
                  <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                </div>
                <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  value={password.currentPassword}
                  onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })}
                  required
                />
                <Input
                  label="New Password"
                  type="password"
                  value={password.newPassword}
                  onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                  required
                  helperText="Must be at least 8 characters"
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={password.confirmPassword}
                  onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                  required
                  error={password.confirmPassword && password.newPassword !== password.confirmPassword ? 'Passwords do not match' : ''}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={loading}>
                Update Password
              </Button>
            </div>
          </form>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <form onSubmit={handlePreferencesSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', description: 'Receive email updates about your account' },
                  { key: 'portfolioViews', label: 'Portfolio Views', description: 'Get notified when someone views your portfolio' },
                  { key: 'newFeatures', label: 'New Features', description: 'Learn about new features and updates' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.notifications[item.key]}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          notifications: { ...preferences.notifications, [item.key]: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={loading}>
                Save Preferences
              </Button>
            </div>
          </form>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <form onSubmit={handlePreferencesSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Preferences</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['light', 'dark', 'auto'].map((theme) => (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => setPreferences({ ...preferences, theme })}
                        className={`p-4 border-2 rounded-lg capitalize transition-all ${
                          preferences.theme === theme
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option value="UTC">UTC (GMT+0)</option>
                    <option value="EST">Eastern Time (GMT-5)</option>
                    <option value="PST">Pacific Time (GMT-8)</option>
                    <option value="CET">Central European Time (GMT+1)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={loading}>
                Save Preferences
              </Button>
            </div>
          </form>
        )}

        {/* API & Keys Tab */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">API Keys</h3>
              <p className="text-sm text-gray-600 mb-4">Manage your API keys for external integrations</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Production API Key</p>
                    <p className="text-sm text-gray-600 font-mono">pk_live_••••••••••••••••</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" icon={Eye}>View</Button>
                    <Button variant="outline" size="sm">Copy</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Development API Key</p>
                    <p className="text-sm text-gray-600 font-mono">pk_test_••••••••••••••••</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" icon={Eye}>View</Button>
                    <Button variant="outline" size="sm">Copy</Button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="primary" icon={Key}>Generate New Key</Button>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Webhooks</h4>
              <p className="text-sm text-gray-600 mb-4">Configure webhook endpoints for real-time notifications</p>
              <Button variant="outline" icon={Link2}>Add Webhook</Button>
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Integrations</h3>
              <p className="text-sm text-gray-600 mb-4">Manage your third-party integrations</p>
              
              <div className="space-y-4">
                {[
                  { name: 'Google Analytics', status: 'connected', icon: '📊' },
                  { name: 'GitHub', status: 'connected', icon: '🐙' },
                  { name: 'Stripe', status: 'disconnected', icon: '💳' },
                  { name: 'Mailchimp', status: 'disconnected', icon: '📧' }
                ].map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{integration.name}</p>
                        <p className={`text-sm ${
                          integration.status === 'connected' ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {integration.status === 'connected' ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant={integration.status === 'connected' ? 'outline' : 'primary'}
                      size="sm"
                    >
                      {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
              
              <div className="space-y-4">
                {[
                  { key: 'profilePublic', label: 'Public Profile', description: 'Make your profile visible to everyone' },
                  { key: 'showEmail', label: 'Show Email', description: 'Display your email on your public profile' },
                  { key: 'showStats', label: 'Show Statistics', description: 'Display portfolio view statistics publicly' },
                  { key: 'allowMessages', label: 'Allow Messages', description: 'Let users send you direct messages' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Data Collection</h4>
              <p className="text-sm text-gray-600 mb-4">Control how we collect and use your data</p>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  <span className="text-sm text-gray-700">Analytics & Performance Data</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  <span className="text-sm text-gray-700">Marketing Communications</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Data Tab */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Download className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900 mb-1">Export Your Data</h4>
                      <p className="text-sm text-blue-700 mb-3">Download all your data including portfolios, projects, and settings</p>
                      <Button variant="outline" size="sm" icon={Download}>
                        Request Data Export
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Storage Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Used</span>
                      <span className="font-medium text-gray-900">2.4 GB of 10 GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Trash2 className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-900 mb-1">Clear All Data</h4>
                      <p className="text-sm text-red-700 mb-3">Permanently delete all your data including portfolios and projects</p>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                        Clear Data
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Need Help?</h4>
            <p className="text-sm text-blue-700">Visit our <a href="/help" className="underline">Help Center</a> or contact support for assistance with your settings.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings


