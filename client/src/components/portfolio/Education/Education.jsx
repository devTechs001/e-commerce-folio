import React from 'react'
import { Calendar, MapPin, BookOpen, Edit2, Trash2, Plus } from 'lucide-react'
import Button from '../../common/Button/Button'

const Education = ({ data = [], editable = false, onAdd, onEdit, onDelete }) => {
  const defaultEducation = [
    {
      id: 1,
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of Technology',
      location: 'New York, NY',
      startDate: '2016-09',
      endDate: '2020-05',
      description: 'Graduated magna cum laude. Focused on software engineering and machine learning.',
      gpa: '3.8'
    }
  ]

  const educationItems = data.length > 0 ? data : defaultEducation

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Education</h2>
        {editable && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onAdd}
          >
            Add Education
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {educationItems.map((edu, index) => (
          <div key={edu.id || index} className="flex items-start space-x-4 group">
            {/* Institution Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary-600" />
            </div>

            {/* Education Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {edu.degree}
              </h3>
              <p className="text-primary-600 font-medium mb-2">
                {edu.institution}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                </div>
                {edu.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {edu.location}
                  </div>
                )}
                {edu.gpa && (
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    GPA: {edu.gpa}
                  </div>
                )}
              </div>

              {edu.description && (
                <p className="text-gray-600 leading-relaxed">
                  {edu.description}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            {editable && (
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit2}
                  onClick={() => onEdit?.(edu)}
                  className="!p-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => onDelete?.(edu.id)}
                  className="!p-1 text-red-600 hover:text-red-700"
                />
              </div>
            )}
          </div>
        ))}

        {educationItems.length === 0 && (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No education history added yet</p>
            {editable && (
              <Button
                variant="outline"
                icon={Plus}
                onClick={onAdd}
              >
                Add Your First Education
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Education