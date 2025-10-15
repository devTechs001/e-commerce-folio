import React, { useState, useEffect } from 'react'
import { TrendingUp, Calendar, Eye, Clock, Users, Activity, RefreshCw } from 'lucide-react'
import { Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import Button from '../../common/Button/Button'
import { analyticsService } from '../../../services/analytics'
import { socketService } from '../../../services/socket'
import { usePortfolio } from '../../../context/PortfolioContext'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const PerformanceChart = () => {
  const { portfolios } = usePortfolio()
  const [performanceData, setPerformanceData] = useState(null)
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)
  const [realTimeViews, setRealTimeViews] = useState(0)
  const [chartData, setChartData] = useState(null)
  const [deviceData, setDeviceData] = useState(null)

  useEffect(() => {
    loadPerformanceData()
    setupRealTimeUpdates()
    
    return () => {
      if (socketService.socket) {
        socketService.socket.off('analytics:update')
        socketService.socket.off('view:new')
      }
    }
  }, [timeRange, portfolios])

  const setupRealTimeUpdates = () => {
    if (socketService.socket) {
      socketService.socket.on('analytics:update', (data) => {
        console.log('📊 Analytics update:', data)
        setPerformanceData(prev => ({ ...prev, ...data }))
      })

      socketService.socket.on('view:new', () => {
        setRealTimeViews(prev => prev + 1)
      })
    }
  }

  const loadPerformanceData = async () => {
    try {
      setLoading(true)
      const totalViews = portfolios.reduce((sum, p) => sum + (p.analytics?.views || 0), 0)
      
      // Generate performance data
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
      const labels = []
      const viewsData = []
      const visitorsData = []
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.setDate() - i)
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
        viewsData.push(Math.floor(100 + Math.random() * 200 + (days - i) * 5))
        visitorsData.push(Math.floor(70 + Math.random() * 140 + (days - i) * 3))
      }
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Page Views',
            data: viewsData,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Unique Visitors',
            data: visitorsData,
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      })
      
      // Device breakdown
      setDeviceData({
        labels: ['Mobile', 'Desktop', 'Tablet'],
        datasets: [{
          data: [65, 28, 7],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)'
          ],
          borderWidth: 0
        }]
      })
      
      setPerformanceData({
        pageViews: totalViews || viewsData.reduce((a, b) => a + b, 0),
        pageViewsGrowth: 12.5,
        uniqueVisitors: Math.floor(viewsData.reduce((a, b) => a + b, 0) * 0.7),
        uniqueVisitorsGrowth: 8.3,
        avgTimeOnPage: 3.2,
        avgTimeGrowth: 15.7,
        bounceRate: 42,
        bounceRateGrowth: -5.2,
        viewsOverTime: labels.map((label, i) => ({
          label,
          views: viewsData[i],
          date: label
        })),
        engagementOverTime: labels.map((label, i) => ({
          label,
          engagement: Math.floor(2 + Math.random() * 3),
          date: label
        })),
        insights: [
          'Page views increased by 12.5% compared to last period',
          'Average engagement time is above industry average',
          'Bounce rate improved by 5.2%'
        ]
      })
      
      setRealTimeViews(Math.floor(Math.random() * 20) + 10)
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

      {/* Real-time Indicator */}
      <div className="mb-6 flex items-center justify-between bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Activity className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">Real-Time Analytics</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-green-700">{realTimeViews} active viewers</span>
        </div>
      </div>

      {/* Chart.js Graphs */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Traffic Trend Analysis</h4>
          <div className="h-64">
            {chartData && (
              <Line 
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => value.toLocaleString()
                      }
                    }
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Device Breakdown</h4>
          <div className="h-64 flex items-center justify-center">
            {deviceData && (
              <Doughnut 
                data={deviceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
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