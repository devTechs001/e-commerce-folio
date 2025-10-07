import React, { useState, useEffect } from 'react'
import { 
  Mail, 
  Users, 
  Send, 
  Eye, 
  BarChart3, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  Target,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react'
import { subscriptionService } from '../../../services/subscription'

const EmailMarketing = () => {
  const [userTier, setUserTier] = useState('standard')
  const [activeTab, setActiveTab] = useState('campaigns')
  const [campaigns, setCampaigns] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEmailMarketingData()
  }, [])

  const loadEmailMarketingData = async () => {
    try {
      const tier = await subscriptionService.getUserTier()
      setUserTier(tier)
      
      // Mock data - would come from email marketing service
      setCampaigns([
        {
          id: 1,
          name: 'Portfolio Launch Announcement',
          subject: 'Check out my new portfolio!',
          status: 'sent',
          sentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          recipients: 150,
          openRate: 24.5,
          clickRate: 8.2,
          type: 'announcement'
        },
        {
          id: 2,
          name: 'Monthly Newsletter',
          subject: 'Latest projects and updates',
          status: 'draft',
          sentDate: null,
          recipients: 0,
          openRate: 0,
          clickRate: 0,
          type: 'newsletter'
        },
        {
          id: 3,
          name: 'Client Testimonial Showcase',
          subject: 'What clients are saying...',
          status: 'scheduled',
          sentDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          recipients: 200,
          openRate: 0,
          clickRate: 0,
          type: 'testimonial'
        }
      ])
      
      setSubscribers([
        { id: 1, email: 'client1@example.com', name: 'John Doe', subscribed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), status: 'active' },
        { id: 2, email: 'client2@example.com', name: 'Jane Smith', subscribed: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), status: 'active' },
        { id: 3, email: 'client3@example.com', name: 'Mike Johnson', subscribed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), status: 'active' }
      ])
      
      setTemplates([
        { id: 1, name: 'Portfolio Showcase', type: 'portfolio', tier: 'standard' },
        { id: 2, name: 'Project Update', type: 'update', tier: 'standard' },
        { id: 3, name: 'Client Newsletter', type: 'newsletter', tier: 'premium' },
        { id: 4, name: 'Service Promotion', type: 'promotion', tier: 'premium' }
      ])
      
      setLoading(false)
    } catch (error) {
      console.error('Error loading email marketing data:', error)
      setLoading(false)
    }
  }

  const canAccessFeature = (feature) => {
    const premiumFeatures = ['advanced_templates', 'automation', 'analytics', 'segmentation']
    if (premiumFeatures.includes(feature)) {
      return userTier === 'premium'
    }
    return true
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date) => {
    if (!date) return 'Not scheduled'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const CampaignsTab = () => (
    <div className="space-y-6">
      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
            </div>
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Open Rate</p>
              <p className="text-2xl font-bold text-gray-900">24.5%</p>
            </div>
            <Eye className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Click Rate</p>
              <p className="text-2xl font-bold text-gray-900">8.2%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Campaign Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Email Campaigns</h3>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </button>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Campaign</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Recipients</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Open Rate</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Click Rate</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(campaign => (
                <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{campaign.name}</p>
                      <p className="text-sm text-gray-600">{campaign.subject}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status === 'sent' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {campaign.status === 'scheduled' && <Clock className="h-3 w-3 mr-1" />}
                      {campaign.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{campaign.recipients}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{campaign.openRate}%</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{campaign.clickRate}%</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{formatDate(campaign.sentDate)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-primary-600 hover:text-primary-700">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-700">
                        <BarChart3 className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const SubscribersTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Subscribers</h3>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscribers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Subscriber
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subscriber</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subscribed</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map(subscriber => (
                <tr key={subscriber.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{subscriber.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{subscriber.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{formatDate(subscriber.subscribed)}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {subscriber.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-primary-600 hover:text-primary-700">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const TemplatesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Email Templates</h3>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(template => {
          const accessible = template.tier === 'standard' || userTier === 'premium'
          
          return (
            <div
              key={template.id}
              className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                accessible
                  ? 'border-gray-200 hover:border-primary-200 hover:bg-primary-50'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              {template.tier === 'premium' && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Premium
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-3">
                <Mail className="h-8 w-8 text-primary-600" />
                {accessible && (
                  <button className="text-primary-600 hover:text-primary-700">
                    <Edit className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
              <p className="text-sm text-gray-600 mb-4 capitalize">{template.type} template</p>
              
              {accessible ? (
                <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  Use Template
                </button>
              ) : (
                <button className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg cursor-not-allowed">
                  Premium Required
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

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
                <Mail className="h-8 w-8 mr-3 text-primary-600" />
                Email Marketing
              </h1>
              <p className="text-gray-600 mt-2">
                Build and manage your email campaigns to engage with your audience
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
                {subscribers.length} total subscribers
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'campaigns', name: 'Campaigns', icon: Send },
                { id: 'subscribers', name: 'Subscribers', icon: Users },
                { id: 'templates', name: 'Templates', icon: Mail }
              ].map(tab => {
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
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'campaigns' && <CampaignsTab />}
            {activeTab === 'subscribers' && <SubscribersTab />}
            {activeTab === 'templates' && <TemplatesTab />}
          </div>
        </div>

        {/* Upgrade CTA for Standard Users */}
        {userTier === 'standard' && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Unlock Premium Email Marketing</h3>
                <p className="text-purple-100 mb-3">
                  Get access to advanced templates, automation, and detailed analytics
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    Advanced segmentation
                  </div>
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Detailed analytics
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Email automation
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
    </div>
  )
}

export default EmailMarketing
