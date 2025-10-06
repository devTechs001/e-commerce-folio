import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'

const Settings = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    email: user?.email || ''
  })

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">First name</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={profile.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Last name</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={profile.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2"
            value={profile.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
        <div>
          <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-lg">
            Save changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default Settings


