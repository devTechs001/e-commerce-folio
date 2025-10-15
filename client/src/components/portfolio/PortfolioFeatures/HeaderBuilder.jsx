import React, { useState } from 'react'
import { 
  Type, Image, Palette, Layout, AlignLeft, AlignCenter, 
  AlignRight, Eye, Code, Save, Crown
} from 'lucide-react'
import { ChromePicker } from 'react-color'
import Button from '../../common/Button/Button'

const HeaderBuilder = ({ onSave, initialData = null }) => {
  const [headerData, setHeaderData] = useState(initialData || {
    style: 'modern', // modern, minimal, bold, elegant
    layout: 'center', // center, left, split
    backgroundType: 'gradient', // solid, gradient, image
    backgroundColor: '#6366f1',
    gradientStart: '#6366f1',
    gradientEnd: '#3b82f6',
    backgroundImage: '',
    textColor: '#ffffff',
    title: 'Your Name',
    subtitle: 'Professional Title',
    tagline: 'Brief description about yourself',
    showAvatar: true,
    avatarUrl: '',
    showCTA: true,
    ctaText: 'Get In Touch',
    ctaLink: '#contact',
    ctaStyle: 'primary', // primary, outline, ghost
    height: 'large', // small, medium, large, full
    animation: 'fade', // fade, slide, zoom, none
    overlay: true,
    overlayOpacity: 40
  })

  const [showColorPicker, setShowColorPicker] = useState(null)
  const [preview, setPreview] = useState(false)

  const headerStyles = [
    { id: 'modern', name: 'Modern', icon: '🎨', description: 'Clean and contemporary' },
    { id: 'minimal', name: 'Minimal', icon: '✨', description: 'Simple and elegant' },
    { id: 'bold', name: 'Bold', icon: '💪', description: 'Strong and impactful' },
    { id: 'elegant', name: 'Elegant', icon: '👔', description: 'Professional and refined' }
  ]

  const layouts = [
    { id: 'center', name: 'Centered', icon: AlignCenter },
    { id: 'left', name: 'Left Aligned', icon: AlignLeft },
    { id: 'split', name: 'Split Screen', icon: Layout }
  ]

  const heights = [
    { id: 'small', name: 'Small', value: '300px' },
    { id: 'medium', name: 'Medium', value: '500px' },
    { id: 'large', name: 'Large', value: '700px' },
    { id: 'full', name: 'Full Screen', value: '100vh' }
  ]

  const handleSave = () => {
    if (onSave) {
      onSave(headerData)
    }
  }

  const getBackgroundStyle = () => {
    if (headerData.backgroundType === 'gradient') {
      return {
        background: `linear-gradient(135deg, ${headerData.gradientStart} 0%, ${headerData.gradientEnd} 100%)`
      }
    } else if (headerData.backgroundType === 'image' && headerData.backgroundImage) {
      return {
        backgroundImage: `url(${headerData.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    }
    return {
      backgroundColor: headerData.backgroundColor
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Header Builder</h2>
          <p className="text-gray-600">Create a stunning header for your portfolio</p>
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
            Save Header
          </Button>
        </div>
      </div>

      {preview ? (
        /* Preview */
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <div
            style={{
              ...getBackgroundStyle(),
              height: heights.find(h => h.id === headerData.height)?.value,
              color: headerData.textColor,
              position: 'relative'
            }}
            className={`flex items-center justify-${headerData.layout === 'center' ? 'center' : 'start'} px-8`}
          >
            {/* Overlay */}
            {headerData.overlay && headerData.backgroundType === 'image' && (
              <div 
                className="absolute inset-0 bg-black"
                style={{ opacity: headerData.overlayOpacity / 100 }}
              />
            )}

            {/* Content */}
            <div className={`relative z-10 ${headerData.layout === 'center' ? 'text-center' : 'text-left'} max-w-4xl`}>
              {headerData.showAvatar && headerData.avatarUrl && (
                <img
                  src={headerData.avatarUrl}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl mb-6 mx-auto"
                />
              )}
              
              <h1 className={`font-bold mb-4 ${
                headerData.style === 'bold' ? 'text-6xl' :
                headerData.style === 'elegant' ? 'text-5xl font-serif' :
                'text-5xl'
              }`}>
                {headerData.title}
              </h1>
              
              <h2 className="text-2xl mb-4 opacity-90">
                {headerData.subtitle}
              </h2>
              
              <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
                {headerData.tagline}
              </p>

              {headerData.showCTA && (
                <a
                  href={headerData.ctaLink}
                  className={`inline-block px-8 py-3 rounded-lg font-medium transition-all ${
                    headerData.ctaStyle === 'primary' ? 'bg-white text-gray-900 hover:bg-gray-100' :
                    headerData.ctaStyle === 'outline' ? 'border-2 border-white hover:bg-white hover:text-gray-900' :
                    'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  {headerData.ctaText}
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Editor */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Style Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Header Style</h3>
              <div className="grid grid-cols-2 gap-3">
                {headerStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setHeaderData({ ...headerData, style: style.id })}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      headerData.style === style.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{style.icon}</div>
                    <div className="font-medium text-gray-900">{style.name}</div>
                    <div className="text-xs text-gray-600">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Layout */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Layout</h3>
              <div className="grid grid-cols-3 gap-3">
                {layouts.map((layout) => {
                  const Icon = layout.icon
                  return (
                    <button
                      key={layout.id}
                      onClick={() => setHeaderData({ ...headerData, layout: layout.id })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        headerData.layout === layout.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <Icon className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-xs font-medium">{layout.name}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Height */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Height</h3>
              <select
                value={headerData.height}
                onChange={(e) => setHeaderData({ ...headerData, height: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {heights.map((height) => (
                  <option key={height.id} value={height.id}>
                    {height.name} ({height.value})
                  </option>
                ))}
              </select>
            </div>

            {/* Background */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Background</h3>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setHeaderData({ ...headerData, backgroundType: 'solid' })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                      headerData.backgroundType === 'solid'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Solid
                  </button>
                  <button
                    onClick={() => setHeaderData({ ...headerData, backgroundType: 'gradient' })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                      headerData.backgroundType === 'gradient'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Gradient
                  </button>
                  <button
                    onClick={() => setHeaderData({ ...headerData, backgroundType: 'image' })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                      headerData.backgroundType === 'image'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Image
                  </button>
                </div>

                {headerData.backgroundType === 'solid' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowColorPicker('bg')}
                        className="w-full h-12 rounded-lg border-2 border-gray-300"
                        style={{ backgroundColor: headerData.backgroundColor }}
                      />
                      {showColorPicker === 'bg' && (
                        <div className="absolute z-10 mt-2">
                          <div
                            className="fixed inset-0"
                            onClick={() => setShowColorPicker(null)}
                          />
                          <ChromePicker
                            color={headerData.backgroundColor}
                            onChange={(color) => setHeaderData({ ...headerData, backgroundColor: color.hex })}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {headerData.backgroundType === 'gradient' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Color
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setShowColorPicker('gradientStart')}
                          className="w-full h-12 rounded-lg border-2 border-gray-300"
                          style={{ backgroundColor: headerData.gradientStart }}
                        />
                        {showColorPicker === 'gradientStart' && (
                          <div className="absolute z-10 mt-2">
                            <div
                              className="fixed inset-0"
                              onClick={() => setShowColorPicker(null)}
                            />
                            <ChromePicker
                              color={headerData.gradientStart}
                              onChange={(color) => setHeaderData({ ...headerData, gradientStart: color.hex })}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Color
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setShowColorPicker('gradientEnd')}
                          className="w-full h-12 rounded-lg border-2 border-gray-300"
                          style={{ backgroundColor: headerData.gradientEnd }}
                        />
                        {showColorPicker === 'gradientEnd' && (
                          <div className="absolute z-10 mt-2">
                            <div
                              className="fixed inset-0"
                              onClick={() => setShowColorPicker(null)}
                            />
                            <ChromePicker
                              color={headerData.gradientEnd}
                              onChange={(color) => setHeaderData({ ...headerData, gradientEnd: color.hex })}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {headerData.backgroundType === 'image' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={headerData.backgroundImage}
                      onChange={(e) => setHeaderData({ ...headerData, backgroundImage: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <div className="mt-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={headerData.overlay}
                          onChange={(e) => setHeaderData({ ...headerData, overlay: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700">Add dark overlay</span>
                      </label>
                      {headerData.overlay && (
                        <div className="mt-2">
                          <label className="block text-xs text-gray-600 mb-1">
                            Overlay Opacity: {headerData.overlayOpacity}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={headerData.overlayOpacity}
                            onChange={(e) => setHeaderData({ ...headerData, overlayOpacity: parseInt(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Content */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={headerData.title}
                    onChange={(e) => setHeaderData({ ...headerData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={headerData.subtitle}
                    onChange={(e) => setHeaderData({ ...headerData, subtitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline
                  </label>
                  <textarea
                    value={headerData.tagline}
                    onChange={(e) => setHeaderData({ ...headerData, tagline: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowColorPicker('text')}
                      className="w-full h-12 rounded-lg border-2 border-gray-300"
                      style={{ backgroundColor: headerData.textColor }}
                    />
                    {showColorPicker === 'text' && (
                      <div className="absolute z-10 mt-2">
                        <div
                          className="fixed inset-0"
                          onClick={() => setShowColorPicker(null)}
                        />
                        <ChromePicker
                          color={headerData.textColor}
                          onChange={(color) => setHeaderData({ ...headerData, textColor: color.hex })}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Avatar */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Avatar</h3>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={headerData.showAvatar}
                    onChange={(e) => setHeaderData({ ...headerData, showAvatar: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Show Avatar</span>
                </label>

                {headerData.showAvatar && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      value={headerData.avatarUrl}
                      onChange={(e) => setHeaderData({ ...headerData, avatarUrl: e.target.value })}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Call to Action</h3>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={headerData.showCTA}
                    onChange={(e) => setHeaderData({ ...headerData, showCTA: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Show CTA Button</span>
                </label>

                {headerData.showCTA && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={headerData.ctaText}
                        onChange={(e) => setHeaderData({ ...headerData, ctaText: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link
                      </label>
                      <input
                        type="text"
                        value={headerData.ctaLink}
                        onChange={(e) => setHeaderData({ ...headerData, ctaLink: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Style
                      </label>
                      <select
                        value={headerData.ctaStyle}
                        onChange={(e) => setHeaderData({ ...headerData, ctaStyle: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="primary">Primary (Filled)</option>
                        <option value="outline">Outline</option>
                        <option value="ghost">Ghost</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HeaderBuilder
