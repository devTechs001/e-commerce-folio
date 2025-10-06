import React, { useState, useEffect } from 'react'
import { Share2, Facebook, Twitter, Linkedin, Instagram, Github, Link, CheckCircle, XCircle } from 'lucide-react'
import Button from '../../common/Button/Button'
import { integrationService } from '../../../services/integration'

const SocialMedia = () => {
  const [integrations, setIntegrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(null)

  const socialPlatforms = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-600',
      description: 'Connect your LinkedIn profile to showcase professional experience',
      connected: false,
      scopes: ['profile', 'email']
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      color: 'bg-gray-800',
      description: 'Import your GitHub repositories and contributions',
      connected: false,
      scopes: ['repo', 'user']
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-400',
      description: 'Display your latest tweets and Twitter activity',
      connected: false,
      scopes: ['tweet.read', 'users.read']
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-pink-600',
      description: 'Showcase your Instagram portfolio and latest posts',
      connected: false,
      scopes: ['instagram_basic', 'instagram_content_publish']
    }
  ]

  useEffect(() => {
    loadIntegrations()
  }, [])

  const loadIntegrations = async () => {
    try {
      setLoading(true)
      const response = await integrationService.getSocialIntegrations()
      if (response.success) {
        // Update platform status based on API response
        const updatedPlatforms = socialPlatforms.map(platform => ({
          ...platform,
          connected: response.data.some(integration => integration.platform === platform.id)
        }))
        setIntegrations(updatedPlatforms)
      }
    } catch (error) {
      console.error('Error loading integrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (platformId) => {
    setConnecting(platformId)
    try {
      const response = await integrationService.connectSocial(platformId)
      if (response.success && response.data.authUrl) {
        // Redirect to OAuth flow
        window.location.href = response.data.authUrl
      }
    } catch (error) {
      console.error('Error connecting platform:', error)
    } finally {
      setConnecting(null)
    }
  }

  const handleDisconnect = async (platformId) => {
    if (!window.confirm(`Are you sure you want to disconnect ${platformId}?`)) {
      return
    }

    try {
      const response = await integrationService.disconnectSocial(platformId)
      if (response.success) {
        // Update local state
        setIntegrations(prev => prev.map(platform =>
          platform.id === platformId ? { ...platform, connected: false } : platform
        ))
      }
    } catch (error) {
      console.error('Error disconnecting platform:', error)
    }
  }

  const handleSyncData = async (platformId) => {
    try {
      const response = await integrationService.syncSocialData(platformId)
      if (response.success) {
        // Show success message or update UI
        console.log('Data synced successfully for:', platformId)
      }
    } catch (error) {
      console.error('Error syncing data:', error)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="w-24 h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Social Media Integrations</h3>
          <p className="text-gray-600">Connect your social profiles to enhance your portfolio</p>
        </div>
        <Share2 className="h-6 w-6 text-primary-600" />
      </div>

      <div className="space-y-4">
        {integrations.map((platform) => {
          const PlatformIcon = platform.icon
          return (
            <div
              key={platform.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center`}>
                  <PlatformIcon className="h-6 w-6 text-white" />
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">{platform.name}</h4>
                  <p className="text-sm text-gray-600">{platform.description}</p>
                  
                  {platform.connected && (
                    <div className="flex items-center space-x-2 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Connected</span>
                      <span className="text-xs text-gray-500">Last synced: 2 hours ago</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {platform.connected ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSyncData(platform.id)}
                    >
                      Sync Data
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(platform.id)}
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    loading={connecting === platform.id}
                    onClick={() => handleConnect(platform.id)}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Integration Benefits */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-3">Benefits of Social Integration</h4>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Automatically import your work experience and projects
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Show real-time activity and updates from your social profiles
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Increase engagement with cross-platform sharing
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Maintain consistent branding across all platforms
          </li>
        </ul>
      </div>
    </div>
  )
}

export default SocialMedia