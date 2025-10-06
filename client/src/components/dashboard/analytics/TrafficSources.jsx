import React, { useState, useEffect } from 'react'
import { Share2, Facebook, Twitter, Linkedin, Link, Search, Mail, ExternalLink } from 'lucide-react'
import Button from '../../common/Button/Button'
import { analyticsService } from '../../../services/analytics'

const TrafficSources = () => {
  const [trafficData, setTrafficData] = useState(null)
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTrafficData()
  }, [timeRange])

  const loadTrafficData = async () => {
    try {
      setLoading(true)
      const response = await analyticsService.getTrafficSources(timeRange)
      if (response.success) {
        setTrafficData(response.data)
      }
    } catch (error) {
      console.error('Error loading traffic data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'LinkedIn': return <Linkedin className="h-4 w-4" />
      case 'Twitter': return <Twitter className="h-4 w-4" />
      case 'Facebook': return <Facebook className="h-4 w-4" />
      case 'Instagram': return <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
      default: return <Share2 className="h-4 w-4" />
    }
  }

  const getSourceColor = (source) => {
    switch (source) {
      case 'Direct': return 'bg-blue-500'
      case 'Social Media': return 'bg-green-500'
      case 'Search Engines': return 'bg-purple-500'
      case 'Referrals': return 'bg-orange-500'
      case 'Email': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="flex justify-center mb-6">
            <div className="w-40 h-40 bg-gray-200 rounded-full"></div>
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
          <p className="text-sm text-gray-500">Where your visitors are coming from</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Share2 className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Traffic Distribution */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Traffic Distribution</h4>
        
        {/* Pie Chart Visualization */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-40 h-40">
            {/* This is a simplified pie chart representation */}
            {trafficData?.sources?.map((source, index, array) => {
              const previousPercentages = array.slice(0, index).reduce((sum, s) => sum + s.percentage, 0)
              const rotation = (previousPercentages / 100) * 360
              
              return (
                <div
                  key={source.name}
                  className="absolute inset-0 rounded-full border-8 border-transparent"
                  style={{
                    borderTopColor: getSourceColor(source.name).replace('bg-', ''),
                    borderRightColor: getSourceColor(source.name).replace('bg-', ''),
                    transform: `rotate(${rotation}deg)`,
                    clipPath: `inset(0 0 0 50%)`
                  }}
                />
              )
            })}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">100%</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {trafficData?.sources?.map((source) => (
            <div key={source.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getSourceColor(source.name)}`}></div>
                {source.name === 'Direct' && <Link className="h-4 w-4 text-gray-400" />}
                {source.name === 'Social Media' && <Share2 className="h-4 w-4 text-gray-400" />}
                {source.name === 'Search Engines' && <Search className="h-4 w-4 text-gray-400" />}
                {source.name === 'Email' && <Mail className="h-4 w-4 text-gray-400" />}
                <span className="text-sm text-gray-600">{source.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">{source.visits} visits</span>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {source.percentage}%
                </span>
              </div>
            </div>
          )) || (
            <div className="text-center py-4 text-gray-500">
              No traffic source data available
            </div>
          )}
        </div>
      </div>

      {/* Social Media Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Social Media Traffic</h4>
        <div className="space-y-3">
          {trafficData?.socialBreakdown?.map((social, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getSocialIcon(social.platform)}
                <span className="text-sm font-medium text-gray-900">{social.platform}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{social.visits} visits</span>
                <span className={`text-sm font-medium ${
                  social.growth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {social.growth >= 0 ? '+' : ''}{social.growth}%
                </span>
              </div>
            </div>
          )) || (
            <div className="text-center py-2 text-gray-500">
              No social media data available
            </div>
          )}
        </div>
      </div>

      {/* Top Referrers */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Top Referrers</h4>
        <div className="space-y-2">
          {trafficData?.referrers?.map((referrer, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <span className="text-sm text-gray-600 truncate">{referrer.domain}</span>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">{referrer.visits} visits</span>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ExternalLink}
                  onClick={() => window.open(`https://${referrer.domain}`, '_blank')}
                >
                  Visit
                </Button>
              </div>
            </div>
          )) || (
            <div className="text-center py-2 text-gray-500">
              No referrer data available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrafficSources