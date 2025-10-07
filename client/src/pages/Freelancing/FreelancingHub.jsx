import React, { useState, useEffect } from 'react'
import { Search, MapPin, DollarSign, Star, MessageCircle, Briefcase, Users, TrendingUp, Crown, Lock, Zap, BarChart3, Target, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { realTimeService } from '../../services/realtime'
import { socketService } from '../../services/socket'
import { subscriptionService } from '../../services/subscription'

const FreelancingHub = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('browse')
  const [jobs, setJobs] = useState([])
  const [freelancers, setFreelancers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [onlineUsers, setOnlineUsers] = useState([])
  const [userTier, setUserTier] = useState('standard')
  const [premiumFeatures, setPremiumFeatures] = useState({
    advancedSearch: false,
    directMessaging: false,
    prioritySupport: false,
    analytics: false,
    autoApply: false
  })

  useEffect(() => {
    loadUserTier()
    fetchJobs()
    fetchFreelancers()
    
    // Real-time updates
    socketService.on('job_posted', (job) => {
      setJobs(prev => [job, ...prev])
    })
    
    socketService.on('user_online', (userId) => {
      setOnlineUsers(prev => [...new Set([...prev, userId])])
    })
    
    socketService.on('user_offline', (userId) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId))
    })
    
    return () => {
      socketService.off('job_posted')
      socketService.off('user_online')
      socketService.off('user_offline')
    }
  }, [])

  const loadUserTier = async () => {
    try {
      const tier = await subscriptionService.getUserTier()
      setUserTier(tier)
      
      // Set premium features based on tier
      if (tier === 'premium') {
        setPremiumFeatures({
          advancedSearch: true,
          directMessaging: true,
          prioritySupport: true,
          analytics: true,
          autoApply: true
        })
      }
    } catch (error) {
      console.error('Error loading user tier:', error)
    }
  }

  const canAccessFeature = (feature) => {
    return premiumFeatures[feature] || userTier === 'premium'
  }

  const fetchJobs = async () => {
    try {
      const data = await realTimeService.getFreelancingJobs({ page: 1, limit: 10 })
      setJobs(data.jobs.map(job => ({
        id: job._id,
        title: job.title,
        description: job.description,
        budget: job.budgetRange || `$${job.budgetMin} - $${job.budgetMax}`,
        duration: job.duration,
        skills: job.skills,
        client: job.postedBy?.profile ? `${job.postedBy.profile.firstName} ${job.postedBy.profile.lastName}` : 'Anonymous',
        postedBy: job.postedBy?.profile ? `${job.postedBy.profile.firstName} ${job.postedBy.profile.lastName}` : 'Anonymous',
        postedAt: formatTimeAgo(job.createdAt),
        proposals: job.proposalCount || job.proposals?.length || 0
      })))
    } catch (error) {
      console.error('Error fetching jobs:', error)
      // Keep mock data as fallback
      setJobs([
        {
          id: 1,
          title: 'Full Stack Developer Needed',
          description: 'Looking for an experienced developer to build a modern web application',
          budget: '$5000 - $8000',
          duration: '2-3 months',
          skills: ['React', 'Node.js', 'MongoDB'],
          client: 'Tech Startup Inc.',
          postedBy: 'John Doe',
          postedAt: '2 hours ago',
          proposals: 12
        }
      ])
    }
  }

  const fetchFreelancers = async () => {
    try {
      const data = await realTimeService.getFreelancers({ page: 1, limit: 12 })
      setFreelancers(data.freelancers.map(freelancer => ({
        id: freelancer._id,
        name: `${freelancer.profile.firstName} ${freelancer.profile.lastName}`,
        title: freelancer.profile.title,
        rating: freelancer.profile.rating || 0,
        reviews: freelancer.profile.reviewCount || 0,
        hourlyRate: freelancer.profile.hourlyRate ? `$${freelancer.profile.hourlyRate}/hr` : 'Rate not set',
        skills: freelancer.profile.skills || [],
        avatar: freelancer.profile.avatar,
        isOnline: onlineUsers.includes(freelancer._id),
        completedJobs: freelancer.profile.completedJobs || 0
      })))
    } catch (error) {
      console.error('Error fetching freelancers:', error)
      // Keep mock data as fallback
      setFreelancers([
        {
          id: 1,
          name: 'Sarah Johnson',
          title: 'Full Stack Developer',
          rating: 4.9,
          reviews: 156,
          hourlyRate: '$85/hr',
          skills: ['React', 'Node.js', 'Python'],
          avatar: null,
          isOnline: true,
          completedJobs: 89
        }
      ])
    }
  }

  const formatTimeAgo = (date) => {
    const now = new Date()
    const past = new Date(date)
    const diffInMs = now - past
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)
    
    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  }

  const startChat = (freelancerId) => {
    navigate(`/dashboard/messages/${freelancerId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Freelancing Hub</h1>
          <p className="text-gray-600">Connect with talented professionals and find your next opportunity</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Active Jobs', value: '1,234', icon: Briefcase, color: 'blue' },
            { label: 'Freelancers', value: '5,678', icon: Users, color: 'green' },
            { label: 'Online Now', value: onlineUsers.length, icon: TrendingUp, color: 'purple' },
            { label: 'Avg. Response', value: '2 hrs', icon: MessageCircle, color: 'orange' }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, freelancers, or skills..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {['browse', 'freelancers', 'my-jobs'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>

        {/* Browse Jobs */}
        {activeTab === 'browse' && (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <p className="text-gray-600 mb-3">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/dashboard/job/${job.id}`)}
                    className="ml-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {job.budget}
                    </span>
                    <span className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {job.duration}
                    </span>
                    <span>{job.proposals} proposals</span>
                  </div>
                  <span className="text-sm text-gray-500">{job.postedAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Browse Freelancers */}
        {activeTab === 'freelancers' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.map((freelancer) => (
              <div key={freelancer.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
                        {freelancer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {freelancer.isOnline && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{freelancer.name}</h3>
                      <p className="text-sm text-gray-600">{freelancer.title}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-900">{freelancer.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">({freelancer.reviews} reviews)</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {freelancer.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">{freelancer.hourlyRate}</span>
                  <button
                    onClick={() => startChat(freelancer.id)}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Jobs */}
        {activeTab === 'my-jobs' && (
          <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Jobs</h3>
            <p className="text-gray-600 mb-6">Start applying to jobs or post your own project</p>
            <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
              Post a Job
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FreelancingHub
