import React, { useState, useEffect } from 'react'
import { 
  Download, Eye, Heart, Star, TrendingUp, Zap, Crown,
  Search, Filter, Grid, List, ExternalLink, Check, Plus,
  Code, Palette, Layout, Smartphone
} from 'lucide-react'
import { subscriptionService } from '../../../services/subscription'
import Button from '../../common/Button/Button'

const EnhancedTemplateGallery = () => {
  const [templates, setTemplates] = useState([])
  const [viewMode, setViewMode] = useState('grid') // grid, list
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular') // popular, newest, downloads
  const [userTier, setUserTier] = useState('free')
  const [favorites, setFavorites] = useState([])
  const [previewTemplate, setPreviewTemplate] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      const tier = await subscriptionService.getUserTier()
      setUserTier(tier)
      loadTemplates()
    }
    loadData()
  }, [])

  const isPremium = ['premium', 'professional', 'enterprise'].includes(userTier)

  const loadTemplates = () => {
    // Realistic template data
    setTemplates([
      {
        id: 1,
        name: 'Modern Developer',
        category: 'developer',
        description: 'Clean and modern portfolio template perfect for developers and programmers',
        thumbnail: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800',
        previewUrl: '/templates/preview/modern-developer',
        downloadUrl: '/templates/download/modern-developer.zip',
        premium: false,
        features: ['Responsive Design', 'Dark Mode', 'Project Showcase', 'Skills Section', 'Contact Form'],
        technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
        downloads: 15420,
        rating: 4.8,
        reviews: 342,
        isNew: false,
        isTrending: true
      },
      {
        id: 2,
        name: 'Creative Portfolio',
        category: 'creative',
        description: 'Bold and vibrant template for designers and creative professionals',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        previewUrl: '/templates/preview/creative-portfolio',
        downloadUrl: '/templates/download/creative-portfolio.zip',
        premium: true,
        features: ['Animated Sections', 'Gallery Grid', 'Video Support', 'Testimonials', 'Blog Integration'],
        technologies: ['HTML', 'CSS', 'JavaScript', 'Framer Motion'],
        downloads: 8930,
        rating: 4.9,
        reviews: 178,
        isNew: true,
        isTrending: true
      },
      {
        id: 3,
        name: 'Minimal Business',
        category: 'business',
        description: 'Professional and minimal template for consultants and businesses',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        previewUrl: '/templates/preview/minimal-business',
        downloadUrl: '/templates/download/minimal-business.zip',
        premium: false,
        features: ['Service Pages', 'Team Section', 'Pricing Tables', 'FAQ Section', 'Newsletter'],
        technologies: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
        downloads: 12650,
        rating: 4.7,
        reviews: 289,
        isNew: false,
        isTrending: false
      },
      {
        id: 4,
        name: 'Photography Pro',
        category: 'photography',
        description: 'Stunning template optimized for photographers and visual artists',
        thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800',
        previewUrl: '/templates/preview/photography-pro',
        downloadUrl: '/templates/download/photography-pro.zip',
        premium: true,
        features: ['Fullscreen Gallery', 'Lightbox', 'Image Slider', 'Client Proofing', 'Booking Form'],
        technologies: ['HTML', 'CSS', 'JavaScript', 'Vue.js'],
        downloads: 6780,
        rating: 4.9,
        reviews: 145,
        isNew: true,
        isTrending: true
      },
      {
        id: 5,
        name: 'Agency Landing',
        category: 'business',
        description: 'High-converting landing page template for agencies and startups',
        thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
        previewUrl: '/templates/preview/agency-landing',
        downloadUrl: '/templates/download/agency-landing.zip',
        premium: true,
        features: ['Hero Video', 'Stats Counter', 'Case Studies', 'Team Grid', 'CTA Sections'],
        technologies: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS'],
        downloads: 9430,
        rating: 4.8,
        reviews: 201,
        isNew: false,
        isTrending: true
      },
      {
        id: 6,
        name: 'Developer Resume',
        category: 'developer',
        description: 'Clean resume-style template perfect for job applications',
        thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
        previewUrl: '/templates/preview/developer-resume',
        downloadUrl: '/templates/download/developer-resume.zip',
        premium: false,
        features: ['Print-Friendly', 'PDF Export', 'Timeline View', 'Skills Chart', 'References'],
        technologies: ['HTML', 'CSS', 'JavaScript'],
        downloads: 18920,
        rating: 4.6,
        reviews: 412,
        isNew: false,
        isTrending: false
      }
    ])
  }

  const categories = [
    { id: 'all', name: 'All Templates', icon: Layout },
    { id: 'developer', name: 'Developer', icon: Code },
    { id: 'creative', name: 'Creative', icon: Palette },
    { id: 'business', name: 'Business', icon: TrendingUp },
    { id: 'photography', name: 'Photography', icon: Zap }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.downloads - a.downloads
    if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  const toggleFavorite = (templateId) => {
    if (favorites.includes(templateId)) {
      setFavorites(favorites.filter(id => id !== templateId))
    } else {
      setFavorites([...favorites, templateId])
    }
  }

  const handleDownload = (template) => {
    if (template.premium && !isPremium) {
      alert('This is a premium template. Upgrade to download!')
      return
    }

    // Simulate download
    alert(`Downloading ${template.name}...\n\nThe template will include:\n- HTML, CSS, JS files\n- Assets and images\n- Documentation\n- Source code`)
  }

  const handleUseTemplate = (template) => {
    if (template.premium && !isPremium) {
      alert('This is a premium template. Upgrade to use it!')
      return
    }

    alert(`Using ${template.name} for your portfolio!`)
    // Navigate to editor with template
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Template Gallery</h2>
          <p className="text-gray-600">Professional, ready-to-use portfolio templates</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          )
        })}
      </div>

      {/* Templates Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="h-5 w-5 text-gray-900" />
                    </button>
                    <button
                      onClick={() => handleDownload(template)}
                      className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Download className="h-5 w-5 text-gray-900" />
                    </button>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {template.isNew && (
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                      NEW
                    </span>
                  )}
                  {template.isTrending && (
                    <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>TRENDING</span>
                    </span>
                  )}
                  {template.premium && (
                    <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center space-x-1">
                      <Crown className="h-3 w-3" />
                      <span>PREMIUM</span>
                    </span>
                  )}
                </div>

                {/* Favorite */}
                <button
                  onClick={() => toggleFavorite(template.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      favorites.includes(template.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{template.rating}</span>
                    <span>({template.reviews})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span>{(template.downloads / 1000).toFixed(1)}k</span>
                  </div>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.technologies.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {template.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{template.technologies.length - 3}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleUseTemplate(template)}
                    className="flex-1"
                    size="sm"
                    icon={Plus}
                  >
                    Use Template
                  </Button>
                  <Button
                    onClick={() => setPreviewTemplate(template)}
                    variant="outline"
                    size="sm"
                    icon={Eye}
                  >
                    Preview
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start space-x-6">
                {/* Thumbnail */}
                <div className="w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
                        {template.premium && (
                          <Crown className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{template.description}</p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(template.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          favorites.includes(template.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                    {template.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-1 text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{template.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>{(template.downloads / 1000).toFixed(1)}k downloads</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setPreviewTemplate(template)}
                        variant="outline"
                        size="sm"
                        icon={Eye}
                      >
                        Preview
                      </Button>
                      <Button
                        onClick={() => handleUseTemplate(template)}
                        size="sm"
                        icon={Plus}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{previewTemplate.name}</h3>
                <p className="text-gray-600">{previewTemplate.description}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ×
              </button>
            </div>

            {/* Preview */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <img
                  src={previewTemplate.thumbnail}
                  alt={previewTemplate.name}
                  className="w-full"
                />
              </div>

              {/* Details */}
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                  <div className="space-y-2">
                    {previewTemplate.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-lg"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <Button
                onClick={() => {
                  handleDownload(previewTemplate)
                  setPreviewTemplate(null)
                }}
                icon={Download}
                className="flex-1"
              >
                Download Template
              </Button>
              <Button
                onClick={() => {
                  handleUseTemplate(previewTemplate)
                  setPreviewTemplate(null)
                }}
                variant="outline"
                icon={Plus}
                className="flex-1"
              >
                Use This Template
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedTemplateGallery
