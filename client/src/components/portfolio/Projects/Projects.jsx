import React from 'state'
import { ExternalLink, Github, Edit2, Trash2, Plus, Calendar } from 'lucide-react'
import Button from '../../common/Button/Button'

const Projects = ({ data = [], editable = false, onAdd, onEdit, onDelete }) => {
  const defaultProjects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution built with React, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'JWT'],
      image: '/api/placeholder/400/200',
      demoUrl: 'https://demo.example.com',
      githubUrl: 'https://github.com/username/project',
      startDate: '2023-01',
      endDate: '2023-06',
      featured: true
    }
  ]

  const projects = data.length > 0 ? data : defaultProjects

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        {editable && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onAdd}
          >
            Add Project
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div key={project.id || index} className="group relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Project Image */}
            <div className="h-40 bg-gradient-to-br from-primary-100 to-blue-100 relative">
              {project.featured && (
                <div className="absolute top-3 left-3 bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
                  Featured
                </div>
              )}
              
              {editable && (
                <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit2}
                    onClick={() => onEdit?.(project)}
                    className="!p-1 bg-white/90 hover:bg-white"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => onDelete?.(project.id)}
                    className="!p-1 bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                  />
                </div>
              )}
            </div>

            {/* Project Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                {project.title}
              </h3>
              
              {project.startDate && (
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(project.startDate).getFullYear()}
                  {project.endDate && ` - ${new Date(project.endDate).getFullYear()}`}
                </div>
              )}

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {project.description}
              </p>

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 3).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Links */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-gray-600 hover:text-gray-700"
                    >
                      <Github className="h-4 w-4 mr-1" />
                      Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">No projects added yet</p>
          {editable && (
            <Button
              variant="outline"
              icon={Plus}
              onClick={onAdd}
            >
              Add Your First Project
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default Projects