import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye, 
  Edit, 
  Download, 
  Heart, 
  Star,
  Trash2,
  Copy,
  Share2,
  MoreVertical
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const TemplateGallery = () => {
  const navigate = useNavigate()
  
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [selectedTemplates, setSelectedTemplates] = useState([])

  const categories = [
    { id: 'all', name: 'All Templates', count: 24 },
    { id: 'modern', name: 'Modern', count: 8 },
    { id: 'minimal', name: 'Minimal', count: 6 },
    { id: 'creative', name: 'Creative', count: 5 },
    { id: 'professional', name: 'Professional', count: 3 },
    { id: 'portfolio', name: 'Portfolio', count: 2 }
  ]

  const sortOptions = [
    { id: 'newest', name: 'Newest First' },
    { id: 'oldest', name: 'Oldest First' },
    { id: 'popular', name: 'Most Popular' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'downloads', name: 'Most Downloaded' }
  ]

  useEffect(() => {
    fetchTemplates()
  }, [selectedCategory, sortBy])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      // Mock template data
      const mockTemplates = [
        {
          id: '1',
          name: 'Modern Portfolio',
          description: 'A clean and modern portfolio template perfect for developers',
          thumbnail: '/api/placeholder/400/300',
          author: 'John Doe',
          category: 'modern',
          tags: ['portfolio', 'modern', 'responsive'],
          rating: 4.8,
          downloads: 1234,
          likes: 567,
          isLiked: false,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20',
          isPublic: true,
          sections: 5
        },
        {
          id: '2',
          name: 'Minimal Resume',
          description: 'Simple and elegant resume template with clean typography',
          thumbnail: '/api/placeholder/400/300',
          author: 'Jane Smith',
          category: 'minimal',
          tags: ['resume', 'minimal', 'clean'],
          rating: 4.6,
          downloads: 892,
          likes: 234,
          isLiked: true,
          createdAt: '2024-01-10',
          updatedAt: '2024-01-18',
          isPublic: true,
          sections: 4
        },
        {
          id: '3',
          name: 'Creative Agency',
          description: 'Bold and creative template for agencies and creative professionals',
          thumbnail: '/api/placeholder/400/300',
          author: 'Mike Johnson',
          category: 'creative',
          tags: ['agency', 'creative', 'bold'],
          rating: 4.9,
          downloads: 2156,
          likes: 891,
          isLiked: false,
          createdAt: '2024-01-05',
          updatedAt: '2024-01-22',
          isPublic: true,
          sections: 7
        },
        {
          id: '4',
          name: 'Professional Business',
          description: 'Corporate template suitable for business professionals',
          thumbnail: '/api/placeholder/400/300',
          author: 'Sarah Wilson',
          category: 'professional',
          tags: ['business', 'corporate', 'professional'],
          rating: 4.5,
          downloads: 678,
          likes: 123,
          isLiked: false,
          createdAt: '2024-01-12',
          updatedAt: '2024-01-19',
          isPublic: false,
          sections: 6
        }
      ]

      // Filter by category
      let filteredTemplates = selectedCategory === 'all' 
        ? mockTemplates 
        : mockTemplates.filter(t => t.category === selectedCategory)

      // Sort templates
      switch (sortBy) {
        case 'oldest':
          filteredTemplates.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          break
        case 'popular':
          filteredTemplates.sort((a, b) => b.downloads - a.downloads)
          break
        case 'rating':
          filteredTemplates.sort((a, b) => b.rating - a.rating)
          break
        case 'downloads':
          filteredTemplates.sort((a, b) => b.downloads - a.downloads)
          break
        default: // newest
          filteredTemplates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }

      setTemplates(filteredTemplates)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast.error('Failed to load templates')
      setLoading(false)
    }
  }

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleLike = (templateId) => {
    setTemplates(templates.map(template => 
      template.id === templateId 
        ? { 
            ...template, 
            isLiked: !template.isLiked,
            likes: template.isLiked ? template.likes - 1 : template.likes + 1
          }
        : template
    ))
  }

  const handleDelete = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== templateId))
      toast.success('Template deleted successfully')
    }
  }

  const handleDuplicate = (templateId) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      const duplicatedTemplate = {
        ...template,
        id: `${template.id}_copy_${Date.now()}`,
        name: `${template.name} (Copy)`,
        createdAt: new Date().toISOString(),
        downloads: 0,
        likes: 0,
        isLiked: false
      }
      setTemplates([duplicatedTemplate, ...templates])
      toast.success('Template duplicated successfully')
    }
  }

  const handleBulkAction = (action) => {
    if (selectedTemplates.length === 0) {
      toast.error('Please select templates first')
      return
    }

    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedTemplates.length} selected templates?`)) {
          setTemplates(templates.filter(t => !selectedTemplates.includes(t.id)))
          setSelectedTemplates([])
          toast.success(`${selectedTemplates.length} templates deleted`)
        }
        break
      case 'duplicate':
        const duplicates = templates
          .filter(t => selectedTemplates.includes(t.id))
          .map(template => ({
            ...template,
            id: `${template.id}_copy_${Date.now()}`,
            name: `${template.name} (Copy)`,
            createdAt: new Date().toISOString(),
            downloads: 0,
            likes: 0,
            isLiked: false
          }))
        setTemplates([...duplicates, ...templates])
        setSelectedTemplates([])
        toast.success(`${duplicates.length} templates duplicated`)
        break
    }
  }

  const toggleTemplateSelection = (templateId) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    )
  }

  const selectAllTemplates = () => {
    if (selectedTemplates.length === filteredTemplates.length) {
      setSelectedTemplates([])
    } else {
      setSelectedTemplates(filteredTemplates.map(t => t.id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Template Gallery</h1>
              <p className="text-gray-600 mt-1">Create and manage your portfolio templates</p>
            </div>
            
            <button
              onClick={() => navigate('/dashboard/templates/create')}
              className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create Template</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50"
              >
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.count})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedCategory('all')
                        setSortBy('newest')
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bulk Actions */}
          {selectedTemplates.length > 0 && (
            <div className="flex items-center justify-between bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-primary-700">
                  {selectedTemplates.length} template{selectedTemplates.length > 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={selectAllTemplates}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  {selectedTemplates.length === filteredTemplates.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('duplicate')}
                  className="flex items-center space-x-2 px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4" />
                  <span>Duplicate</span>
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="flex items-center space-x-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Templates Grid/List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search terms' : 'Create your first template to get started'}
            </p>
            <button
              onClick={() => navigate('/dashboard/templates/create')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create Template
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplates.includes(template.id)}
                onSelect={() => toggleTemplateSelection(template.id)}
                onLike={() => handleLike(template.id)}
                onDelete={() => handleDelete(template.id)}
                onDuplicate={() => handleDuplicate(template.id)}
                onEdit={() => navigate(`/dashboard/templates/edit/${template.id}`)}
                onPreview={() => navigate(`/dashboard/templates/preview/${template.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTemplates.map((template) => (
              <TemplateListItem
                key={template.id}
                template={template}
                isSelected={selectedTemplates.includes(template.id)}
                onSelect={() => toggleTemplateSelection(template.id)}
                onLike={() => handleLike(template.id)}
                onDelete={() => handleDelete(template.id)}
                onDuplicate={() => handleDuplicate(template.id)}
                onEdit={() => navigate(`/dashboard/templates/edit/${template.id}`)}
                onPreview={() => navigate(`/dashboard/templates/preview/${template.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Template Card Component
const TemplateCard = ({ 
  template, 
  isSelected, 
  onSelect, 
  onLike, 
  onDelete, 
  onDuplicate, 
  onEdit, 
  onPreview 
}) => {
  const [showActions, setShowActions] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm border-2 transition-all hover:shadow-lg ${
        isSelected ? 'border-primary-500' : 'border-gray-200'
      }`}
    >
      {/* Template Thumbnail */}
      <div className="relative group">
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-blue-500 opacity-80"></div>
        </div>
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-t-lg flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2">
            <button
              onClick={onPreview}
              className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={onEdit}
              className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selection Checkbox */}
        <div className="absolute top-3 left-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
        </div>

        {/* Privacy Badge */}
        {!template.isPublic && (
          <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
            Private
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-32">
                <button
                  onClick={() => {
                    onDuplicate()
                    setShowActions(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Duplicate</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + `/templates/${template.id}`)
                    toast.success('Link copied!')
                    setShowActions(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => {
                    onDelete()
                    setShowActions(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
              {tag}
            </span>
          ))}
          {template.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              +{template.tags.length - 2}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{template.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>{template.downloads}</span>
            </div>
          </div>
          
          <button
            onClick={onLike}
            className={`flex items-center space-x-1 ${
              template.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${template.isLiked ? 'fill-current' : ''}`} />
            <span>{template.likes}</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Template List Item Component
const TemplateListItem = ({ 
  template, 
  isSelected, 
  onSelect, 
  onLike, 
  onDelete, 
  onDuplicate, 
  onEdit, 
  onPreview 
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg border-2 p-4 transition-all hover:shadow-md ${
        isSelected ? 'border-primary-500' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        
        <div className="w-16 h-12 bg-gradient-to-br from-primary-400 to-blue-500 rounded"></div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
            {!template.isPublic && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                Private
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 truncate">{template.description}</p>
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            <span>by {template.author}</span>
            <span>{template.sections} sections</span>
            <span>{new Date(template.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{template.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="w-4 h-4" />
            <span>{template.downloads}</span>
          </div>
          <button
            onClick={onLike}
            className={`flex items-center space-x-1 ${
              template.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${template.isLiked ? 'fill-current' : ''}`} />
            <span>{template.likes}</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onPreview}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDuplicate}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default TemplateGallery
