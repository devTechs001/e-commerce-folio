import React, { useState } from 'react'
import { 
  Link as LinkIcon, Plus, Trash2, ExternalLink, Mail, Phone, 
  MessageCircle, Download, MapPin, Calendar, Save, Eye, Copy
} from 'lucide-react'
import { ChromePicker } from 'react-color'
import Button from '../../common/Button/Button'

const ButtonLinkBuilder = ({ onSave, initialData = null }) => {
  const [links, setLinks] = useState(initialData || [])
  const [editingLink, setEditingLink] = useState(null)
  const [showColorPicker, setShowColorPicker] = useState(null)

  const linkTypes = [
    { id: 'custom', name: 'Custom Link', icon: LinkIcon, prefix: '' },
    { id: 'email', name: 'Email', icon: Mail, prefix: 'mailto:' },
    { id: 'phone', name: 'Phone', icon: Phone, prefix: 'tel:' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, prefix: 'https://wa.me/' },
    { id: 'download', name: 'Download', icon: Download, prefix: '' },
    { id: 'location', name: 'Location', icon: MapPin, prefix: 'https://maps.google.com/?q=' },
    { id: 'calendar', name: 'Calendar', icon: Calendar, prefix: 'https://calendly.com/' }
  ]

  const buttonStyles = [
    { id: 'primary', name: 'Primary', className: 'bg-primary-600 text-white hover:bg-primary-700' },
    { id: 'secondary', name: 'Secondary', className: 'bg-gray-600 text-white hover:bg-gray-700' },
    { id: 'outline', name: 'Outline', className: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50' },
    { id: 'ghost', name: 'Ghost', className: 'text-primary-600 hover:bg-primary-50' },
    { id: 'gradient', name: 'Gradient', className: 'bg-gradient-to-r from-primary-600 to-blue-600 text-white' }
  ]

  const buttonSizes = [
    { id: 'sm', name: 'Small', className: 'px-4 py-2 text-sm' },
    { id: 'md', name: 'Medium', className: 'px-6 py-3 text-base' },
    { id: 'lg', name: 'Large', className: 'px-8 py-4 text-lg' }
  ]

  const defaultLink = {
    id: Date.now(),
    type: 'custom',
    label: 'New Link',
    url: '',
    style: 'primary',
    size: 'md',
    icon: 'link',
    openNewTab: true,
    customColor: null,
    width: 'auto', // auto, full, fit
    rounded: 'md' // sm, md, lg, full
  }

  const addLink = () => {
    const newLink = { ...defaultLink, id: Date.now() }
    setLinks([...links, newLink])
    setEditingLink(newLink.id)
  }

  const updateLink = (id, updates) => {
    setLinks(links.map(link => link.id === id ? { ...link, ...updates } : link))
  }

  const deleteLink = (id) => {
    setLinks(links.filter(link => link.id !== id))
    if (editingLink === id) setEditingLink(null)
  }

  const duplicateLink = (link) => {
    const newLink = { ...link, id: Date.now(), label: `${link.label} (Copy)` }
    setLinks([...links, newLink])
  }

  const moveLink = (id, direction) => {
    const index = links.findIndex(link => link.id === id)
    if (direction === 'up' && index > 0) {
      const newLinks = [...links]
      ;[newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]]
      setLinks(newLinks)
    } else if (direction === 'down' && index < links.length - 1) {
      const newLinks = [...links]
      ;[newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]]
      setLinks(newLinks)
    }
  }

  const handleSave = () => {
    if (onSave) {
      onSave(links)
    }
  }

  const getIcon = (iconName) => {
    const icons = {
      link: LinkIcon,
      mail: Mail,
      phone: Phone,
      message: MessageCircle,
      download: Download,
      location: MapPin,
      calendar: Calendar,
      external: ExternalLink
    }
    return icons[iconName] || LinkIcon
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Buttons & Links</h2>
          <p className="text-gray-600">Create custom buttons and links for your portfolio</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={addLink} icon={Plus}>
            Add Link
          </Button>
          <Button onClick={handleSave} icon={Save}>
            Save All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Links List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Links</h3>
          
          {links.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No links yet</p>
              <Button onClick={addLink} icon={Plus} size="sm">
                Add Your First Link
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((link, index) => {
                const Icon = getIcon(link.icon)
                const typeInfo = linkTypes.find(t => t.id === link.type)
                
                return (
                  <div
                    key={link.id}
                    className={`bg-white rounded-xl p-4 border-2 transition-all ${
                      editingLink === link.id 
                        ? 'border-primary-500 shadow-lg' 
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <Icon className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{link.label}</h4>
                          <p className="text-xs text-gray-500">{typeInfo?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setEditingLink(editingLink === link.id ? null : link.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => duplicateLink(link)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Copy className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => deleteLink(link.id)}
                          className="p-2 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Preview Button */}
                    <a
                      href={link.url || '#'}
                      target={link.openNewTab ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className={`
                        inline-flex items-center justify-center space-x-2 font-medium transition-all
                        ${buttonStyles.find(s => s.id === link.style)?.className}
                        ${buttonSizes.find(s => s.id === link.size)?.className}
                        ${link.width === 'full' ? 'w-full' : link.width === 'fit' ? 'w-fit' : ''}
                        ${link.rounded === 'sm' ? 'rounded' : 
                          link.rounded === 'md' ? 'rounded-lg' : 
                          link.rounded === 'lg' ? 'rounded-xl' : 'rounded-full'}
                      `}
                      style={link.customColor ? { backgroundColor: link.customColor, borderColor: link.customColor } : {}}
                      onClick={(e) => e.preventDefault()}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.label}</span>
                      {link.openNewTab && <ExternalLink className="h-3 w-3" />}
                    </a>

                    {/* Move Buttons */}
                    <div className="flex justify-center space-x-2 mt-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => moveLink(link.id, 'up')}
                        disabled={index === 0}
                        className="text-xs text-gray-600 hover:text-primary-600 disabled:opacity-50"
                      >
                        ↑ Move Up
                      </button>
                      <button
                        onClick={() => moveLink(link.id, 'down')}
                        disabled={index === links.length - 1}
                        className="text-xs text-gray-600 hover:text-primary-600 disabled:opacity-50"
                      >
                        ↓ Move Down
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Editor */}
        {editingLink && (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Link</h3>
            
            {(() => {
              const link = links.find(l => l.id === editingLink)
              if (!link) return null

              return (
                <div className="space-y-4">
                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link Type
                    </label>
                    <select
                      value={link.type}
                      onChange={(e) => {
                        const type = linkTypes.find(t => t.id === e.target.value)
                        updateLink(link.id, { 
                          type: e.target.value,
                          icon: type?.icon.name.toLowerCase() || 'link'
                        })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      {linkTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Label */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateLink(link.id, { label: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL / Link
                    </label>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateLink(link.id, { url: e.target.value })}
                      placeholder={linkTypes.find(t => t.id === link.type)?.prefix || 'https://'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Style */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {buttonStyles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => updateLink(link.id, { style: style.id })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            link.style === style.id
                              ? 'ring-2 ring-primary-500 ring-offset-2'
                              : ''
                          } ${style.className}`}
                        >
                          {style.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Color (Optional)
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowColorPicker(showColorPicker === link.id ? null : link.id)}
                        className="w-full h-12 rounded-lg border-2 border-gray-300"
                        style={{ backgroundColor: link.customColor || '#6366f1' }}
                      />
                      {showColorPicker === link.id && (
                        <div className="absolute z-10 mt-2">
                          <div
                            className="fixed inset-0"
                            onClick={() => setShowColorPicker(null)}
                          />
                          <ChromePicker
                            color={link.customColor || '#6366f1'}
                            onChange={(color) => updateLink(link.id, { customColor: color.hex })}
                          />
                        </div>
                      )}
                    </div>
                    {link.customColor && (
                      <button
                        onClick={() => updateLink(link.id, { customColor: null })}
                        className="text-xs text-red-600 hover:text-red-700 mt-1"
                      >
                        Remove custom color
                      </button>
                    )}
                  </div>

                  {/* Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {buttonSizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => updateLink(link.id, { size: size.id })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            link.size === size.id
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {size.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Width
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['auto', 'full', 'fit'].map((width) => (
                        <button
                          key={width}
                          onClick={() => updateLink(link.id, { width })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            link.width === width
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {width === 'auto' ? 'Auto' : width === 'full' ? 'Full' : 'Fit Content'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rounded */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Corner Radius
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['sm', 'md', 'lg', 'full'].map((rounded) => (
                        <button
                          key={rounded}
                          onClick={() => updateLink(link.id, { rounded })}
                          className={`px-4 py-2 text-sm font-medium transition-all ${
                            link.rounded === rounded
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          } ${
                            rounded === 'sm' ? 'rounded' :
                            rounded === 'md' ? 'rounded-lg' :
                            rounded === 'lg' ? 'rounded-xl' : 'rounded-full'
                          }`}
                        >
                          {rounded === 'sm' ? 'Small' : 
                           rounded === 'md' ? 'Medium' : 
                           rounded === 'lg' ? 'Large' : 'Pill'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Options */}
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={link.openNewTab}
                        onChange={(e) => updateLink(link.id, { openNewTab: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Open in new tab</span>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => setEditingLink(null)}
                      variant="outline"
                      className="flex-1"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => deleteLink(link.id)}
                      variant="outline"
                      className="flex-1"
                      icon={Trash2}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}

export default ButtonLinkBuilder
