import React, { useState } from 'react'
import { 
  Mail, MessageCircle, User, Phone, Building, Calendar,
  Plus, Trash2, Eye, Save, Settings, CheckCircle, AlertCircle
} from 'lucide-react'
import Button from '../../common/Button/Button'

const ContactFormBuilder = ({ onSave, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
    title: 'Get In Touch',
    subtitle: 'Send me a message and I\'ll get back to you as soon as possible',
    fields: [],
    submitButton: {
      text: 'Send Message',
      style: 'primary',
      size: 'lg'
    },
    settings: {
      emailNotifications: true,
      emailTo: '',
      successMessage: 'Thank you! Your message has been sent.',
      errorMessage: 'Oops! Something went wrong. Please try again.',
      redirectUrl: '',
      requireRecaptcha: false
    },
    styling: {
      layout: 'stacked', // stacked, grid
      labelPosition: 'top', // top, left, floating
      inputStyle: 'default', // default, rounded, minimal
      spacing: 'comfortable' // compact, comfortable, spacious
    }
  })

  const [preview, setPreview] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const fieldTypes = [
    { id: 'text', name: 'Text Input', icon: User, placeholder: 'Enter text...' },
    { id: 'email', name: 'Email', icon: Mail, placeholder: 'your@email.com' },
    { id: 'phone', name: 'Phone', icon: Phone, placeholder: '+1 (555) 000-0000' },
    { id: 'textarea', name: 'Text Area', icon: MessageCircle, placeholder: 'Your message...' },
    { id: 'select', name: 'Dropdown', icon: Settings, placeholder: 'Select an option' },
    { id: 'checkbox', name: 'Checkbox', icon: CheckCircle, placeholder: '' },
    { id: 'date', name: 'Date Picker', icon: Calendar, placeholder: 'Select date' }
  ]

  const addField = (type) => {
    const newField = {
      id: Date.now(),
      type: type,
      label: `New ${type} Field`,
      placeholder: fieldTypes.find(f => f.id === type)?.placeholder || '',
      required: false,
      width: 'full', // full, half
      validation: type === 'email' ? 'email' : 'none',
      options: type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : []
    }
    setFormData({
      ...formData,
      fields: [...formData.fields, newField]
    })
  }

  const updateField = (id, updates) => {
    setFormData({
      ...formData,
      fields: formData.fields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    })
  }

  const deleteField = (id) => {
    setFormData({
      ...formData,
      fields: formData.fields.filter(field => field.id !== id)
    })
  }

  const moveField = (id, direction) => {
    const index = formData.fields.findIndex(field => field.id === id)
    if (direction === 'up' && index > 0) {
      const newFields = [...formData.fields]
      ;[newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]]
      setFormData({ ...formData, fields: newFields })
    } else if (direction === 'down' && index < formData.fields.length - 1) {
      const newFields = [...formData.fields]
      ;[newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]]
      setFormData({ ...formData, fields: newFields })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormSubmitted(true)
    setTimeout(() => setFormSubmitted(false), 3000)
  }

  const handleSave = () => {
    if (onSave) {
      onSave(formData)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Form Builder</h2>
          <p className="text-gray-600">Design a custom contact form for your portfolio</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setPreview(!preview)}
            icon={Eye}
            variant="outline"
          >
            {preview ? 'Edit' : 'Preview'}
          </Button>
          <Button onClick={handleSave} icon={Save}>
            Save Form
          </Button>
        </div>
      </div>

      {preview ? (
        /* Preview Mode */
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{formData.title}</h2>
              <p className="text-gray-600">{formData.subtitle}</p>
            </div>

            {/* Success Message */}
            {formSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Success!</h4>
                  <p className="text-sm text-green-700">{formData.settings.successMessage}</p>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className={`grid gap-6 ${
                formData.styling.layout === 'grid' ? 'grid-cols-2' : 'grid-cols-1'
              }`}>
                {formData.fields.map((field) => {
                  const Icon = fieldTypes.find(f => f.id === field.type)?.icon || User

                  return (
                    <div
                      key={field.id}
                      className={field.width === 'full' && formData.styling.layout === 'grid' ? 'col-span-2' : ''}
                    >
                      {field.type !== 'checkbox' && (
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                      )}

                      {field.type === 'textarea' ? (
                        <textarea
                          placeholder={field.placeholder}
                          required={field.required}
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      ) : field.type === 'select' ? (
                        <select
                          required={field.required}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">{field.placeholder}</option>
                          {field.options.map((option, idx) => (
                            <option key={idx} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : field.type === 'checkbox' ? (
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            required={field.required}
                            className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </span>
                        </label>
                      ) : (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            required={field.required}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-4 px-6 rounded-lg font-medium transition-all ${
                  formData.submitButton.style === 'primary'
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : formData.submitButton.style === 'outline'
                    ? 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                } ${
                  formData.submitButton.size === 'sm' ? 'text-sm py-2' :
                  formData.submitButton.size === 'md' ? 'text-base py-3' : 'text-lg py-4'
                }`}
              >
                {formData.submitButton.text}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Editor Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Add Fields */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Fields</h3>
              <div className="space-y-2">
                {fieldTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => addField(type.id)}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all"
                    >
                      <Icon className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{type.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Form Settings */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Recipient
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.settings.emailTo}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, emailTo: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.settings.emailNotifications}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, emailNotifications: e.target.checked }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Email notifications</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.settings.requireRecaptcha}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, requireRecaptcha: e.target.checked }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Require reCAPTCHA</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Form Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Form Header Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Header</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Form Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Fields</h3>
              
              {formData.fields.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No fields yet. Add fields from the sidebar.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.fields.map((field, index) => {
                    const Icon = fieldTypes.find(f => f.id === field.type)?.icon || User

                    return (
                      <div
                        key={field.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Icon className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <input
                                type="text"
                                value={field.label}
                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                                className="font-medium text-gray-900 border-0 border-b border-transparent hover:border-gray-300 focus:border-primary-500 focus:ring-0 px-0"
                              />
                              <p className="text-xs text-gray-500">
                                {fieldTypes.find(f => f.id === field.type)?.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => moveField(field.id, 'up')}
                              disabled={index === 0}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveField(field.id, 'down')}
                              disabled={index === formData.fields.length - 1}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => deleteField(field.id)}
                              className="p-2 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Placeholder</label>
                            <input
                              type="text"
                              value={field.placeholder}
                              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Width</label>
                            <select
                              value={field.width}
                              onChange={(e) => updateField(field.id, { width: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="full">Full Width</option>
                              <option value="half">Half Width</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                              className="rounded"
                            />
                            <span className="text-sm text-gray-700">Required field</span>
                          </label>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Submit Button Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Button</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.submitButton.text}
                    onChange={(e) => setFormData({
                      ...formData,
                      submitButton: { ...formData.submitButton, text: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Style
                  </label>
                  <select
                    value={formData.submitButton.style}
                    onChange={(e) => setFormData({
                      ...formData,
                      submitButton: { ...formData.submitButton, style: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="outline">Outline</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactFormBuilder
