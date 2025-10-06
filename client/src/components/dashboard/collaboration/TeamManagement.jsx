import React, { useState } from 'react'
import { Users, UserPlus, Mail, MoreVertical, Edit2, Trash2, Shield, Crown } from 'lucide-react'
import Button from '../../common/Button/Button'
import Modal from '../../common/Modal/Modal'

const TeamManagement = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('editor')

  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'owner',
      avatar: '/api/placeholder/40/40',
      joined: '2024-01-15',
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'editor',
      avatar: '/api/placeholder/40/40',
      joined: '2024-02-01',
      lastActive: '1 day ago'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily@example.com',
      role: 'viewer',
      avatar: '/api/placeholder/40/40',
      joined: '2024-02-10',
      lastActive: '3 days ago'
    }
  ]

  const roles = [
    { value: 'owner', label: 'Owner', description: 'Full access to all features and settings' },
    { value: 'editor', label: 'Editor', description: 'Can edit content but cannot manage team or billing' },
    { value: 'viewer', label: 'Viewer', description: 'Can view but cannot make changes' }
  ]

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-500" />
      case 'editor': return <Edit2 className="h-4 w-4 text-blue-500" />
      case 'viewer': return <Shield className="h-4 w-4 text-gray-500" />
      default: return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800'
      case 'editor': return 'bg-blue-100 text-blue-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleInvite = (e) => {
    e.preventDefault()
    // Handle invite logic
    console.log('Inviting:', inviteEmail, 'as', inviteRole)
    setIsInviteModalOpen(false)
    setInviteEmail('')
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Team Management</h3>
          <p className="text-sm text-gray-500">Manage team members and permissions</p>
        </div>
        <Button
          variant="primary"
          icon={UserPlus}
          onClick={() => setIsInviteModalOpen(true)}
        >
          Invite Member
        </Button>
      </div>

      {/* Team Members List */}
      <div className="space-y-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-600" />
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">{member.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)} flex items-center space-x-1`}>
                    {getRoleIcon(member.role)}
                    <span>{roles.find(r => r.value === member.role)?.label}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-500">{member.email}</p>
                <p className="text-xs text-gray-400">Last active: {member.lastActive}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {member.role !== 'owner' && (
                <>
                  <Button variant="ghost" size="sm" icon={Edit2}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" icon={Trash2} className="text-red-600 hover:text-red-700">
                    Remove
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Member"
        size="md"
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              {roles.filter(role => role.value !== 'owner').map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              {roles.find(r => r.value === inviteRole)?.description}
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsInviteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              icon={Mail}
            >
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default TeamManagement