import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  Link as LinkIcon, 
  Check, 
  X, 
  Plus, 
  ExternalLink,
  Zap,
  Mail,
  MessageSquare,
  BarChart3,
  Camera,
  Code,
  Palette,
  Globe,
  Shield,
  Smartphone
} from 'lucide-react'
import { subscriptionService } from '../../services/subscription'

const IntegrationsPage = () => {
  const [userTier, setUserTier] = useState('standard')
  const [connectedIntegrations, setConnectedIntegrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadIntegrationsData()
  }, [])

  const loadIntegrationsData = async () => {
    try {
      const tier = await subscriptionService.getUserTier()
      setUserTier(tier)
      
      // Mock connected integrations
      setConnectedIntegrations([
        'google_analytics',
        'mailchimp'
      ])
      
      setLoading(false)
    } catch (error) {
      console.error('Error loading integrations:', error)
      setLoading(false)
    }
  }

  const integrations = [
    {
      id: 'google_analytics',
      name: 'Google Analytics',
      description: 'Track your portfolio visitors and performance',
      icon: BarChart3,
      category: 'Analytics',
      tier: 'standard',
      color: 'blue'
    },
    {
      id: 'google_tag_manager',
      name: 'Google Tag Manager',
      description: 'Manage tracking codes and marketing tags',
      icon: Code,
      category: 'Analytics',
      tier: 'premium',
      color: 'purple'
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Build and manage your email marketing campaigns',
      icon: Mail,
      category: 'Marketing',
      tier: 'standard',
      color: 'yellow'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'CRM and marketing automation platform',
      icon: Zap,
      category: 'Marketing',
      tier: 'premium',
      color: 'orange'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notifications about portfolio activity',
      icon: MessageSquare,
      category: 'Communication',
      tier: 'premium',
      color: 'green'
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Share portfolio updates with your community',
      icon: MessageSquare,
      category: 'Communication',
      tier: 'premium',
      color: 'indigo'
    },
    {
      id: 'unsplash',
      name: 'Unsplash',
      description: 'Access millions of high-quality stock photos',
      icon: Camera,
      category: 'Content',
      tier: 'standard',
      color: 'gray'
    },
    {
      id: 'pexels',
      name: 'Pexels',
      description: 'Free stock photos and videos for your portfolio',
      icon: Camera,
      category: 'Content',
      tier: 'standard',
      color: 'teal'
    },
    {
      id: 'figma',
      name: 'Figma',
      description: 'Import designs directly from Figma',
      icon: Palette,
      category: 'Design',
      tier: 'premium',
      color: 'pink'
    },
    {
      id: 'adobe_creative',
      name: 'Adobe Creative Cloud',
      description: 'Sync assets from Adobe Creative Suite',
      icon: Palette,
      category: 'Design',
      tier: 'premium',
      color: 'red'
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Showcase your code repositories',
      icon: Code,
      category: 'Development',
      tier: 'standard',
      color: 'gray'
    },
    {
      id: 'gitlab',
      name: 'GitLab',
      description: 'Display your GitLab projects and contributions',
      icon: Code,
      category: 'Development',
      tier: 'premium',
      color: 'orange'
    },
    {
      id: 'custom_domain',
      name: 'Custom Domain',
      description: 'Connect your own domain name',
      icon: Globe,
      category: 'Domain',
      tier: 'premium',
      color: 'blue'
    },
    {
      id: 'ssl_certificate',
      name: 'SSL Certificate',
      description: 'Secure your portfolio with HTTPS',
      icon: Shield,
      category: 'Security',
      tier: 'premium',
      color: 'green'
    },
    {
      id: 'mobile_app',
      name: 'Mobile App',
      description: 'Manage your portfolio on the go',
      icon: Smartphone,
      category: 'Mobile',
      tier: 'premium',
      color: 'purple'
    }
  ]

  const categories = [...new Set(integrations.map(int => int.category))]

  const isConnected = (integrationId) => {
    return connectedIntegrations.includes(integrationId)
  }

  const canAccess = (integration) => {
    if (integration.tier === 'standard') return true
    return userTier === 'premium'
  }

  const handleConnect = async (integration) => {
    if (!canAccess(integration)) {
      alert('This integration requires a Premium subscription. Please upgrade your plan.')
      return
    }

    if (isConnected(integration.id)) {
      // Disconnect
      setConnectedIntegrations(prev => prev.filter(id => id !== integration.id))
    } else {
      // Connect
      setConnectedIntegrations(prev => [...prev, integration.id])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Settings className="h-8 w-8 mr-3 text-primary-600" />
                Integrations
              </h1>
              <p className="text-gray-600 mt-2">
                Connect your favorite tools and services to enhance your portfolio
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
                {connectedIntegrations.length} integrations connected
              </p>
            </div>
          </div>
        </div>

        {/* Categories */}
        {categories.map(category => {
          const categoryIntegrations = integrations.filter(int => int.category === category)
          
          return (
            <div key={category} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{category}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryIntegrations.map(integration => {
                  const Icon = integration.icon
                  const connected = isConnected(integration.id)
                  const accessible = canAccess(integration)
                  
                  return (
                    <div
                      key={integration.id}
                      className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                        connected
                          ? 'border-green-200 bg-green-50'
                          : accessible
                          ? 'border-gray-200 hover:border-primary-200 hover:bg-primary-50'
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      {/* Premium Badge */}
                      {integration.tier === 'premium' && (
                        <div className="absolute -top-2 -right-2">
                          <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Premium
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg bg-${integration.color}-100`}>
                          <Icon className={`h-6 w-6 text-${integration.color}-600`} />
                        </div>
                        
                        {accessible && (
                          <button
                            onClick={() => handleConnect(integration)}
                            className={`p-2 rounded-lg transition-colors ${
                              connected
                                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600'
                            }`}
                          >
                            {connected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          </button>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-1">{integration.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
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
                        </div>
                        
                        {accessible && (
                          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                            Configure
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Upgrade CTA for Standard Users */}
        {userTier === 'standard' && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Unlock Premium Integrations</h3>
                <p className="text-purple-100">
                  Get access to advanced integrations like HubSpot, Figma, Custom Domains, and more
                </p>
              </div>
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Upgrade to Premium
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default IntegrationsPage
