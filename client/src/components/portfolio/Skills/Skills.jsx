import React from 'react'
import { Edit2, Trash2, Plus, Star } from 'lucide-react'
import Button from '../../common/Button/Button'

const Skills = ({ data = [], editable = false, onAdd, onEdit, onDelete }) => {
  const defaultSkills = [
    { id: 1, name: 'JavaScript', category: 'Programming', level: 5 },
    { id: 2, name: 'React', category: 'Frontend', level: 5 },
    { id: 3, name: 'Node.js', category: 'Backend', level: 4 },
    { id: 4, name: 'Python', category: 'Programming', level: 4 },
    { id: 5, name: 'UI/UX Design', category: 'Design', level: 3 },
    { id: 6, name: 'Project Management', category: 'Soft Skills', level: 4 }
  ]

  const skills = data.length > 0 ? data : defaultSkills

  const categories = [...new Set(skills.map(skill => skill.category))]

  const SkillLevel = ({ level }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= level ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const getLevelText = (level) => {
    const levels = {
      1: 'Beginner',
      2: 'Basic',
      3: 'Intermediate',
      4: 'Advanced',
      5: 'Expert'
    }
    return levels[level] || 'Unknown'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Skills & Expertise</h2>
        {editable && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onAdd}
          >
            Add Skill
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {skills
                .filter(skill => skill.category === category)
                .map((skill, index) => (
                  <div
                    key={skill.id || index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{skill.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <SkillLevel level={skill.level} />
                          <span className="text-sm text-gray-500">
                            {getLevelText(skill.level)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {editable && (
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Edit2}
                          onClick={() => onEdit?.(skill)}
                          className="!p-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => onDelete?.(skill.id)}
                          className="!p-1 text-red-600 hover:text-red-700"
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">No skills added yet</p>
          {editable && (
            <Button
              variant="outline"
              icon={Plus}
              onClick={onAdd}
            >
              Add Your First Skill
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default Skills