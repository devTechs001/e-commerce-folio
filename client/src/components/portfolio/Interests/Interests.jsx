import React from 'react'
import { Edit2, Trash2, Plus, Music, Camera, Book, GamepadIcon as Game, Utensils, Plane } from 'lucide-react'
import Button from '../../common/Button/Button'

const Interests = ({ data = [], editable = false, onAdd, onEdit, onDelete }) => {
  const defaultInterests = [
    { id: 1, name: 'Photography', icon: 'Camera' },
    { id: 2, name: 'Music', icon: 'Music' },
    { id: 3, name: 'Reading', icon: 'Book' },
    { id: 4, name: 'Travel', icon: 'Plane' },
    { id: 5, name: 'Gaming', icon: 'Game' },
    { id: 6, name: 'Cooking', icon: 'Utensils' }
  ]

  const interests = data.length > 0 ? data : defaultInterests

  const iconMap = {
    Music: Music,
    Camera: Camera,
    Book: Book,
    Game: Game,
    Utensils: Utensils,
    Plane: Plane
  }

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || Book
    return <IconComponent className="h-5 w-5" />
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Interests & Hobbies</h2>
        {editable && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onAdd}
          >
            Add Interest
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {interests.map((interest, index) => (
          <div
            key={interest.id || index}
            className="relative group bg-gray-50 rounded-lg p-4 text-center hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all"
          >
            {/* Interest Icon */}
            <div className="text-primary-600 mb-2 flex justify-center">
              {getIcon(interest.icon)}
            </div>

            {/* Interest Name */}
            <h3 className="text-sm font-medium text-gray-900">
              {interest.name}
            </h3>

            {/* Action Buttons */}
            {editable && (
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit2}
                  onClick={() => onEdit?.(interest)}
                  className="!p-1 bg-white/90 hover:bg-white"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => onDelete?.(interest.id)}
                  className="!p-1 bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {interests.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">No interests added yet</p>
          {editable && (
            <Button
              variant="outline"
              icon={Plus}
              onClick={onAdd}
            >
              Add Your First Interest
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default Interests