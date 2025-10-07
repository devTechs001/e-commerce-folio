import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Save, 
  Eye, 
  Undo, 
  Redo, 
  Palette, 
  Type, 
  Layout, 
  Image as ImageIcon,
  Settings,
  Copy,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { ChromePicker } from 'react-color'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const TemplateCustomizer = () => {
  const { templateId } = useParams()
  const navigate = useNavigate()
  
  const [template, setTemplate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activePanel, setActivePanel] = useState('design')
  const [selectedSection, setSelectedSection] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showColorPicker, setShowColorPicker] = useState(null)
  const [expandedSections, setExpandedSections] = useState({})

  const panels = [
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'layout', name: 'Layout', icon: Layout },
    { id: 'typography', name: 'Typography', icon: Type },
    { id: 'content', name: 'Content', icon: ImageIcon },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  useEffect(() => {
    fetchTemplate()
  }, [templateId])

  const fetchTemplate = async () => {
    try {
      // Mock template data
      const mockTemplate = {
        id: templateId,
        name: 'Modern Portfolio Template',
        sections: [
          {
            id: 'hero',
            type: 'hero',
            title: 'Hero Section',
            content: {
              title: 'Your Name Here',
              subtitle: 'Your Professional Title',
              description: 'Brief description about yourself',
              ctaText: 'Get In Touch'
            },
            styles: {
              backgroundColor: '#1F2937',
              textColor: '#FFFFFF',
              padding: '80px 0',
              textAlign: 'center',
              backgroundImage: '',
              overlay: 0.5
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
              padding: '60px 0',
              layout: 'split'
            }
          }
        ],
        globalStyles: {
          primaryColor: '#3B82F6',
          secondaryColor: '#1F2937',
          fontFamily: 'Inter',
          fontSize: '16px',
          lineHeight: '1.6',
          borderRadius: '8px',
          spacing: '1rem'
        }
      }

      setTemplate(mockTemplate)
      addToHistory(mockTemplate)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching template:', error)
      toast.error('Failed to load template')
      setLoading(false)
    }
  }

  const addToHistory = (newTemplate) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(JSON.parse(JSON.stringify(newTemplate)))
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setTemplate(JSON.parse(JSON.stringify(history[historyIndex - 1])))
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setTemplate(JSON.parse(JSON.stringify(history[historyIndex + 1])))
    }
  }

  const updateTemplate = (updates) => {
    const newTemplate = { ...template, ...updates }
    setTemplate(newTemplate)
    addToHistory(newTemplate)
  }

  const updateSection = (sectionId, updates) => {
    const newTemplate = {
      ...template,
      sections: template.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }
    setTemplate(newTemplate)
    addToHistory(newTemplate)
  }

  const updateGlobalStyles = (updates) => {
    const newTemplate = {
      ...template,
      globalStyles: { ...template.globalStyles, ...updates }
    }
    setTemplate(newTemplate)
    addToHistory(newTemplate)
  }

  const duplicateSection = (sectionId) => {
    const section = template.sections.find(s => s.id === sectionId)
    if (section) {
      const newSection = {
        ...section,
        id: `${section.type}_${Date.now()}`,
        title: `${section.title} (Copy)`
      }
      
      const sectionIndex = template.sections.findIndex(s => s.id === sectionId)
      const newSections = [...template.sections]
      newSections.splice(sectionIndex + 1, 0, newSection)
      
      updateTemplate({ sections: newSections })
      toast.success('Section duplicated')
    }
  }

  const deleteSection = (sectionId) => {
    const newSections = template.sections.filter(s => s.id !== sectionId)
    updateTemplate({ sections: newSections })
    toast.success('Section deleted')
  }

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const saveTemplate = async () => {
    try {
      // API call to save template
      toast.success('Template saved successfully!')
    } catch (error) {
      toast.error('Failed to save template')
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

  if (previewMode) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Preview Mode</h1>
          <button
            onClick={() => setPreviewMode(false)}
            className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
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
      {/* Left Sidebar - Controls */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Customize</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Panel Tabs */}
          <div className="flex flex-wrap gap-1">
            {panels.map((panel) => {
              const Icon = panel.icon
              return (
                <button
                  key={panel.id}
                  onClick={() => setActivePanel(panel.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activePanel === panel.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{panel.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto">
          {activePanel === 'design' && (
            <DesignPanel
              template={template}
              onUpdateGlobalStyles={updateGlobalStyles}
              showColorPicker={showColorPicker}
              setShowColorPicker={setShowColorPicker}
            />
          )}

          {activePanel === 'layout' && (
            <LayoutPanel
              template={template}
              selectedSection={selectedSection}
              onSelectSection={setSelectedSection}
              onUpdateSection={updateSection}
              onDuplicateSection={duplicateSection}
              onDeleteSection={deleteSection}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
            />
          )}

          {activePanel === 'typography' && (
            <TypographyPanel
              template={template}
              onUpdateGlobalStyles={updateGlobalStyles}
            />
          )}

          {activePanel === 'content' && (
            <ContentPanel
              template={template}
              selectedSection={selectedSection}
              onUpdateSection={updateSection}
            />
          )}

          {activePanel === 'settings' && (
            <SettingsPanel
              template={template}
              onUpdateTemplate={updateTemplate}
            />
          )}
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
          
          <button
            onClick={saveTemplate}
            className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {template.sections.map((section) => (
            <motion.div
              key={section.id}
              className={`relative group ${selectedSection === section.id ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => setSelectedSection(section.id)}
              style={{
                backgroundColor: section.styles.backgroundColor,
                color: section.styles.textColor,
                padding: section.styles.padding
              }}
            >
              {/* Section Overlay */}
              <div className="absolute inset-0 bg-primary-500 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 pointer-events-none" />
              
              {/* Section Label */}
              <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                {section.title}
              </div>

              <div className="max-w-3xl mx-auto px-6 relative">
                {renderSectionPreview(section)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
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
      default:
        return <div className="py-16 text-center">Section Preview</div>
    }
  }
}

// Design Panel Component
const DesignPanel = ({ template, onUpdateGlobalStyles, showColorPicker, setShowColorPicker }) => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Colors</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowColorPicker(showColorPicker === 'primary' ? null : 'primary')}
                className="w-10 h-10 rounded-lg border-2 border-gray-300"
                style={{ backgroundColor: template.globalStyles.primaryColor }}
              />
              <span className="text-sm text-gray-600">{template.globalStyles.primaryColor}</span>
            </div>
            {showColorPicker === 'primary' && (
              <div className="mt-2">
                <ChromePicker
                  color={template.globalStyles.primaryColor}
                  onChange={(color) => onUpdateGlobalStyles({ primaryColor: color.hex })}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowColorPicker(showColorPicker === 'secondary' ? null : 'secondary')}
                className="w-10 h-10 rounded-lg border-2 border-gray-300"
                style={{ backgroundColor: template.globalStyles.secondaryColor }}
              />
              <span className="text-sm text-gray-600">{template.globalStyles.secondaryColor}</span>
            </div>
            {showColorPicker === 'secondary' && (
              <div className="mt-2">
                <ChromePicker
                  color={template.globalStyles.secondaryColor}
                  onChange={(color) => onUpdateGlobalStyles({ secondaryColor: color.hex })}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Border Radius</h3>
        <input
          type="range"
          min="0"
          max="20"
          value={parseInt(template.globalStyles.borderRadius)}
          onChange={(e) => onUpdateGlobalStyles({ borderRadius: `${e.target.value}px` })}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>0px</span>
          <span>{template.globalStyles.borderRadius}</span>
          <span>20px</span>
        </div>
      </div>
    </div>
  )
}

// Layout Panel Component
const LayoutPanel = ({ 
  template, 
  selectedSection, 
  onSelectSection, 
  onUpdateSection, 
  onDuplicateSection, 
  onDeleteSection,
  expandedSections,
  onToggleSection 
}) => {
  return (
    <div className="p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Sections</h3>
      <div className="space-y-2">
        {template.sections.map((section) => (
          <div key={section.id} className="border border-gray-200 rounded-lg">
            <div
              className={`flex items-center justify-between p-3 cursor-pointer ${
                selectedSection === section.id ? 'bg-primary-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => onSelectSection(section.id)}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleSection(section.id)
                  }}
                >
                  {expandedSections[section.id] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <span className="font-medium text-sm">{section.title}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicateSection(section.id)
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteSection(section.id)
                  }}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {expandedSections[section.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-200"
                >
                  <div className="p-3 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Background</label>
                      <input
                        type="color"
                        value={section.styles.backgroundColor}
                        onChange={(e) => onUpdateSection(section.id, {
                          styles: { ...section.styles, backgroundColor: e.target.value }
                        })}
                        className="w-full h-8 border border-gray-300 rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Text Color</label>
                      <input
                        type="color"
                        value={section.styles.textColor}
                        onChange={(e) => onUpdateSection(section.id, {
                          styles: { ...section.styles, textColor: e.target.value }
                        })}
                        className="w-full h-8 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

// Typography Panel Component
const TypographyPanel = ({ template, onUpdateGlobalStyles }) => {
  const fonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
    'Poppins', 'Source Sans Pro', 'Nunito', 'Raleway', 'Ubuntu'
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Font Family</h3>
        <select
          value={template.globalStyles.fontFamily}
          onChange={(e) => onUpdateGlobalStyles({ fontFamily: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          {fonts.map((font) => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Font Size</h3>
        <input
          type="range"
          min="12"
          max="24"
          value={parseInt(template.globalStyles.fontSize)}
          onChange={(e) => onUpdateGlobalStyles({ fontSize: `${e.target.value}px` })}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>12px</span>
          <span>{template.globalStyles.fontSize}</span>
          <span>24px</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Line Height</h3>
        <input
          type="range"
          min="1"
          max="2"
          step="0.1"
          value={template.globalStyles.lineHeight}
          onChange={(e) => onUpdateGlobalStyles({ lineHeight: e.target.value })}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>1.0</span>
          <span>{template.globalStyles.lineHeight}</span>
          <span>2.0</span>
        </div>
      </div>
    </div>
  )
}

// Content Panel Component
const ContentPanel = ({ template, selectedSection, onUpdateSection }) => {
  const section = template.sections.find(s => s.id === selectedSection)

  if (!section) {
    return (
      <div className="p-6 text-center text-gray-500">
        Select a section to edit its content
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h3 className="font-semibold text-gray-900 mb-4">Edit Content</h3>
      
      {section.type === 'hero' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={section.content.title}
              onChange={(e) => onUpdateSection(section.id, {
                content: { ...section.content, title: e.target.value }
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <input
              type="text"
              value={section.content.subtitle}
              onChange={(e) => onUpdateSection(section.id, {
                content: { ...section.content, subtitle: e.target.value }
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={section.content.description}
              onChange={(e) => onUpdateSection(section.id, {
                content: { ...section.content, description: e.target.value }
              })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
            <input
              type="text"
              value={section.content.ctaText}
              onChange={(e) => onUpdateSection(section.id, {
                content: { ...section.content, ctaText: e.target.value }
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
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
              onChange={(e) => onUpdateSection(section.id, {
                content: { ...section.content, title: e.target.value }
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={section.content.description}
              onChange={(e) => onUpdateSection(section.id, {
                content: { ...section.content, description: e.target.value }
              })}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills (one per line)</label>
            <textarea
              value={section.content.skills.join('\n')}
              onChange={(e) => onUpdateSection(section.id, {
                content: { 
                  ...section.content, 
                  skills: e.target.value.split('\n').filter(s => s.trim()) 
                }
              })}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Settings Panel Component
const SettingsPanel = ({ template, onUpdateTemplate }) => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Template Info</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
            <input
              type="text"
              value={template.name}
              onChange={(e) => onUpdateTemplate({ name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Export Options</h3>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Export as JSON
          </button>
          <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Export as HTML
          </button>
          <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Export as React Component
          </button>
        </div>
      </div>
    </div>
  )
}

export default TemplateCustomizer
