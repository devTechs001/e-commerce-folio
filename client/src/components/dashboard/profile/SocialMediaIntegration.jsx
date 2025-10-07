import React, { useState, useEffect } from 'react'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github, 
  Youtube,
  Globe,
  Link as LinkIcon,
  Check,
  X,
  Plus,
  Settings,
  Share2,
  Users
} from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import { subscriptionService } from '../../../services/subscription'

const SocialMediaIntegration = () => {
  const { user, updateUser } = useAuth()
  const [userTier, setUserTier] = useState('standard')
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    github: '',
    youtube: '',
    website: '',
    behance: '',
    dribbble: '',
    medium: ''
  })
  const [connectedAccounts, setConnectedAccounts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSocialData()
  }, [user])

  const loadSocialData = async () => {
    try {
      const tier = await subscriptionService.getUserTier()
      setUserTier(tier)
      
      // Load existing social links from user profile
      if (user?.socialLinks) {
        setSocialLinks(prev => ({
          ...prev,
          ...user.socialLinks
        }))
      }
      
      // Mock connected accounts (would come from OAuth integrations)
      setConnectedAccounts(['linkedin', 'github'])
    } catch (error) {
      console.error('Error loading social data:', error)
    }
  }

  const socialPlatforms = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'blue',
      tier: 'standard',
      description: 'Connect your professional network',
      features: ['Auto-post portfolio updates', 'Import connections', 'Professional networking']
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      color: 'gray',
      tier: 'standard',
      description: 'Showcase your code repositories',
      features: ['Display repositories', 'Show contribution graph', 'Import project data']
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'blue',
      tier: 'premium',
      description: 'Share your work with the world',
      features: ['Auto-tweet updates', 'Schedule posts', 'Analytics integration']
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'pink',
      tier: 'premium',
      description: 'Visual portfolio sharing',
      features: ['Auto-post images', 'Story integration', 'Hashtag optimization']
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'blue',
      tier: 'premium',
      description: 'Reach broader audiences',
      features: ['Page integration', 'Event promotion', 'Audience insights']
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'red',
      tier: 'premium',
      description: 'Video portfolio showcase',
      features: ['Channel integration', 'Video embedding', 'Analytics tracking']
    },
    {
      id: 'behance',
      name: 'Behance',
      icon: Globe,
      color: 'purple',
      tier: 'premium',
      description: 'Creative portfolio platform',
      features: ['Project sync', 'Creative network', 'Portfolio showcase']
    },
    {
      id: 'dribbble',
      name: 'Dribbble',
      icon: Globe,
      color: 'pink',
      tier: 'premium',
      description: 'Design community platform',
      features: ['Shot integration', 'Design showcase', 'Community engagement']
    }
  ]

  const canAccess = (platform) => {
    if (platform.tier === 'standard') return true
    return userTier === 'premium'
  }

  const isConnected = (platformId) => {
    return connectedAccounts.includes(platformId)
  }

  const handleConnect = async (platform) => {
    if (!canAccess(platform)) {
      alert('This integration requires a Premium subscription. Please upgrade your plan.')
      return
    }

    setLoading(true)
    try {
      if (isConnected(platform.id)) {
        // Disconnect
        setConnectedAccounts(prev => prev.filter(id => id !== platform.id))
        alert(`Disconnected from ${platform.name}`)
      } else {
        // Connect (in real app, this would trigger OAuth flow)
        setConnectedAccounts(prev => [...prev, platform.id])
        alert(`Connected to ${platform.name} (Demo mode)`)
      }
    } catch (error) {
      console.error('Error connecting to platform:', error)
      alert('Error connecting to platform. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLinkUpdate = (platform, value) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }))
  }

  const handleSaveLinks = async () => {
    setLoading(true)
    try {
      await updateUser({ socialLinks })
      alert('Social links updated successfully!')
    } catch (error) {
      console.error('Error updating social links:', error)
      alert('Error updating social links. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getConnectedCount = () => {
    return connectedAccounts.length
  }

  const getAvailableCount = () => {
    return socialPlatforms.filter(platform => canAccess(platform)).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Share2 className="h-5 w-5 mr-2 text-primary-600" />
              Social Media Integration
            </h2>
            <p className="text-gray-600 mt-1">
              Connect your social accounts to expand your reach and automate sharing
            </p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              userTier === 'premium' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {userTier === 'premium' ? '👑 Premium' : '⭐ Standard'}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {getConnectedCount()}/{getAvailableCount()} platforms connected
            </p>
          </div>
        </div>
      </div>

      {/* Social Platform Connections */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Connections</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialPlatforms.map(platform => {
            const Icon = platform.icon
            const connected = isConnected(platform.id)
            const accessible = canAccess(platform)
            
            return (
              <div
                key={platform.id}
                className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                  connected
                    ? 'border-green-200 bg-green-50'
                    : accessible
                    ? 'border-gray-200 hover:border-primary-200 hover:bg-primary-50'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                {/* Premium Badge */}
                {platform.tier === 'premium' && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Premium
                    </div>
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-${platform.color}-100`}>
                    <Icon className={`h-6 w-6 text-${platform.color}-600`} />
                  </div>
                  
                  {accessible && (
                    <button
                      onClick={() => handleConnect(platform)}
                      disabled={loading}
                      className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                        connected
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600'
                      }`}
                    >
                      {connected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </button>
                  )}
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-1">{platform.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{platform.description}</p>
                
                <div className="space-y-1">
                  {platform.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-500">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  {connected && (
                    <span className="flex items-center text-sm text-green-600 font-medium">
                      <Check className="h-4 w-4 mr-1" />
                      Connected
                    </span>
                  )}
                  {!accessible && (
                    <span className="flex items-center text-sm text-gray-500">
                      <X className="h-4 w-4 mr-1" />
                      Premium Required
                    </span>
                  )}
                  
                  {accessible && connected && (
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Manual Social Links */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <LinkIcon className="h-5 w-5 mr-2" />
          Social Profile Links
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(socialLinks).map(([platform, url]) => (
            <div key={platform} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {platform === 'website' ? 'Personal Website' : platform}
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => handleLinkUpdate(platform, e.target.value)}
                placeholder={`https://${platform === 'website' ? 'yoursite.com' : `${platform}.com/username`}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveLinks}
            disabled={loading}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Links'}
          </button>
        </div>
      </div>

      {/* Upgrade CTA for Standard Users */}
      {userTier === 'standard' && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Unlock Premium Social Features</h3>
              <p className="text-purple-100">
                Get access to advanced social media integrations, auto-posting, and analytics
              </p>
              <div className="mt-3 flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Auto-posting
                </div>
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-1" />
                  Advanced analytics
                </div>
                <div className="flex items-center">
                  <Share2 className="h-4 w-4 mr-1" />
                  Multi-platform sync
                </div>
              </div>
            </div>
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Upgrade to Premium
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SocialMediaIntegration
