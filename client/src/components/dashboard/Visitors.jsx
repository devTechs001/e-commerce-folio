import React, { useState, useEffect } from 'react'
import { Users, Globe, MapPin, Monitor, Smartphone, Tablet, TrendingUp, Clock } from 'lucide-react'
import { Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const Visitors = () => {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [visitorStats, setVisitorStats] = useState(null)

  useEffect(() => {
    loadVisitorData()
  }, [timeRange])

  const loadVisitorData = () => {
    setLoading(true)
    
    // Mock visitor data
    const mockData = {
      totalVisitors: 1234,
      uniqueVisitors: 856,
      pageViews: 3421,
      avgDuration: '3m 45s',
      bounceRate: 42,
      devices: {
        mobile: 65,
        desktop: 28,
        tablet: 7
      },
      topCountries: [
        { name: 'United States', visitors: 456, flag: '🇺🇸' },
        { name: 'United Kingdom', visitors: 234, flag: '🇬🇧' },
        { name: 'Canada', visitors: 178, flag: '🇨🇦' },
        { name: 'Germany', visitors: 134, flag: '🇩🇪' },
        { name: 'France', visitors: 98, flag: '🇫🇷' }
      ],
      topPages: [
        { url: '/portfolio/creative-showcase', views: 456 },
        { url: '/portfolio/developer-portfolio', views: 389 },
        { url: '/projects', views: 312 },
        { url: '/about', views: 234 },
        { url: '/contact', views: 189 }
      ],
      hourlyTraffic: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        visitors: Math.floor(Math.random() * 100) + 20
      }))
    }

    setVisitorStats(mockData)
    setTimeout(() => setLoading(false), 500)
  }

  const deviceChartData = visitorStats ? {
    labels: ['Mobile', 'Desktop', 'Tablet'],
    datasets: [{
      data: [visitorStats.devices.mobile, visitorStats.devices.desktop, visitorStats.devices.tablet],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)'
      ],
      borderWidth: 0
    }]
  } : null

  const hourlyChartData = visitorStats ? {
    labels: visitorStats.hourlyTraffic.map(h => `${h.hour}:00`),
    datasets: [{
      label: 'Visitors',
      data: visitorStats.hourlyTraffic.map(h => h.visitors),
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 2
    }]
  } : null

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 mr-3 text-primary-600" />
            Visitor Analytics
          </h1>
          <p className="mt-2 text-gray-600">Track and analyze your portfolio visitors</p>
        </div>
        <div className="flex space-x-2">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Visitors</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{visitorStats.totalVisitors.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{visitorStats.uniqueVisitors.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Globe className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Duration</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{visitorStats.avgDuration}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{visitorStats.bounceRate}%</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Monitor className="h-5 w-5 mr-2 text-primary-600" />
            Device Breakdown
          </h3>
          <div className="h-64 flex items-center justify-center">
            {deviceChartData && (
              <Doughnut 
                data={deviceChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            )}
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <Smartphone className="h-4 w-4 mr-2 text-blue-600" />
                Mobile
              </span>
              <span className="font-medium">{visitorStats.devices.mobile}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <Monitor className="h-4 w-4 mr-2 text-green-600" />
                Desktop
              </span>
              <span className="font-medium">{visitorStats.devices.desktop}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <Tablet className="h-4 w-4 mr-2 text-orange-600" />
                Tablet
              </span>
              <span className="font-medium">{visitorStats.devices.tablet}%</span>
            </div>
          </div>
        </div>

        {/* Top Countries */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary-600" />
            Top Countries
          </h3>
          <div className="space-y-3">
            {visitorStats.topCountries.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <span className="text-2xl mr-3">{country.flag}</span>
                  <span className="text-sm font-medium text-gray-900">{country.name}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(country.visitors / visitorStats.topCountries[0].visitors) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    {country.visitors}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Traffic */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary-600" />
          Hourly Traffic (Last 24 Hours)
        </h3>
        <div className="h-64">
          {hourlyChartData && (
            <Bar 
              data={hourlyChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Pages</h3>
          <p className="text-sm text-gray-500 mt-1">Most visited pages on your portfolio</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visitorStats.topPages.map((page, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {page.url}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {page.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${(page.views / visitorStats.pageViews) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {((page.views / visitorStats.pageViews) * 100).toFixed(1)}%
                      </span>
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
}

export default Visitors