import React from 'react'
import { Calendar, MapPin, Building, Edit2, Trash2, Plus } from 'lucide-react'
import Button from '../../common/Button/Button'

const Experience = ({ data = [], editable = false, onAdd, onEdit, onDelete }) => {
  const defaultExperience = [
    {
      id: 1,
      position: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      location: 'San Francisco, CA',
      startDate: '2020-06',
      endDate: '2023-12',
      current: false,
      description: 'Led development of cloud-native applications using React, Node.js, and AWS. Managed team of 5 developers and improved system performance by 40%.'
    }
  ]

  const experienceItems = data.length > 0 ? data : defaultExperience

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const getDuration = (startDate, endDate, current) => {
    const start = new Date(startDate)
    const end = current ? new Date() : new Date(endDate)
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    
    if (years === 0) return `${remainingMonths} mos`
    if (remainingMonths === 0) return `${years} yr${years > 1 ? 's' : ''}`
    return `${years} yr${years > 1 ? 's' : ''} ${remainingMonths} mos`
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
        {editable && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onAdd}
          >
            Add Experience
          </Button>
        )}
      </div>

      <div className="space-y-8">
        {experienceItems.map((exp, index) => (
          <div key={exp.id || index} className="flex group">
            {/* Timeline */}
            <div className="flex flex-col items-center mr-4">
              <div className="w-3 h-3 bg-primary-500 rounded-full mt-1"></div>
              {index < experienceItems.length - 1 && (
                <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {exp.position}
                  </h3>
                  <div className="flex items-center text-primary-600 font-medium mb-2">
                    <Building className="h-4 w-4 mr-1" />
                    {exp.company}
                  </div>
                </div>

                {editable && (
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit2}
                      onClick={() => onEdit?.(exp)}
                      className="!p-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => onDelete?.(exp.id)}
                      className="!p-1 text-red-600 hover:text-red-700"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  <span className="ml-2 text-gray-400">
                    ({getDuration(exp.startDate, exp.endDate, exp.current)})
                  </span>
                </div>
                {exp.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {exp.location}
                  </div>
                )}
              </div>

              {exp.description && (
                <p className="text-gray-600 leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>
          </div>
        ))}

        {experienceItems.length === 0 && (
          <div className="text-center py-8">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No work experience added yet</p>
            {editable && (
              <Button
                variant="outline"
                icon={Plus}
                onClick={onAdd}
              >
                Add Your First Experience
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Experience