import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Grid, List, Star, Eye, Download } from 'lucide-react'
import { templateService } from '../../services/template'
import Button from '../../components/common/Button/Button'

const TemplateMarketplace = () => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'professional', name: 'Professional' },
    { id: 'creative', name: 'Creative' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'bold', name: 'Bold' },
    { id: 'modern', name: 'Modern' }
  ]

  const priceFilters = [
    { id: 'all', name: 'All Prices' },
    { id: 'free', name: 'Free' },
    { id: 'premium', name: 'Premium' }
  ]

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const response = await templateService.getTemplates()
      setTemplates(response.templates || [])
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'free' && template.price === 0) ||
                        (priceFilter === 'premium' && template.price > 0)
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  const TemplateCard = ({ template }) => (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <img
          src={template.previewImage || '/images/templates/placeholder.jpg'}
          alt={template.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          {template.isPremium && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Premium
            </span>
          )}
          <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
            {template.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="small"
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button
              variant="primary"
              size="small"
            >
              Use Template
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {template.name}
          </h3>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {template.price === 0 ? 'Free' : `$${template.price}`}
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {template.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span>{template.ratings?.average || 0}</span>
              <span className="text-gray-400 ml-1">({template.ratings?.count || 0})</span>
            </div>
            <div className="flex items-center">
              <Download className="h-4 w-4 mr-1" />
              <span>{template.downloads || 0}</span>
            </div>
          </div>
          <span className="capitalize">{template.category}</span>
        </div>
      </div>
    </div>
  )

  const TemplateList = ({ template }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start space-x-6">
        <img
          src={template.previewImage || '/images/templates/placeholder.jpg'}
          alt={template.name}
          className="w-32 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
                {template.name}
              </h3>
              <p className="text-gray-600 mb-2">
                {template.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {template.price === 0 ? 'Free' : `$${template.price}`}
              </div>
              {template.isPremium && (
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Premium
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                <span>{template.ratings?.average || 0}</span>
                <span className="text-gray-400 ml-1">({template.ratings?.count || 0})</span>
              </div>
              <div className="flex items-center">
                <Download className="h-4 w-4 mr-1" />
                <span>{template.downloads || 0} downloads</span>
              </div>
              <span className="capitalize bg-gray-100 px-2 py-1 rounded">{template.category}</span>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="small">
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
              <Button variant="primary" size="small">
                Use Template
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Template Marketplace
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates to showcase your work in the best light.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Filter className="h-4 w-4" />
                <span>Filter:</span>
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Price Filter */}
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                {priceFilters.map(filter => (
                  <option key={filter.id} value={filter.id}>
                    {filter.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredTemplates.length} of {templates.length} templates
          </p>
        </div>

        {/* Templates Grid/List */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-12 border border-gray-200">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setPriceFilter('all')
                }}
              >
                Clear all filters
              </Button>
            </div>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
          }>
            {filteredTemplates.map(template => (
              viewMode === 'grid' 
                ? <TemplateCard key={template._id} template={template} />
                : <TemplateList key={template._id} template={template} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateMarketplace