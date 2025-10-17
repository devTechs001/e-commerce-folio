import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Eye, 
  TrendingUp, 
  Users, 
  FileText, 
  Calendar,
  ArrowUp,
  ArrowDown,
  Activity,
  Brain,
  Zap,
  Star,
  Rocket,
  Target,
  Award,
  BarChart2,
  Globe,
  Heart,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layout,
  Palette
} from 'lucide-react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import { analyticsService } from '../../services/analytics'
import { aiService } from '../../services/aiService'
import { socketService } from '../../services/socket'
import Button from '../common/Button/Button'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Dashboard = () => {
  const { user } = useAuth()
  const { portfolios, loading } = usePortfolio()
  const [stats, setStats] = useState({
    totalViews: 0,
    portfolioCount: 0,
    publishedCount: 0,
    growthRate: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [chartData, setChartData] = useState({ labels: [], datasets: [] })
  const [aiInsights, setAIInsights] = useState([])
  const [realTimeViews, setRealTimeViews] = useState(0)
  const [quickStats, setQuickStats] = useState({
    todayViews: 0,
    avgEngagement: '0:00',
    topPerformer: null,
    completionRate: 0
  })
  const [achievements, setAchievements] = useState([])
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    loadDashboardData()
    setupRealTimeUpdates()
    
    return () => {
      // Cleanup socket listeners
      if (socketService.socket) {
        socketService.socket.off('analytics:update')
        socketService.socket.off('view:new')
      }
    }
  }, [portfolios])

  const loadDashboardData = async () => {
    try {
      // Calculate basic stats
      const publishedCount = portfolios.filter(p => p.settings?.isPublished).length
      const totalViews = portfolios.reduce((sum, portfolio) => 
        sum + (portfolio.analytics?.views || 0), 0
      )

      // Get recent activity from analytics
      const activityResponse = await analyticsService.getRecentActivity()
      
      setStats({
        totalViews,
        portfolioCount: portfolios.length,
        publishedCount,
        growthRate: 12.5
      })
      
      setRecentActivity(activityResponse.activity || [])
      
      // Generate chart data for last 7 days
      const labels = []
      const viewsData = []
      const visitorsData = []
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
        viewsData.push(Math.floor(150 + Math.random() * 100 + (6 - i) * 10))
        visitorsData.push(Math.floor(100 + Math.random() * 70 + (6 - i) * 8))
      }
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Views',
            data: viewsData,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Visitors',
            data: visitorsData,
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      })
      
      // Generate AI insights
      const analyticsData = {
        avgEngagementTime: 185,
        trafficSources: {
          mobile: Math.floor(totalViews * 0.78),
          desktop: Math.floor(totalViews * 0.22),
          social: Math.floor(totalViews * 0.22)
        },
        bounceRate: 45,
        conversionRate: 3.2,
        viewsTrend: viewsData,
        seoScore: 72
      }
      
      const insights = await aiService.generateInsights(analyticsData)
      setAIInsights(insights.slice(0, 3)) // Show top 3 insights
      
      setRealTimeViews(Math.floor(Math.random() * 15) + 5)
      
      // Load quick stats
      setQuickStats({
        todayViews: Math.floor(Math.random() * 50) + 20,
        avgEngagement: '3:45',
        topPerformer: portfolios.length > 0 ? portfolios[0].title : 'No portfolios yet',
        completionRate: Math.floor(Math.random() * 30) + 70
      })
      
      // Load achievements
      const userAchievements = [
        { id: 1, title: 'First Portfolio', icon: '🎯', unlocked: portfolios.length > 0, description: 'Created your first portfolio' },
        { id: 2, title: 'Getting Popular', icon: '🌟', unlocked: totalViews > 100, description: 'Reached 100+ total views' },
        { id: 3, title: 'Published Pro', icon: '🚀', unlocked: publishedCount >= 3, description: 'Published 3+ portfolios' },
        { id: 4, title: 'Engagement Master', icon: '💬', unlocked: totalViews > 500, description: 'Achieved 500+ views' },
        { id: 5, title: 'Rising Star', icon: '⭐', unlocked: totalViews > 1000, description: 'Hit 1000+ views milestone' }
      ]
      setAchievements(userAchievements)
      
      // Generate recommendations
      const tips = [
        { id: 1, title: 'Add More Projects', description: 'Showcase at least 5 projects to increase engagement', icon: Target, priority: 'high' },
        { id: 2, title: 'Optimize SEO', description: 'Add meta descriptions to boost search visibility', icon: TrendingUp, priority: 'medium' },
        { id: 3, title: 'Enable Analytics', description: 'Turn on advanced tracking for better insights', icon: BarChart2, priority: 'low' }
      ]
      setRecommendations(tips.slice(0, 2))
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const setupRealTimeUpdates = () => {
    // Listen for real-time analytics updates
    if (socketService.socket) {
      socketService.socket.on('analytics:update', (data) => {
        console.log('📊 Real-time analytics update:', data)
        setStats(prev => ({ ...prev, ...data }))
      })

      socketService.socket.on('view:new', () => {
        console.log('👁️ New view detected')
        setRealTimeViews(prev => prev + 1)
        setStats(prev => ({ ...prev, totalViews: prev.totalViews + 1 }))
      })
    }
  }

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue', index = 0 }) => (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <motion.div 
              className={`flex items-center mt-3 text-sm font-medium ${
                change > 0 ? 'text-green-600' : 'text-red-600'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              {change > 0 ? <ArrowUp className="h-4 w-4 mr-1 animate-bounce" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              {Math.abs(change)}% from last week
            </motion.div>
          )}
        </div>
        <motion.div 
          className={`p-4 rounded-xl bg-gradient-to-br ${getColorGradient(color)} group-hover:scale-110 transition-transform`}
          whileHover={{ rotate: 5 }}
        >
          <Icon className="h-7 w-7 text-white" />
        </motion.div>
      </div>
    </motion.div>
  )
  
  const getColorGradient = (color) => {
    const gradients = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-emerald-600',
      purple: 'from-purple-500 to-violet-600',
      orange: 'from-orange-500 to-amber-600',
      red: 'from-red-500 to-rose-600',
      pink: 'from-pink-500 to-rose-600'
    }
    return gradients[color] || gradients.blue
  }

  const PortfolioCard = ({ portfolio }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <FileText className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {portfolio.title}
            </h3>
            <p className="text-sm text-gray-500">Last edited {formatDate(portfolio.updatedAt)}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          portfolio.settings?.isPublished 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {portfolio.settings?.isPublished ? 'Published' : 'Draft'}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{portfolio.analytics?.views || 0} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{portfolio.analytics?.uniqueVisitors || 0} visitors</span>
          </div>
        </div>
        <Link
          to={`/dashboard/builder/${portfolio._id}`}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          Edit →
        </Link>
      </div>
    </div>
  )

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  if (loading && portfolios.length === 0) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.profile?.firstName}! 👋
            </h1>
            <p className="text-primary-100 text-lg">
              Ready to create something amazing today?
            </p>
          </div>
          <Link
            to="/dashboard/portfolio-editor"
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform"
          >
            <Plus className="h-5 w-5 inline mr-2" />
            New Portfolio
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          change={12.5}
          icon={Eye}
          color="blue"
          index={0}
        />
        <StatCard
          title="Portfolios"
          value={stats.portfolioCount}
          change={8.2}
          icon={FileText}
          color="green"
          index={1}
        />
        <StatCard
          title="Published"
          value={stats.publishedCount}
          change={15.3}
          icon={TrendingUp}
          color="purple"
          index={2}
        />
        <StatCard
          title="Visitors"
          value="1.2K"
          change={-2.1}
          icon={Users}
          color="orange"
          index={3}
        />
      </div>
      
      {/* Quick Insights Row */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">Today</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{quickStats.todayViews}</p>
          <p className="text-sm text-blue-700">Views today</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-green-600" />
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">Avg</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{quickStats.avgEngagement}</p>
          <p className="text-sm text-green-700">Engagement time</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <Star className="h-5 w-5 text-purple-600" />
            <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded-full">Top</span>
          </div>
          <p className="text-sm font-bold text-purple-900 truncate">{quickStats.topPerformer}</p>
          <p className="text-xs text-purple-700">Best performer</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-orange-600" />
            <span className="text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded-full">Rate</span>
          </div>
          <p className="text-2xl font-bold text-orange-900">{quickStats.completionRate}%</p>
          <p className="text-sm text-orange-700">Profile completion</p>
        </div>
      </motion.div>
      
      {/* Achievements & Recommendations */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <motion.div 
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-bold text-gray-900">Achievements</h3>
            </div>
            <Link to="/dashboard/achievements" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                className={`relative group cursor-pointer ${achievement.unlocked ? '' : 'opacity-40'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`text-4xl text-center p-3 rounded-xl ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200' 
                    : 'bg-gray-50 border-2 border-gray-200'
                }`}>
                  {achievement.icon}
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                    <p className="font-semibold">{achievement.title}</p>
                    <p className="text-gray-300">{achievement.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
            </span>
            <div className="flex items-center gap-1">
              {achievements.map((a, i) => (
                <div 
                  key={i}
                  className={`h-1.5 w-8 rounded-full ${a.unlocked ? 'bg-yellow-400' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Recommendations */}
        <motion.div 
          className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm border border-indigo-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900">Smart Recommendations</h3>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec) => {
              const Icon = rec.icon
              return (
                <motion.div 
                  key={rec.id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-indigo-100 hover:shadow-md transition-all cursor-pointer group"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      rec.priority === 'high' ? 'bg-red-50' :
                      rec.priority === 'medium' ? 'bg-yellow-50' :
                      'bg-green-50'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        rec.priority === 'high' ? 'text-red-600' :
                        rec.priority === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{rec.title}</h4>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {rec.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{rec.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
          <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm">
            Get More Tips
          </button>
        </motion.div>
      </div>

      {/* Analytics Quick Access */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Analytics & Insights</h2>
            <p className="text-gray-600">Track your portfolio performance and revenue</p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/dashboard/analytics-full"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Full Analytics</span>
            </Link>
            <Link
              to="/dashboard/revenue"
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Revenue Dashboard</span>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Page Views</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Revenue</p>
                <p className="text-2xl font-bold text-green-900">$2,450</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Visitors</p>
                <p className="text-2xl font-bold text-purple-900">1,234</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Analytics Graph & AI Insights */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Analytics Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Real-Time Analytics
              </h2>
              <p className="text-gray-600 text-sm">Last 7 days performance</p>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">{realTimeViews} viewing now</span>
            </div>
          </div>
          <div className="h-64">
            {chartData.labels.length > 0 && (
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
                        callback: function(value) {
                          return value.toLocaleString()
                        }
                      }
                    }
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 shadow-sm border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-600" />
              AI Insights
            </h2>
            <Zap className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600 mb-4">Powered by intelligent analysis</p>
          
          <div className="space-y-3">
            {aiInsights.map((insight, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">{insight.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                    insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {insight.impact.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                <div className="bg-blue-50 border-l-2 border-blue-400 p-2 rounded">
                  <p className="text-xs text-blue-900">
                    <span className="font-medium">AI Tip:</span> {insight.recommendation}
                  </p>
                </div>
              </div>
            ))}
            
            {aiInsights.length === 0 && (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-purple-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Analyzing your data...</p>
              </div>
            )}
          </div>
          
          <Link
            to="/dashboard/ai"
            className="mt-4 block text-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            View All Insights →
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Portfolios */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Portfolios</h2>
            <p className="text-gray-600 mt-1">Your recently edited portfolio projects</p>
          </div>
          <div className="p-6 space-y-4">
            {portfolios.slice(0, 4).map((portfolio) => (
              <PortfolioCard key={portfolio._id} portfolio={portfolio} />
            ))}
            {portfolios.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No portfolios yet</p>
                <Link
                  to="/dashboard/builder"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Create Your First Portfolio
                </Link>
              </div>
            )}
          </div>
          {portfolios.length > 4 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <Link
                to="/dashboard/builder"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                View all portfolios →
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-gray-600 mt-1">Latest updates and interactions</p>
          </div>
          <div className="p-6">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg mt-1">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/dashboard/portfolio-editor"
            className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 text-center group"
          >
            <Plus className="h-8 w-8 text-gray-400 group-hover:text-primary-600 mx-auto mb-2" />
            <p className="font-medium text-gray-700 group-hover:text-primary-600">New Portfolio</p>
          </Link>
          <Link
            to="/dashboard/templates"
            className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 text-center group"
          >
            <FileText className="h-8 w-8 text-gray-400 group-hover:text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-gray-700 group-hover:text-purple-600">Browse Templates</p>
          </Link>
          <Link
            to="/dashboard/analytics"
            className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-300 text-center group"
          >
            <TrendingUp className="h-8 w-8 text-gray-400 group-hover:text-green-600 mx-auto mb-2" />
            <p className="font-medium text-gray-700 group-hover:text-green-600">View Analytics</p>
          </Link>
          <Link
            to="/dashboard/settings"
            className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 text-center group"
          >
            <Users className="h-8 w-8 text-gray-400 group-hover:text-orange-600 mx-auto mb-2" />
            <p className="font-medium text-gray-700 group-hover:text-orange-600">Account Settings</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard