import React, { useState } from 'react'
import { Folder, FileText, Plus, MoreVertical, Edit2, Trash2, Download, Share2 } from 'lucide-react'
import Button from '../../common/Button/Button'

const ProjectManager = () => {
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Manager</h3>
          <p className="text-sm text-gray-500">Manage your portfolios and projects</p>
        </div>
        <Button variant="primary" icon={Plus}>
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const TypeIcon = projectTypes[project.type].icon
          return (
            <div
              key={project.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors group"
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
        })}

        {/* Add New Project Card */}
        <button className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors group">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-200">
            <Plus className="h-6 w-6 text-gray-400" />
          </div>
          <h4 className="font-medium text-gray-900 mb-1">New Project</h4>
          <p className="text-sm text-gray-500">Create a new portfolio or project</p>
        </button>
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
  )
}

export default ProjectManager