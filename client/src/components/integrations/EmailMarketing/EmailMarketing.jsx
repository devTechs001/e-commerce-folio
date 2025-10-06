import React, { useState, useEffect } from 'react'
import { Mail, Users, Send, BarChart3, List, Plus, Calendar } from 'lucide-react'
import Button from '../../common/Button/Button'
import { integrationService } from '../../../services/integration'

const EmailMarketing = () => {
  const [integrations, setIntegrations] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [analytics, setAnalytics] = useState({})
  const [loading, setLoading] = useState(true)

  const emailPlatforms = [
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      icon: '📧',
      connected: false,
      subscribers: 0,
      description: 'All-in-one marketing platform'
    },
    {
      id: 'convertkit',
      name: 'ConvertKit',
      icon: '🦊',
      connected: false,
      subscribers: 0,
      description: 'Email marketing for creators'
    },
    {
      id: 'sendgrid',
      name: 'SendGrid',
      icon: '📨',
      connected: false,
      subscribers: 0,
      description: 'Transaction and marketing emails'
    },
    {
      id: 'brevo',
      name: 'Brevo',
      icon: '🔵',
      connected: false,
      subscribers: 0,
      description: 'Complete marketing suite'
    }
  ]

  useEffect(() => {
    loadEmailData()
  }, [])

  const loadEmailData = async () => {
    try {
      setLoading(true)
      const [integrationsResponse, campaignsResponse, analyticsResponse] = await Promise.all([
        integrationService.getEmailIntegrations(),
        integrationService.getEmailCampaigns(),
        integrationService.getEmailAnalytics()
      ])

      if (integrationsResponse.success) {
        setIntegrations(integrationsResponse.data)
      }

      if (campaignsResponse.success) {
        setCampaigns(campaignsResponse.data.campaigns || [])
        setSubscribers(campaignsResponse.data.subscribers || [])
      }

      if (analyticsResponse.success) {
        setAnalytics(analyticsResponse.data)
      }
    } catch (error) {
      console.error('Error loading email data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectEmail = async (platformId) => {
    try {
      const response = await integrationService.connectEmail(platformId)
      if (response.success) {
        // Update local state
        setIntegrations(prev => prev.map(platform =>
          platform.id === platformId ? { ...platform, connected: true } : platform
        ))
      }
    } catch (error) {
      console.error('Error connecting email platform:', error)
    }
  }

  const handleCreateCampaign = async () => {
    try {
      const response = await integrationService.createEmailCampaign({
        name: 'New Campaign',
        subject: 'Welcome to My Portfolio',
        content: 'Thank you for subscribing to my updates!',
        audience: 'all'
      })

      if (response.success) {
        setCampaigns(prev => [response.data, ...prev])
      }
    } catch (error) {
      console.error('Error creating campaign:', error)
    }
  }

  const CampaignCard = ({ campaign }) => (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
          campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
          campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {campaign.status}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3">{campaign.subject}</p>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          {campaign.recipients} recipients
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString() : 'Not sent'}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-4 text-xs">
          <div>
            <span className="font-medium">{campaign.openRate}%</span>
            <div className="text-gray-500">Open Rate</div>
          </div>
          <div>
            <span className="font-medium">{campaign.clickRate}%</span>
            <div className="text-gray-500">Click Rate</div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            View
          </Button>
          {campaign.status === 'draft' && (
            <Button variant="primary" size="sm">
              Send
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  const SubscriberCard = ({ subscriber }) => (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
          <Users className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{subscriber.email}</h4>
          <p className="text-sm text-gray-600">
            Joined {new Date(subscriber.subscribedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        subscriber.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {subscriber.status}
      </span>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Email Platform Integrations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Email Marketing</h3>
            <p className="text-gray-600">Connect email platforms to grow your audience</p>
          </div>
          <Mail className="h-6 w-6 text-primary-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emailPlatforms.map((platform) => (
            <div
              key={platform.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{platform.name}</h4>
                    <p className="text-sm text-gray-600">{platform.description}</p>
                  </div>
                </div>
                
                {platform.connected && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Connected
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {platform.subscribers} subscribers
                </span>
                
                <Button
                  variant={platform.connected ? "outline" : "primary"}
                  size="sm"
                  onClick={() => handleConnectEmail(platform.id)}
                >
                  {platform.connected ? 'Manage' : 'Connect'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Email Analytics</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Subscribers</span>
              <span className="font-semibold text-gray-900">{analytics.totalSubscribers || 0}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Avg. Open Rate</span>
              <span className="font-semibold text-green-600">{analytics.avgOpenRate || '0%'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Avg. Click Rate</span>
              <span className="font-semibold text-blue-600">{analytics.avgClickRate || '0%'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Campaigns Sent</span>
              <span className="font-semibold text-gray-900">{analytics.campaignsSent || 0}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button variant="primary" icon={Plus} className="w-full" onClick={handleCreateCampaign}>
              Create Campaign
            </Button>
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-semibold text-gray-900">Recent Campaigns</h4>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.slice(0, 4).map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}

            {campaigns.length === 0 && (
              <div className="col-span-full text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No campaigns yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Create your first email campaign to engage with your audience
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subscribers List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Subscribers</h3>
            <p className="text-gray-600">Manage your email list and audience</p>
          </div>
          <List className="h-6 w-6 text-primary-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscribers.slice(0, 6).map((subscriber) => (
            <SubscriberCard key={subscriber.id} subscriber={subscriber} />
          ))}

          {subscribers.length === 0 && (
            <div className="col-span-full text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No subscribers yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Add email signup forms to your portfolio to grow your audience
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailMarketing