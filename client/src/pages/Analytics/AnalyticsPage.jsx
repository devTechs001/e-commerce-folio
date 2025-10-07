import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  Eye, 
  DollarSign, 
  ArrowUp, 
  ArrowDown,
  Calendar,
  Download,
  Filter
} from 'lucide-react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { realTimeService } from '../../services/realtime'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [stats, setStats] = useState({
    totalVisitors: 0,
    totalViews: 0,
    revenue: 0,
    conversion: 0
  })
  const [loading, setLoading] = useState(true)

  const [visitorData, setVisitorData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Visitors',
      data: [1200, 1900, 1500, 2100, 1800, 2400, 2000],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  })

  const [revenueData, setRevenueData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [4500, 5200, 4800, 6100, 5800, 8945],
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
    }]
  })

  const [trafficSources, setTrafficSources] = useState({
    labels: ['Direct', 'Social Media', 'Search', 'Referral', 'Email'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ]
    }]
  })
  const [recentVisitors, setRecentVisitors] = useState([])

  // Fetch real-time data
  useEffect(() => {
    fetchAnalyticsData()
    
    // Subscribe to real-time updates
    realTimeService.subscribe('analytics', handleAnalyticsUpdate)
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalyticsData, 30000)
    
    return () => {
      clearInterval(interval)
      realTimeService.unsubscribe('analytics', handleAnalyticsUpdate)
    }
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      const data = await realTimeService.getAnalytics(timeRange)
      
      setStats({
        totalVisitors: data.visitors?.total || 0,
        totalViews: data.views?.total || 0,
        revenue: data.revenue?.total || 0,
        conversion: data.conversion?.rate || 0
      })

      if (data.visitors?.data) {
        setVisitorData(prev => ({
          ...prev,
          datasets: [{
            ...prev.datasets[0],
            data: data.visitors.data
          }]
        }))
      }

      if (data.revenue?.monthly) {
        setRevenueData(prev => ({
          ...prev,
          datasets: [{
            ...prev.datasets[0],
            data: data.revenue.monthly
          }]
        }))
      }

      if (data.trafficSources) {
        setTrafficSources(prev => ({
          ...prev,
          datasets: [{
            ...prev.datasets[0],
            data: data.trafficSources.data
          }]
        }))
      }

      const visitors = await realTimeService.getRecentVisitors()
      setRecentVisitors(visitors)
      
      setLoading(false)
    } catch (error) {
      console.error('Analytics fetch error:', error)
      setLoading(false)
    }
  }

  const handleAnalyticsUpdate = (data) => {
    // Handle real-time updates
    if (data.type === 'visitor') {
      setStats(prev => ({
        ...prev,
        totalVisitors: prev.totalVisitors + 1
      }))
    }
  }

  const statCards = [
    {
      title: 'Total Visitors',
      value: stats.totalVisitors.toLocaleString(),
      change: '+12.5%',
      isPositive: true,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Page Views',
      value: stats.totalViews.toLocaleString(),
      change: '+8.2%',
      isPositive: true,
      icon: Eye,
      color: 'purple'
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      change: '+23.1%',
      isPositive: true,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversion}%`,
      change: '-0.3%',
      isPositive: false,
      icon: TrendingUp,
      color: 'orange'
    }
  ]

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your portfolio performance and insights</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    stat.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            )
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visitor Trend */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitor Trend</h3>
            <div className="h-80">
              <Line data={visitorData} options={chartOptions} />
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
            <div className="h-80">
              <Bar data={revenueData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Traffic Sources */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
            <div className="h-64">
              <Doughnut data={trafficSources} options={{ ...chartOptions, scales: undefined }} />
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Pages</h3>
            <div className="space-y-3">
              {[
                { page: '/portfolio/projects', views: 5432, percentage: 85 },
                { page: '/portfolio/about', views: 3210, percentage: 65 },
                { page: '/portfolio/contact', views: 2145, percentage: 45 },
                { page: '/portfolio/skills', views: 1876, percentage: 35 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.page}</p>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-4 text-sm font-semibold text-gray-900">{item.views.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Visitor Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Visitor</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Page</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Duration</th>
                </tr>
              </thead>
              <tbody>
                {recentVisitors.length > 0 ? (
                  recentVisitors.map((activity, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{activity.visitor}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{activity.location}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{activity.page}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{activity.time}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{activity.duration}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      {loading ? 'Loading...' : 'No recent visitors'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
