import React, { useState, useRef } from 'react'
import { 
  Save, 
  Eye, 
  Palette, 
  Layout, 
  Type, 
  Image, 
  Plus, 
  Trash2, 
  Move,
  Settings,
  Download,
  Upload
} from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const TemplateBuilder = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  const [template, setTemplate] = useState({
    name: 'My Custom Template',
    description: 'A beautiful portfolio template',
    category: 'modern',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Hero Section',
        content: {
          title: 'Your Name Here',
          subtitle: 'Your Professional Title',
          description: 'Brief description about yourself',
          backgroundImage: '',
          ctaText: 'Get In Touch'
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
          description: 'Tell your story here...',
          image: '',
          skills: ['Skill 1', 'Skill 2', 'Skill 3']
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
              title: 'Project 1',
              description: 'Project description',
              image: '',
              technologies: ['React', 'Node.js'],
              link: '#'
            }
          ]
        },
        styles: {
          backgroundColor: '#F9FAFB',
          textColor: '#1F2937',
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
  })

  const [activeSection, setActiveSection] = useState('hero')
  const [previewMode, setPreviewMode] = useState(false)
  const [saving, setSaving] = useState(false)

  const sectionTypes = [
    { type: 'hero', name: 'Hero Section', icon: Layout },
    { type: 'about', name: 'About Section', icon: Type },
    { type: 'projects', name: 'Projects Section', icon: Image },
    { type: 'skills', name: 'Skills Section', icon: Settings },
    { type: 'contact', name: 'Contact Section', icon: Plus }
  ]

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(template.sections)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setTemplate({ ...template, sections: items })
  }

  const addSection = (type) => {
    const newSection = {
      id: `${type}_${Date.now()}`,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      content: getDefaultContent(type),
      styles: {
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        padding: '60px 0'
      }
    }

    setTemplate({
      ...template,
      sections: [...template.sections, newSection]
    })
  }

  const getDefaultContent = (type) => {
    switch (type) {
      case 'hero':
        return {
          title: 'Your Name Here',
          subtitle: 'Your Professional Title',
          description: 'Brief description about yourself',
          backgroundImage: '',
          ctaText: 'Get In Touch'
        }
      case 'about':
        return {
          title: 'About Me',
          description: 'Tell your story here...',
          image: '',
          skills: []
        }
      case 'projects':
        return {
          title: 'My Projects',
          projects: []
        }
      case 'skills':
        return {
          title: 'My Skills',
          skills: []
        }
      case 'contact':
        return {
          title: 'Get In Touch',
          description: 'Let\'s work together',
          email: 'your@email.com',
          phone: '+1234567890'
        }
      default:
        return {}
    }
  }

  const updateSection = (sectionId, updates) => {
    setTemplate({
      ...template,
      sections: template.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    })
  }

  const deleteSection = (sectionId) => {
    setTemplate({
      ...template,
      sections: template.sections.filter(section => section.id !== sectionId)
    })
  }

  const saveTemplate = async () => {
    setSaving(true)
    try {
      // API call to save template
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(template)
      })

      if (response.ok) {
        toast.success('Template saved successfully!')
        navigate('/dashboard/templates')
      } else {
        throw new Error('Failed to save template')
      }
    } catch (error) {
      toast.error('Failed to save template')
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  const exportTemplate = () => {
    const dataStr = JSON.stringify(template, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${template.name.replace(/\s+/g, '_')}_template.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const importTemplate = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedTemplate = JSON.parse(e.target.result)
          setTemplate(importedTemplate)
          toast.success('Template imported successfully!')
        } catch (error) {
          toast.error('Invalid template file')
        }
      }
      reader.readAsText(file)
    }
  }

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Template Preview</h1>
          <button
            onClick={() => setPreviewMode(false)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Exit Preview
          </button>
        </div>
        
        <div className="max-w-6xl mx-auto">
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
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Template Builder</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
              <input
                type="text"
                value={template.name}
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={template.description}
                onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Sections List */}
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Sections</h3>
            <div className="relative">
              <select
                onChange={(e) => addSection(e.target.value)}
                value=""
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Add Section</option>
                {sectionTypes.map((type) => (
                  <option key={type.type} value={type.type}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {template.sections.map((section, index) => (
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            activeSection === section.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setActiveSection(section.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div {...provided.dragHandleProps}>
                                <Move className="w-4 h-4 text-gray-400" />
                              </div>
                              <span className="font-medium text-sm">{section.title}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteSection(section.id)
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          <button
            onClick={() => setPreviewMode(true)}
            className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={exportTemplate}
              className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
          </div>
          
          <button
            onClick={saveTemplate}
            disabled={saving}
            className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Template'}</span>
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Editor Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">
              {template.sections.find(s => s.id === activeSection)?.title || 'Select a section'}
            </h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/dashboard/templates')}
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Templates
              </button>
            </div>
          </div>
        </div>

        {/* Section Editor */}
        <div className="flex-1 p-6">
          {activeSection && (
            <SectionEditor
              section={template.sections.find(s => s.id === activeSection)}
              onUpdate={(updates) => updateSection(activeSection, updates)}
              globalStyles={template.globalStyles}
              onGlobalStylesUpdate={(styles) => setTemplate({ ...template, globalStyles: styles })}
            />
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importTemplate}
        className="hidden"
      />
    </div>
  )

  function renderSectionPreview(section) {
    switch (section.type) {
      case 'hero':
        return (
          <div className="text-center py-20">
            <h1 className="text-5xl font-bold mb-4">{section.content.title}</h1>
            <p className="text-xl mb-6">{section.content.subtitle}</p>
            <p className="text-lg mb-8 max-w-2xl mx-auto">{section.content.description}</p>
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg">
              {section.content.ctaText}
            </button>
          </div>
        )
      case 'about':
        return (
          <div className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12">{section.content.title}</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg leading-relaxed">{section.content.description}</p>
              </div>
              <div className="space-y-4">
                {section.content.skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 'projects':
        return (
          <div className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12">{section.content.title}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.content.projects.map((project, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
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
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return <div className="py-16 text-center">Section Preview</div>
    }
  }
}

// Section Editor Component
const SectionEditor = ({ section, onUpdate, globalStyles, onGlobalStylesUpdate }) => {
  if (!section) return null

  const updateContent = (field, value) => {
    onUpdate({
      content: { ...section.content, [field]: value }
    })
  }

  const updateStyles = (field, value) => {
    onUpdate({
      styles: { ...section.styles, [field]: value }
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Content Editor */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Content</h3>
        
        {section.type === 'hero' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={section.content.title}
                onChange={(e) => updateContent('title', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={section.content.subtitle}
                onChange={(e) => updateContent('subtitle', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={section.content.description}
                onChange={(e) => updateContent('description', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
              <input
                type="text"
                value={section.content.ctaText}
                onChange={(e) => updateContent('ctaText', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        {section.type === 'about' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={section.content.title}
                onChange={(e) => updateContent('title', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={section.content.description}
                onChange={(e) => updateContent('description', e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills (one per line)</label>
              <textarea
                value={section.content.skills.join('\n')}
                onChange={(e) => updateContent('skills', e.target.value.split('\n').filter(s => s.trim()))}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Style Editor */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Styling</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
            <input
              type="color"
              value={section.styles.backgroundColor}
              onChange={(e) => updateStyles('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
            <input
              type="color"
              value={section.styles.textColor}
              onChange={(e) => updateStyles('textColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateBuilder
