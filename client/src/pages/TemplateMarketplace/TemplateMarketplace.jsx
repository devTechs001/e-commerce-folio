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
      
      // If no templates from API, use sample templates
      if (!response.templates || response.templates.length === 0) {
        setTemplates(getSampleTemplates())
      } else {
        setTemplates(response.templates)
      }
    } catch (error) {
      console.error('Error loading templates:', error)
      // Use sample templates on error
      setTemplates(getSampleTemplates())
    } finally {
      setLoading(false)
    }
  }
  
  const getSampleTemplates = () => [
    {
      id: 1,
      name: 'Modern Developer Portfolio',
      description: 'Clean and modern portfolio template perfect for developers and programmers',
      category: 'professional',
      price: 0,
      isPremium: false,
      rating: 4.8,
      downloads: 15420,
      previewImage: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800',
      features: ['Responsive Design', 'Dark Mode', 'Project Showcase', 'Skills Section', 'Contact Form']
    },
    {
      id: 2,
      name: 'Creative Portfolio Pro',
      description: 'Bold and vibrant template for designers and creative professionals',
      category: 'creative',
      price: 29,
      isPremium: true,
      rating: 4.9,
      downloads: 8930,
      previewImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      features: ['Animated Sections', 'Gallery Grid', 'Video Support', 'Testimonials', 'Blog Integration']
    },
    {
      id: 3,
      name: 'Minimal Business',
      description: 'Professional and minimal template for consultants and businesses',
      category: 'minimal',
      price: 0,
      isPremium: false,
      rating: 4.7,
      downloads: 12650,
      previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      features: ['Service Pages', 'Team Section', 'Pricing Tables', 'FAQ Section', 'Newsletter']
    },
    {
      id: 4,
      name: 'Photography Showcase',
      description: 'Stunning template optimized for photographers and visual artists',
      category: 'creative',
      price: 39,
      isPremium: true,
      rating: 4.9,
      downloads: 6780,
      previewImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800',
      features: ['Fullscreen Gallery', 'Lightbox', 'Image Slider', 'Client Proofing', 'Booking Form']
    },
    {
      id: 5,
      name: 'Bold Agency Landing',
      description: 'High-converting landing page template for agencies and startups',
      category: 'bold',
      price: 49,
      isPremium: true,
      rating: 4.8,
      downloads: 9430,
      previewImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
      features: ['Hero Video', 'Stats Counter', 'Case Studies', 'Team Grid', 'CTA Sections']
    },
    {
      id: 6,
      name: 'Developer Resume',
      description: 'Clean resume-style template perfect for job applications',
      category: 'minimal',
      price: 0,
      isPremium: false,
      rating: 4.6,
      downloads: 18920,
      previewImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
      features: ['Print-Friendly', 'PDF Export', 'Timeline View', 'Skills Chart', 'References']
    },
    {
      id: 7,
      name: 'Modern Tech Startup',
      description: 'Sleek and professional template for tech startups and SaaS products',
      category: 'modern',
      price: 59,
      isPremium: true,
      rating: 4.9,
      downloads: 5240,
      previewImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
      features: ['Product Showcase', 'Pricing Plans', 'Feature Highlights', 'Customer Logos', 'Newsletter']
    },
    {
      id: 8,
      name: 'Freelancer Portfolio',
      description: 'Versatile template for freelancers showcasing multiple skills',
      category: 'professional',
      price: 0,
      isPremium: false,
      rating: 4.7,
      downloads: 11230,
      previewImage: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800',
      features: ['Service Listing', 'Portfolio Grid', 'Client Reviews', 'Contact Form', 'Social Links']
    },
    {
      id: 9,
      name: 'Creative Agency',
      description: 'Dynamic template perfect for creative agencies and design studios',
      category: 'creative',
      price: 69,
      isPremium: true,
      rating: 4.8,
      downloads: 7650,
      previewImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
      features: ['Case Studies', 'Team Profiles', 'Service Offerings', 'Blog', 'Contact Options']
    },
    {
      id: 10,
      name: 'Personal Brand',
      description: 'Simple and elegant template for personal branding and storytelling',
      category: 'minimal',
      price: 19,
      isPremium: true,
      rating: 4.6,
      downloads: 8120,
      previewImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      features: ['About Me', 'Timeline', 'Blog Posts', 'Social Integration', 'Contact Form']
    },
    {
      id: 11,
      name: 'Bold Creative',
      description: 'Eye-catching template with bold typography and vibrant colors',
      category: 'bold',
      price: 0,
      isPremium: false,
      rating: 4.5,
      downloads: 9870,
      previewImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      features: ['Bold Typography', 'Color Gradients', 'Parallax Effects', 'Animation', 'Portfolio Grid']
    },
    {
      id: 12,
      name: 'Corporate Professional',
      description: 'Enterprise-grade template for corporate professionals and executives',
      category: 'professional',
      price: 79,
      isPremium: true,
      rating: 4.9,
      downloads: 4320,
      previewImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      features: ['Executive Bio', 'Media Kit', 'Speaking Events', 'Publications', 'Contact Suite']
    }
  ]

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
            <Link to={`/dashboard/templates/preview/${template.id}`}>
              <Button
                variant="primary"
                size="small"
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </Link>
            <Link to={`/dashboard/portfolio-editor?template=${template.id}`}>
              <Button
                variant="primary"
                size="small"
              >
                Use Template
              </Button>
            </Link>
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
              <Link to={`/dashboard/templates/preview/${template.id}`}>
                <Button variant="outline" size="small">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              </Link>
              <Link to={`/dashboard/portfolio-editor?template=${template.id}`}>
                <Button variant="primary" size="small">
                  Use Template
                </Button>
              </Link>
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