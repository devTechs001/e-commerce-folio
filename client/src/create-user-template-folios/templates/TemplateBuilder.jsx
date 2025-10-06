import React, { useState, useEffect } from 'react'
import { Save, Eye, Download, Layout, Palette, Settings } from 'lucide-react'
import Button from '../../../components/common/Button/Button'
import { templateService } from '../../../services/template'
import { portfolioService } from '../../../services/portfolio'

const TemplateBuilder = () => {
  const [template, setTemplate] = useState({
    name: '',
    description: '',
    category: 'portfolio',
    isPremium: false,
    price: 0,
    sections: [],
    styles: {},
    previewImage: ''
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // Available sections for templates
  const availableSections = [
    { id: 'hero', name: 'Hero Section', required: true },
    { id: 'about', name: 'About Section', required: true },
    { id: 'skills', name: 'Skills Section', required: false },
    { id: 'projects', name: 'Projects Section', required: false },
    { id: 'experience', name: 'Experience Section', required: false },
    { id: 'education', name: 'Education Section', required: false },
    { id: 'contact', name: 'Contact Section', required: false }
  ]

  const handleAddSection = (sectionId) => {
    const section = availableSections.find(s => s.id === sectionId)
    if (section && !template.sections.find(s => s.id === sectionId)) {
      setTemplate(prev => ({
        ...prev,
        sections: [...prev.sections, { id: sectionId, ...section }]
      }))
    }
  }

  const handleRemoveSection = (sectionId) => {
    const section = template.sections.find(s => s.id === sectionId)
    if (section && !section.required) {
      setTemplate(prev => ({
        ...prev,
        sections: prev.sections.filter(s => s.id !== sectionId)
      }))
    }
  }

  const handleStyleChange = (property, value) => {
    setTemplate(prev => ({
      ...prev,
      styles: {
        ...prev.styles,
        [property]: value
      }
    }))
  }

  const handleSaveTemplate = async () => {
    if (!template.name || !template.description) {
      alert('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const response = await templateService.createTemplate(template)
      if (response.success) {
        // Redirect to template gallery or show success message
        console.log('Template saved successfully:', response.data)
      }
    } catch (error) {
      console.error('Error saving template:', error)
    } finally {
      setSaving(false)
    }
  }

  const handlePublishTemplate = async () => {
    if (!template.name || !template.description) {
      alert('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const response = await templateService.publishTemplate(template)
      if (response.success) {
        console.log('Template published successfully:', response.data)
      }
    } catch (error) {
      console.error('Error publishing template:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Builder Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Template Builder</h2>
          <p className="text-gray-600">Create and customize your portfolio template</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon={Eye}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? 'Edit Mode' : 'Preview'}
          </Button>
          <Button
            variant="outline"
            icon={Download}
          >
            Export
          </Button>
          <Button
            variant="primary"
            icon={Save}
            loading={saving}
            onClick={handleSaveTemplate}
          >
            Save Template
          </Button>
        </div>
      </div>

      <div className="flex h-[600px]">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Template Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={template.name}
                    onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="My Awesome Template"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={template.description}
                    onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe your template..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={template.category}
                      onChange={(e) => setTemplate(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="portfolio">Portfolio</option>
                      <option value="business">Business</option>
                      <option value="creative">Creative</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={template.price}
                      onChange={(e) => setTemplate(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      disabled={!template.isPremium}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is-premium"
                    checked={template.isPremium}
                    onChange={(e) => setTemplate(prev => ({ ...prev, isPremium: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is-premium" className="ml-2 block text-sm text-gray-900">
                    Premium Template
                  </label>
                </div>
              </div>
            </div>

            {/* Available Sections */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sections</h3>
              <div className="space-y-2">
                {availableSections.map((section) => (
                  <div
                    key={section.id}
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      template.sections.find(s => s.id === section.id)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-900">{section.name}</span>
                    {template.sections.find(s => s.id === section.id) ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSection(section.id)}
                        disabled={section.required}
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddSection(section.id)}
                      >
                        Add
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Builder Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {previewMode ? (
            <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <Layout className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Template Preview</h3>
                <p className="text-gray-600">Preview of your template will appear here</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Style Customization */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Style Customization</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      value={template.styles.primaryColor || '#3b82f6'}
                      onChange={(e) => handleStyleChange('primaryColor', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Family
                    </label>
                    <select
                      value={template.styles.fontFamily || 'inter'}
                      onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="inter">Inter</option>
                      <option value="roboto">Roboto</option>
                      <option value="poppins">Poppins</option>
                      <option value="montserrat">Montserrat</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sections Preview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Structure</h3>
                <div className="space-y-4">
                  {template.sections.map((section) => (
                    <div
                      key={section.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{section.name}</h4>
                        <span className="text-sm text-gray-500">
                          {section.required ? 'Required' : 'Optional'}
                        </span>
                      </div>
                    </div>
                  ))}

                  {template.sections.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <Layout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No sections added yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Add sections from the sidebar to build your template
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TemplateBuilder