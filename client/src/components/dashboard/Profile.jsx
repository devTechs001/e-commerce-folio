import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Globe, Save, Upload, Linkedin, Github, Twitter, Award, Briefcase, Star, Link2 } from 'lucide-react'
import Button from '../common/Button/Button'
import Input from '../common/Form/Input'
import { authService } from '../../services/auth'

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    bio: '',
    avatar: '',
    title: '',
    company: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: ''
    },
    skills: [],
    achievements: []
  })
  const [activeTab, setActiveTab] = useState('personal')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await authService.getCurrentUser()
      if (response.success) {
        setProfile(response.data.profile || {})
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const response = await authService.updateProfile(profile)
      if (response.success) {
        setMessage('Profile updated successfully!')
      }
    } catch (error) {
      setMessage('Error updating profile: ' + (error.response?.data?.message || error.message))
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setMessage('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setMessage('Image size must be less than 5MB')
      return
    }

    try {
      // In a real app, you would upload to your server
      // For now, we'll create a local URL
      const imageUrl = URL.createObjectURL(file)
      setProfile(prev => ({ ...prev, avatar: imageUrl }))
      
      // Here you would typically upload to your server
      // const formData = new FormData()
      // formData.append('avatar', file)
      // await authService.uploadAvatar(formData)
    } catch (error) {
      setMessage('Error uploading avatar')
    }
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'social', label: 'Social Links', icon: Link2 },
    { id: 'portfolio', label: 'Portfolio', icon: Star }
  ]

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="bg-gray-200 h-12 rounded"></div>
            <div className="bg-gray-200 h-12 rounded"></div>
            <div className="bg-gray-200 h-12 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-2 text-gray-600">Manage your personal and professional information</p>
      </div>

      {/* Profile Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-primary-600" />
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-white text-primary-600 p-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-blue-100 mt-1">{profile.title || 'No title set'}</p>
            <p className="text-blue-100 text-sm">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('Error') 
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                icon={User}
                value={profile.firstName}
                onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />

              <Input
                label="Last Name"
                value={profile.lastName}
                onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              value={profile.email}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              icon={Phone}
              value={profile.phone}
              onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
            />

            <Input
              label="Location"
              icon={MapPin}
              value={profile.location}
              onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
            />

            <Input
              label="Website"
              type="url"
              icon={Globe}
              value={profile.website}
              onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://example.com"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                icon={Save}
                loading={saving}
              >
                Save Changes
              </Button>
            </div>
          </form>
        )}

        {/* Professional Tab */}
        {activeTab === 'professional' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Professional Title"
                icon={Briefcase}
                value={profile.title}
                onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Full Stack Developer"
              />
              <Input
                label="Company"
                value={profile.company}
                onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                placeholder="e.g., Google Inc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {['React', 'Node.js', 'TypeScript', 'Python', 'UI/UX Design'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                + Add Skill
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
              <div className="space-y-3">
                {[
                  { title: 'Top Developer 2024', description: 'Ranked in top 10% of developers' },
                  { title: 'Project Completion', description: 'Successfully delivered 50+ projects' }
                ].map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Award className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{achievement.title}</p>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium">
                + Add Achievement
              </button>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button variant="primary" icon={Save}>
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {/* Social Links Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <Input
                label="LinkedIn"
                icon={Linkedin}
                value={profile.socialLinks.linkedin}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                }))}
                placeholder="https://linkedin.com/in/username"
              />
              <Input
                label="GitHub"
                icon={Github}
                value={profile.socialLinks.github}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, github: e.target.value }
                }))}
                placeholder="https://github.com/username"
              />
              <Input
                label="Twitter"
                icon={Twitter}
                value={profile.socialLinks.twitter}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                }))}
                placeholder="https://twitter.com/username"
              />
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button variant="primary" icon={Save}>
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Portfolios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Creative Showcase', views: 1234, status: 'published' },
                  { name: 'Developer Portfolio', views: 856, status: 'draft' }
                ].map((portfolio, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{portfolio.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        portfolio.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {portfolio.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{portfolio.views} views</p>
                    <div className="mt-3 flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile