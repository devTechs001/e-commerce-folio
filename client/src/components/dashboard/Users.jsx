import React, { useState, useEffect } from 'react'
import { Users as UsersIcon, Search, Filter, MoreVertical, Mail, Ban, CheckCircle, XCircle, Crown, Shield } from 'lucide-react'

const Users = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    // Mock users data - would come from API
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        subscription: 'premium',
        portfolios: 5,
        joined: '2024-01-15',
        avatar: 'JD'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        status: 'active',
        subscription: 'professional',
        portfolios: 3,
        joined: '2024-02-20',
        avatar: 'JS'
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'user',
        status: 'suspended',
        subscription: 'free',
        portfolios: 1,
        joined: '2024-03-10',
        avatar: 'BJ'
      },
      {
        id: 4,
        name: 'Alice Williams',
        email: 'alice@example.com',
        role: 'moderator',
        status: 'active',
        subscription: 'premium',
        portfolios: 8,
        joined: '2024-01-25',
        avatar: 'AW'
      },
      {
        id: 5,
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        role: 'user',
        status: 'inactive',
        subscription: 'free',
        portfolios: 2,
        joined: '2024-04-05',
        avatar: 'CB'
      }
    ]
    setUsers(mockUsers)
    setLoading(false)
  }

  const getFilteredUsers = () => {
    return users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = filterRole === 'all' || user.role === filterRole
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus
      return matchesSearch && matchesRole && matchesStatus
    })
  }

  const getRoleBadge = (role) => {
    const badges = {
      admin: { color: 'bg-red-100 text-red-700', icon: Shield },
      moderator: { color: 'bg-purple-100 text-purple-700', icon: Shield },
      user: { color: 'bg-blue-100 text-blue-700', icon: UsersIcon }
    }
    return badges[role] || badges.user
  }

  const getStatusBadge = (status) => {
    const badges = {
      active: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-700', icon: XCircle },
      suspended: { color: 'bg-red-100 text-red-700', icon: Ban }
    }
    return badges[status] || badges.inactive
  }

  const getSubscriptionBadge = (subscription) => {
    const badges = {
      premium: { color: 'bg-yellow-100 text-yellow-700', icon: Crown },
      professional: { color: 'bg-blue-100 text-blue-700', icon: Crown },
      free: { color: 'bg-gray-100 text-gray-700', icon: null }
    }
    return badges[subscription] || badges.free
  }

  const filteredUsers = getFilteredUsers()

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <UsersIcon className="h-8 w-8 mr-3 text-primary-600" />
          User Management
        </h1>
        <p className="mt-2 text-gray-600">Manage platform users and their permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Active Users</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Premium Users</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {users.filter(u => u.subscription === 'premium').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Admins</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Portfolios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleBadge = getRoleBadge(user.role)
                  const statusBadge = getStatusBadge(user.status)
                  const subscriptionBadge = getSubscriptionBadge(user.subscription)
                  const RoleIcon = roleBadge.icon
                  const StatusIcon = statusBadge.icon
                  const SubIcon = subscriptionBadge.icon

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-700">{user.avatar}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge.color}`}>
                          {RoleIcon && <RoleIcon className="h-3 w-3 mr-1" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subscriptionBadge.color}`}>
                          {SubIcon && <SubIcon className="h-3 w-3 mr-1" />}
                          {user.subscription}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.portfolios}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.joined).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-3">
                          <Mail className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Users