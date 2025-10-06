import React, { useState, useEffect } from 'react'
import { TrendingUp, Calendar, Eye, Clock, Users } from 'lucide-react'
import Button from '../../common/Button/Button'
import { analyticsService } from '../../../services/analytics'

const PerformanceChart = () => {
  const [performanceData, setPerformanceData] = useState(null)
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPerformanceData()
  }, [timeRange])

  const loadPerformanceData = async () => {
    try {
      setLoading(true)
      const response = await analyticsService.getPerformanceMetrics(timeRange)
      if (response.success) {
        setPerformanceData(response.data)
      }
    } catch (error) {
      console.error('Error loading performance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, label, value, change, color = 'blue' }) => (
    <div className={`bg-${color}-50 rounded-lg p-4`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% from last period
            </p>
          )}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
          <p className="text-sm text-gray-500">Track your portfolio performance metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          {['7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Eye}
          label="Page Views"
          value={performanceData?.pageViews?.toLocaleString() || 0}
          change={performanceData?.pageViewsGrowth}
          color="blue"
        />
        <StatCard
          icon={Users}
          label="Unique Visitors"
          value={performanceData?.uniqueVisitors?.toLocaleString() || 0}
          change={performanceData?.uniqueVisitorsGrowth}
          color="green"
        />
        <StatCard
          icon={Clock}
          label="Avg. Time"
          value={`${performanceData?.avgTimeOnPage || 0}m`}
          change={performanceData?.avgTimeGrowth}
          color="purple"
        />
        <StatCard
          icon={TrendingUp}
          label="Bounce Rate"
          value={`${performanceData?.bounceRate || 0}%`}
          change={-performanceData?.bounceRateGrowth}
          color="orange"
        />
      </div>

      {/* Chart Area */}
      <div className="space-y-6">
        {/* Page Views Chart */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Page Views Over Time</h4>
            <span className="text-sm text-gray-500">
              Max: {Math.max(...(performanceData?.viewsOverTime?.map(d => d.views) || [0]))}
            </span>
          </div>
          <div className="flex items-end justify-between h-32 bg-gray-50 rounded-lg p-4">
            {performanceData?.viewsOverTime?.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-8 bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600 cursor-pointer"
                  style={{ 
                    height: `${(data.views / Math.max(...performanceData.viewsOverTime.map(d => d.views))) * 80}%` 
                  }}
                  title={`${data.views} views on ${data.date}`}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{data.label}</span>
                <span className="text-xs font-medium text-gray-900 mt-1">{data.views}</span>
              </div>
            )) || (
              <div className="w-full text-center text-gray-500">
                No data available for the selected period
              </div>
            )}
          </div>
        </div>

        {/* Engagement Chart */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Engagement Metrics</h4>
            <span className="text-sm text-gray-500">
              Max: {Math.max(...(performanceData?.engagementOverTime?.map(d => d.engagement) || [0]))}m
            </span>
          </div>
          <div className="flex items-end justify-between h-32 bg-gray-50 rounded-lg p-4">
            {performanceData?.engagementOverTime?.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-8 bg-green-500 rounded-t-lg transition-all duration-300 hover:bg-green-600 cursor-pointer"
                  style={{ 
                    height: `${(data.engagement / Math.max(...performanceData.engagementOverTime.map(d => d.engagement))) * 80}%` 
                  }}
                  title={`${data.engagement}m engagement on ${data.date}`}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{data.label}</span>
                <span className="text-xs font-medium text-gray-900 mt-1">{data.engagement}m</span>
              </div>
            )) || (
              <div className="w-full text-center text-gray-500">
                No engagement data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      {performanceData?.insights && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Performance Insights</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            {performanceData.insights.map((insight, index) => (
              <li key={index}>• {insight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default PerformanceChart