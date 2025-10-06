import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Globe, Save, Upload } from 'lucide-react'
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
    avatar: ''
  })
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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        <User className="h-6 w-6 text-primary-600" />
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.includes('Error') 
            ? 'bg-red-50 border border-red-200 text-red-700'
            : 'bg-green-50 border border-green-200 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-blue-100 rounded-full flex items-center justify-center">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-primary-600" />
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-primary-600 text-white p-1 rounded-full cursor-pointer hover:bg-primary-700 transition-colors"
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
            <h3 className="text-lg font-semibold text-gray-900">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>

        {/* Personal Information */}
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
    </div>
  )
}

export default Profile