import React, { useState, useEffect } from 'react'
import { Globe2, Users, Eye, MapPin, TrendingUp } from 'lucide-react'
import { analyticsService } from '../../../services/analytics'

const VisitorMap = () => {
  const [visitorData, setVisitorData] = useState(null)
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVisitorData()
  }, [timeRange])

  const loadVisitorData = async () => {
    try {
      setLoading(true)
      const response = await analyticsService.getVisitorGeography(timeRange)
      if (response.success) {
        setVisitorData(response.data)
      }
    } catch (error) {
      console.error('Error loading visitor data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
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
          <h3 className="text-lg font-semibold text-gray-900">Visitor Geography</h3>
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
          <Globe2 className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Visitor Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Visitors</p>
              <p className="text-2xl font-bold text-blue-900">
                {visitorData?.totalVisitors?.toLocaleString() || 0}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
          <div className="flex items-center text-blue-600 text-sm mt-2">
            <TrendingUp className="h-4 w-4 mr-1" />
            +{visitorData?.visitorGrowth || 0}% from previous period
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Unique Visitors</p>
              <p className="text-2xl font-bold text-green-900">
                {visitorData?.uniqueVisitors?.toLocaleString() || 0}
              </p>
            </div>
            <Eye className="h-8 w-8 text-green-400" />
          </div>
          <div className="flex items-center text-green-600 text-sm mt-2">
            <TrendingUp className="h-4 w-4 mr-1" />
            +{visitorData?.uniqueGrowth || 0}% from previous period
          </div>
        </div>
      </div>

      {/* Top Countries */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Top Countries</h4>
        <div className="space-y-3">
          {visitorData?.countries?.map((country, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">{country.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${country.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {country.visitors}
                </span>
              </div>
            </div>
          )) || (
            <div className="text-center py-4 text-gray-500">
              No country data available
            </div>
          )}
        </div>
      </div>

      {/* Top Cities */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Top Cities</h4>
        <div className="grid grid-cols-2 gap-3">
          {visitorData?.cities?.map((city, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">{city.name}</span>
              <span className="text-sm font-medium text-gray-900">{city.visitors}</span>
            </div>
          )) || (
            <div className="col-span-2 text-center py-4 text-gray-500">
              No city data available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VisitorMap