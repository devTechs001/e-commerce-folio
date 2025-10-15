import React, { useState } from 'react'
import { Folder, FileText, Plus, MoreVertical, Edit2, Trash2, Download, Share2, Search, Filter, Grid, List, Clock, Eye, Star, TrendingUp } from 'lucide-react'
import Button from '../../common/Button/Button'

const ProjectManager = () => {
  const [viewMode, setViewMode] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Personal Portfolio',
      type: 'portfolio',
      lastModified: '2024-03-15T14:30:00Z',
      size: '2.4 MB',
      status: 'published',
      items: 12
    },
    {
      id: 2,
      name: 'Client Project - E-commerce',
      type: 'project',
      lastModified: '2024-03-12T09:15:00Z',
      size: '5.7 MB',
      status: 'draft',
      items: 8
    },
    {
      id: 3,
      name: 'Marketing Campaign',
      type: 'campaign',
      lastModified: '2024-03-10T16:20:00Z',
      size: '3.1 MB',
      status: 'archived',
      items: 15
    },
    {
      id: 4,
      name: 'Mobile App Design',
      type: 'design',
      lastModified: '2024-03-08T11:45:00Z',
      size: '8.2 MB',
      status: 'published',
      items: 23
    }
  ])

  const projectTypes = {
    portfolio: { color: 'bg-blue-100 text-blue-800', icon: FileText },
    project: { color: 'bg-green-100 text-green-800', icon: Folder },
    campaign: { color: 'bg-purple-100 text-purple-800', icon: FileText },
    design: { color: 'bg-orange-100 text-orange-800', icon: Folder }
  }

  const statusColors = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800'
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleDelete = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId))
  }

  const handleDuplicate = (project) => {
    const newProject = {
      ...project,
      id: Math.max(...projects.map(p => p.id)) + 1,
      name: `${project.name} (Copy)`,
      status: 'draft'
    }
    setProjects([...projects, newProject])
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus
    const matchesType = filterType === 'all' || project.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Workspace</h1>
        <p className="mt-2 text-gray-600">Manage your portfolios and projects</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{projects.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Folder className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {projects.filter(p => p.status === 'published').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">15.2K</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">19.5 MB</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Folder className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex items-center space-x-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value="portfolio">Portfolio</option>
              <option value="project">Project</option>
              <option value="campaign">Campaign</option>
              <option value="design">Design</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Toggle */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-600'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-600'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            <Button variant="primary" icon={Plus}>
              New Project
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        {/* Projects Display */}
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const TypeIcon = projectTypes[project.type].icon
              return (
                <div
                  key={project.id}
                  className={`border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors group ${
                    viewMode === 'list' ? 'flex items-center justify-between' : ''
                  }`}
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${projectTypes[project.type].color}`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                          {project.status}
                        </span>
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" icon={MoreVertical} />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Items</span>
                      <span className="font-medium">{project.items}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size</span>
                      <span className="font-medium">{project.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Modified</span>
                      <span className="font-medium">{formatDate(project.lastModified)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Edit2}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Share2}
                      className="flex-1"
                    >
                      Share
                    </Button>
                  </div>
                </div>
              )
            })
          )}

          {viewMode === 'grid' && (
            <button className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors group">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-50">
                <Plus className="h-6 w-6 text-gray-400 group-hover:text-primary-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">New Project</h4>
              <p className="text-sm text-gray-500">Create a new portfolio or project</p>
            </button>
          )}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary-600" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { action: 'Published', project: 'Personal Portfolio', time: '2 hours ago' },
              { action: 'Updated', project: 'Client Project', time: '5 hours ago' },
              { action: 'Created', project: 'Marketing Campaign', time: '1 day ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.action}</span> {activity.project}
                  </p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <button className="p-3 text-center hover:bg-gray-50 rounded-lg transition-colors">
            <Folder className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">All Projects</span>
          </button>
          <button className="p-3 text-center hover:bg-gray-50 rounded-lg transition-colors">
            <FileText className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Portfolios</span>
          </button>
          <button className="p-3 text-center hover:bg-gray-50 rounded-lg transition-colors">
            <Download className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Exports</span>
          </button>
          <button className="p-3 text-center hover:bg-gray-50 rounded-lg transition-colors">
            <Share2 className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Shared</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectManager