import React, { useState } from 'react'
import { 
  User, Mail, MapPin, Briefcase, Calendar, Star, Award, 
  TrendingUp, DollarSign, Clock, Edit, Camera, Link as LinkIcon,
  Github, Linkedin, Twitter, Globe
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Line } from 'react-chartjs-2'

const ComprehensiveProfile = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { label: 'Total Earnings', value: '$12,450', icon: DollarSign, change: '+23%', color: 'green' },
    { label: 'Projects Completed', value: '47', icon: Briefcase, change: '+12%', color: 'blue' },
    { label: 'Client Rating', value: '4.9', icon: Star, change: '+0.2', color: 'yellow' },
    { label: 'Response Time', value: '2 hrs', icon: Clock, change: '-15%', color: 'purple' }
  ]

  const earningsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Earnings',
      data: [1200, 1900, 1500, 2100, 1800, 2400],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  }

  const skills = [
    { name: 'React', level: 95, category: 'Frontend' },
    { name: 'Node.js', level: 90, category: 'Backend' },
    { name: 'TypeScript', level: 85, category: 'Language' },
    { name: 'MongoDB', level: 80, category: 'Database' },
    { name: 'AWS', level: 75, category: 'Cloud' }
  ]

  const portfolio = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with React and Node.js',
      image: null,
      technologies: ['React', 'Node.js', 'MongoDB'],
      link: '#'
    },
    {
      title: 'Social Media Dashboard',
      description: 'Analytics dashboard for social media management',
      image: null,
      technologies: ['React', 'Chart.js', 'Firebase'],
      link: '#'
    }
  ]

  const reviews = [
    {
      client: 'John Doe',
      rating: 5,
      comment: 'Excellent work! Very professional and delivered on time.',
      project: 'Website Redesign',
      date: '2 weeks ago'
    },
    {
      client: 'Jane Smith',
      rating: 5,
      comment: 'Great communication and quality work. Highly recommended!',
      project: 'Mobile App Development',
      date: '1 month ago'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-8 mb-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                  {user?.profile?.firstName?.[0]}{user?.profile?.lastName?.[0]}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-white text-primary-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {user?.profile?.firstName} {user?.profile?.lastName}
                </h1>
                <p className="text-xl text-white/90 mb-3">{user?.profile?.title || 'Professional'}</p>
                <div className="flex items-center space-x-4 text-white/80">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    New York, USA
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined Jan 2024
                  </span>
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>
            <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2">
              <Edit className="w-5 h-5" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Social Links */}
          <div className="mt-6 flex items-center space-x-4">
            <a href="#" className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
              <Globe className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {['overview', 'skills', 'portfolio', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* About */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {user?.profile?.bio || 'Passionate developer with expertise in modern web technologies. I love creating beautiful and functional applications that solve real-world problems.'}
                  </p>
                </div>

                {/* Earnings Chart */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Overview</h3>
                  <div className="h-64">
                    <Line data={earningsData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Skills & Expertise</h3>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-gray-900">{skill.name}</span>
                          <span className="ml-2 text-sm text-gray-500">({skill.category})</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                {portfolio.map((project, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a href={project.link} className="text-primary-600 hover:text-primary-700 flex items-center space-x-2">
                      <LinkIcon className="w-4 h-4" />
                      <span>View Project</span>
                    </a>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.client}</h4>
                        <p className="text-sm text-gray-600">{review.project}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
              <div className="space-y-3">
                {[
                  { title: 'Top Rated', icon: Award, color: 'yellow' },
                  { title: 'Fast Responder', icon: Clock, color: 'blue' },
                  { title: 'Rising Talent', icon: TrendingUp, color: 'green' }
                ].map((achievement, index) => {
                  const Icon = achievement.icon
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-10 h-10 rounded-lg bg-${achievement.color}-100 flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${achievement.color}-600`} />
                      </div>
                      <span className="font-medium text-gray-900">{achievement.title}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Subscription */}
            <div className="bg-gradient-to-br from-primary-600 to-blue-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
              <p className="text-3xl font-bold mb-4 capitalize">{user?.subscription?.plan || 'Free'}</p>
              <button className="w-full bg-white text-primary-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComprehensiveProfile
