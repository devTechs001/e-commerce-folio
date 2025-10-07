import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  Star, 
  Shield, 
  Zap, 
  Users, 
  Palette,
  Code,
  Globe,
  CheckCircle,
  TrendingUp,
  Activity,
  Eye,
  Download
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSocket } from '../../hooks/useSocket.js'
import { motion } from 'framer-motion'

const Home = () => {
  const { user } = useAuth()
  const [realTimeStats, setRealTimeStats] = useState({
    portfoliosCreated: 10000,
    templatesAvailable: 50,
    activeUsers: 2543,
    satisfaction: 98
  })
  const [recentActivity, setRecentActivity] = useState([])
  const socket = useSocket(['analytics_updated', 'user_online', 'user_offline', 'portfolio_created'])

  useEffect(() => {
    // Simulate some initial activity only once
    const activities = [
      { type: 'template', message: 'Creative Portfolio template downloaded', time: new Date(Date.now() - 120000) },
      { type: 'user', message: 'New user joined from San Francisco', time: new Date(Date.now() - 300000) },
      { type: 'portfolio', message: 'Portfolio "Design Showcase" went live', time: new Date(Date.now() - 480000) }
    ]
    setRecentActivity(activities)
  }, [])

  useEffect(() => {
    if (!socket) return

    // Listen for real-time updates
    const handleAnalyticsUpdate = (data) => {
      setRealTimeStats(prev => ({ ...prev, ...data }))
    }

    const handlePortfolioCreated = (data) => {
      setRecentActivity(prev => [
        { type: 'portfolio', message: `New portfolio created: ${data.title}`, time: new Date() },
        ...prev.slice(0, 4)
      ])
      setRealTimeStats(prev => ({ 
        ...prev, 
        portfoliosCreated: prev.portfoliosCreated + 1 
      }))
    }

    const handleUserOnline = () => {
      setRealTimeStats(prev => ({ 
        ...prev, 
        activeUsers: prev.activeUsers + 1 
      }))
    }

    const handleUserOffline = () => {
      setRealTimeStats(prev => ({ 
        ...prev, 
        activeUsers: Math.max(0, prev.activeUsers - 1) 
      }))
    }

    socket.on('analytics_updated', handleAnalyticsUpdate)
    socket.on('portfolio_created', handlePortfolioCreated)
    socket.on('user_online', handleUserOnline)
    socket.on('user_offline', handleUserOffline)

    return () => {
      socket.off('analytics_updated', handleAnalyticsUpdate)
      socket.off('portfolio_created', handlePortfolioCreated)
      socket.off('user_online', handleUserOnline)
      socket.off('user_offline', handleUserOffline)
    }
  }, [socket.isConnected])

  const features = [
    {
      icon: <Palette className="h-8 w-8" />,
      title: 'Beautiful Templates',
      description: 'Choose from dozens of professionally designed templates that showcase your work in the best light.'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'AI-Powered Content',
      description: 'Let our AI help you write compelling content and optimize your portfolio for maximum impact.'
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: 'No Coding Required',
      description: 'Drag and drop interface makes it easy to create stunning portfolios without any technical skills.'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Custom Domain',
      description: 'Use your own domain name and customize every aspect of your portfolio to match your brand.'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Built-in Analytics',
      description: 'Track your portfolio performance with detailed analytics and visitor insights.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Team Collaboration',
      description: 'Invite team members to collaborate on your portfolio and get feedback in real-time.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Designer',
      content: 'E-Folio helped me land my dream job at Google. The templates are stunning and the AI content suggestions were incredibly helpful.',
      avatar: '/images/avatars/sarah.jpg'
    },
    {
      name: 'Marcus Johnson',
      role: 'Full-Stack Developer',
      content: 'As a developer, I appreciate the clean code and fast loading times. My portfolio loads in under 2 seconds!',
      avatar: '/images/avatars/marcus.jpg'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Marketing Manager',
      content: 'The analytics helped me understand what projects resonated most with clients. My conversion rate increased by 40%.',
      avatar: '/images/avatars/elena.jpg'
    }
  ]

  const stats = [
    { 
      number: `${realTimeStats.portfoliosCreated.toLocaleString()}+`, 
      label: 'Portfolios Created',
      icon: <Globe className="h-5 w-5" />,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      number: `${realTimeStats.templatesAvailable}+`, 
      label: 'Professional Templates',
      icon: <Palette className="h-5 w-5" />,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      number: `${realTimeStats.satisfaction}%`, 
      label: 'Customer Satisfaction',
      icon: <Star className="h-5 w-5" />,
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      number: realTimeStats.activeUsers.toLocaleString(), 
      label: 'Active Users',
      icon: <Activity className="h-5 w-5" />,
      color: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-primary-900 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Create Your Professional
              <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent"> Portfolio</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Build a stunning portfolio website that showcases your work and skills. 
              No coding required. Choose from beautiful templates and customize everything.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="group bg-white text-gray-900 px-8 py-4 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group bg-gradient-to-r from-primary-500 to-blue-500 text-white px-8 py-4 text-lg font-semibold rounded-xl hover:from-primary-600 hover:to-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/templates"
                    className="group border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    View Templates
                  </Link>
                </>
              )}
            </div>
            <p className="mt-4 text-gray-300 text-sm">
              No credit card required • Free forever plan
            </p>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-gray-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Real-time Platform Statistics
            </h2>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live data • Updated in real-time</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 font-mono">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Real-time Activity Feed */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary-600" />
                Live Activity
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            </div>
            <div className="space-y-3 max-h-32 overflow-y-auto">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'portfolio' ? 'bg-blue-500' :
                        activity.type === 'template' ? 'bg-purple-500' : 'bg-green-500'
                      }`}></div>
                      <span className="text-sm text-gray-700">{activity.message}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.floor((Date.now() - activity.time) / 60000)}m ago
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Shine
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features to create a portfolio that stands out and gets you noticed by employers and clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary-200 transition-all duration-300 group"
              >
                <div className="text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their careers with E-Folio.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Build Your Portfolio?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust E-Folio to showcase their work and advance their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user && (
              <Link
                to="/register"
                className="bg-white text-primary-600 px-8 py-4 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center"
              >
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            )}
            <Link
              to="/templates"
              className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-xl hover:bg-white hover:text-primary-600 transition-all duration-300"
            >
              Browse Templates
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-primary-100 text-sm">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Free forever plan
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Setup in 5 minutes
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home