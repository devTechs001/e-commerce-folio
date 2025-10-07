import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  Share2, 
  Heart, 
  Star,
  Eye,
  Code,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const TemplatePreview = () => {
  const { templateId } = useParams()
  const navigate = useNavigate()
  
  const [template, setTemplate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('desktop') // desktop, tablet, mobile
  const [showCode, setShowCode] = useState(false)
  const [liked, setLiked] = useState(false)
  const [rating, setRating] = useState(0)

  useEffect(() => {
    fetchTemplate()
  }, [templateId])

  const fetchTemplate = async () => {
    try {
      // Mock template data - replace with API call
      const mockTemplate = {
        id: templateId,
        name: 'Modern Portfolio Template',
        description: 'A clean and modern portfolio template perfect for developers and designers',
        author: 'John Doe',
        category: 'modern',
        tags: ['portfolio', 'modern', 'responsive'],
        rating: 4.8,
        downloads: 1234,
        likes: 567,
        createdAt: '2024-01-15',
        sections: [
          {
            id: 'hero',
            type: 'hero',
            title: 'Hero Section',
            content: {
              title: 'Jane Smith',
              subtitle: 'Full Stack Developer',
              description: 'Passionate about creating beautiful and functional web applications',
              backgroundImage: '',
              ctaText: 'View My Work'
            },
            styles: {
              backgroundColor: '#1F2937',
              textColor: '#FFFFFF',
              padding: '80px 0'
            }
          },
          {
            id: 'about',
            type: 'about',
            title: 'About Section',
            content: {
              title: 'About Me',
              description: 'I am a passionate full-stack developer with 5+ years of experience building web applications. I love working with modern technologies and creating user-friendly interfaces.',
              image: '',
              skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker']
            },
            styles: {
              backgroundColor: '#FFFFFF',
              textColor: '#1F2937',
              padding: '60px 0'
            }
          },
          {
            id: 'projects',
            type: 'projects',
            title: 'Projects Section',
            content: {
              title: 'My Projects',
              projects: [
                {
                  title: 'E-Commerce Platform',
                  description: 'A full-featured e-commerce platform built with React and Node.js',
                  image: '',
                  technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
                  link: '#'
                },
                {
                  title: 'Task Management App',
                  description: 'A collaborative task management application with real-time updates',
                  image: '',
                  technologies: ['React', 'Socket.io', 'Express', 'PostgreSQL'],
                  link: '#'
                },
                {
                  title: 'Weather Dashboard',
                  description: 'A beautiful weather dashboard with location-based forecasts',
                  image: '',
                  technologies: ['Vue.js', 'Weather API', 'Chart.js'],
                  link: '#'
                }
              ]
            },
            styles: {
              backgroundColor: '#F9FAFB',
              textColor: '#1F2937',
              padding: '60px 0'
            }
          },
          {
            id: 'contact',
            type: 'contact',
            title: 'Contact Section',
            content: {
              title: 'Get In Touch',
              description: 'Let\'s work together on your next project',
              email: 'jane@example.com',
              phone: '+1 (555) 123-4567'
            },
            styles: {
              backgroundColor: '#1F2937',
              textColor: '#FFFFFF',
              padding: '60px 0'
            }
          }
        ],
        globalStyles: {
          primaryColor: '#3B82F6',
          secondaryColor: '#1F2937',
          fontFamily: 'Inter',
          borderRadius: '8px'
        }
      }

      setTemplate(mockTemplate)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching template:', error)
      toast.error('Failed to load template')
      setLoading(false)
    }
  }

  const handleLike = () => {
    setLiked(!liked)
    toast.success(liked ? 'Removed from favorites' : 'Added to favorites')
  }

  const handleRating = (newRating) => {
    setRating(newRating)
    toast.success(`Rated ${newRating} stars`)
  }

  const handleDownload = () => {
    if (template) {
      const dataStr = JSON.stringify(template, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = `${template.name.replace(/\s+/g, '_')}_template.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
      
      toast.success('Template downloaded!')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: template.name,
        text: template.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const getViewportClass = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-sm mx-auto'
      case 'tablet':
        return 'max-w-2xl mx-auto'
      default:
        return 'max-w-6xl mx-auto'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading template...</p>
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Template not found</h2>
          <p className="text-gray-600 mb-4">The template you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard/templates')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Templates
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard/templates')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900">{template.name}</h1>
                <p className="text-sm text-gray-600">by {template.author}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Viewport Controls */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('tablet')}
                  className={`p-2 rounded ${viewMode === 'tablet' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              {/* Actions */}
              <button
                onClick={() => setShowCode(!showCode)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Code className="w-4 h-4" />
                <span>Code</span>
              </button>

              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors ${
                  liked 
                    ? 'border-red-300 bg-red-50 text-red-600' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                <span>{template.likes + (liked ? 1 : 0)}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>

              <button
                onClick={() => navigate(`/dashboard/templates/edit/${templateId}`)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{template.downloads} downloads</span>
              </div>
              
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`w-4 h-4 ${
                      star <= (rating || template.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {template.rating} ({template.downloads} reviews)
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 mt-4">{template.description}</p>
        </div>
      </div>

      {/* Code View */}
      {showCode && (
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Template JSON</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(template, null, 2))
                  toast.success('Code copied to clipboard!')
                }}
                className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600 transition-colors"
              >
                Copy Code
              </button>
            </div>
            <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto text-sm">
              <code>{JSON.stringify(template, null, 2)}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Template Preview */}
      <div className="py-8">
        <div className={getViewportClass()}>
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-xl rounded-lg overflow-hidden"
          >
            {template.sections.map((section) => (
              <div
                key={section.id}
                style={{
                  backgroundColor: section.styles.backgroundColor,
                  color: section.styles.textColor,
                  padding: section.styles.padding
                }}
              >
                <div className="max-w-4xl mx-auto px-6">
                  {renderSectionPreview(section)}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )

  function renderSectionPreview(section) {
    switch (section.type) {
      case 'hero':
        return (
          <div className="text-center py-20">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold mb-4"
            >
              {section.content.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl mb-6"
            >
              {section.content.subtitle}
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg mb-8 max-w-2xl mx-auto"
            >
              {section.content.description}
            </motion.p>
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-primary-700 transition-colors"
            >
              {section.content.ctaText}
            </motion.button>
          </div>
        )
      
      case 'about':
        return (
          <div className="py-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-center mb-12"
            >
              {section.content.title}
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-lg leading-relaxed">{section.content.description}</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {section.content.skills.map((skill, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                    <span>{skill}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        )
      
      case 'projects':
        return (
          <div className="py-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-center mb-12"
            >
              {section.content.title}
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.content.projects.map((project, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-br from-primary-400 to-blue-500"></div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )
      
      case 'contact':
        return (
          <div className="py-16 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold mb-6"
            >
              {section.content.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg mb-8"
            >
              {section.content.description}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <p className="text-lg">{section.content.email}</p>
              <p className="text-lg">{section.content.phone}</p>
            </motion.div>
          </div>
        )
      
      default:
        return <div className="py-16 text-center">Section Preview</div>
    }
  }
}

export default TemplatePreview
