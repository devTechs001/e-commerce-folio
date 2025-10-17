import React, { useState, useEffect } from 'react'
import { 
  Edit3, 
  Save, 
  Eye, 
  Settings, 
  Palette, 
  Type, 
  Layout, 
  Image, 
  Link2, 
  Globe, 
  Crown, 
  Lock, 
  Plus,
  Trash2,
  Move,
  Copy,
  Zap,
  BarChart3,
  Users,
  Sparkles,
  Briefcase,
  GraduationCap,
  Folder,
  Mail,
  Quote,
  Package,
  FileText,
  Clock
} from 'lucide-react'
import { subscriptionService } from '../../services/subscription'
import { useAuth } from '../../context/AuthContext'

const TierBasedPortfolioEditor = ({ portfolio, onSave }) => {
  const { user } = useAuth()
  const [userTier, setUserTier] = useState('standard')
  const [activeSection, setActiveSection] = useState('hero')
  const [portfolioData, setPortfolioData] = useState(portfolio || {
    title: 'My Portfolio',
    slug: 'my-portfolio',
    sections: [],
    styles: {
      theme: 'modern',
      colors: {
        primary: '#0ea5e9',
        secondary: '#64748b',
        background: '#ffffff',
        text: '#1e293b'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      },
      spacing: 'comfortable'
    },
    settings: {
      isPublished: false,
      customDomain: '',
      seo: {
        title: '',
        description: '',
        keywords: []
      },
      socialSharing: {
        enabled: true,
        image: ''
      }
    }
  })
  const [availableFeatures, setAvailableFeatures] = useState({})

  useEffect(() => {
    loadUserTier()
  }, [])

  const loadUserTier = async () => {
    try {
      const tier = await subscriptionService.getUserTier()
      setUserTier(tier)
      
      // Define available features based on tier
      const features = {
        // Standard tier features
        basicSections: true,
        basicThemes: true,
        basicColors: true,
        basicFonts: true,
        
        // Premium tier features
        advancedSections: tier === 'premium',
        customThemes: tier === 'premium',
        advancedColors: tier === 'premium',
        customFonts: tier === 'premium',
        customDomain: tier === 'premium',
        advancedSEO: tier === 'premium',
        socialSharing: tier === 'premium',
        analytics: tier === 'premium',
        collaboration: tier === 'premium',
        versionHistory: tier === 'premium',
        customCSS: tier === 'premium',
        animations: tier === 'premium',
        multiLanguage: tier === 'premium'
      }
      
      setAvailableFeatures(features)
    } catch (error) {
      console.error('Error loading user tier:', error)
    }
  }

  const sectionTypes = [
    { id: 'hero', name: 'Hero', icon: Sparkles, tier: 'standard', description: 'Main introduction section' },
    { id: 'about', name: 'About', icon: Users, tier: 'standard', description: 'About me section' },
    { id: 'experience', name: 'Experience', icon: Briefcase, tier: 'standard', description: 'Work experience' },
    { id: 'education', name: 'Education', icon: GraduationCap, tier: 'standard', description: 'Educational background' },
    { id: 'projects', name: 'Projects', icon: Folder, tier: 'standard', description: 'Portfolio projects' },
    { id: 'skills', name: 'Skills', icon: Zap, tier: 'standard', description: 'Technical skills' },
    { id: 'contact', name: 'Contact', icon: Mail, tier: 'standard', description: 'Contact information' },
    { id: 'testimonials', name: 'Testimonials', icon: Quote, tier: 'premium', description: 'Client testimonials' },
    { id: 'services', name: 'Services', icon: Package, tier: 'premium', description: 'Services offered' },
    { id: 'blog', name: 'Blog', icon: FileText, tier: 'premium', description: 'Blog posts' },
    { id: 'gallery', name: 'Gallery', icon: Image, tier: 'premium', description: 'Image gallery' },
    { id: 'timeline', name: 'Timeline', icon: Clock, tier: 'premium', description: 'Career timeline' }
  ]

  const themes = [
    { id: 'modern', name: 'Modern', tier: 'standard', preview: '#0ea5e9' },
    { id: 'classic', name: 'Classic', tier: 'standard', preview: '#374151' },
    { id: 'creative', name: 'Creative', tier: 'premium', preview: '#ec4899' },
    { id: 'minimal', name: 'Minimal', tier: 'premium', preview: '#6b7280' },
    { id: 'dark', name: 'Dark', tier: 'premium', preview: '#1f2937' },
    { id: 'gradient', name: 'Gradient', tier: 'premium', preview: 'linear-gradient(45deg, #0ea5e9, #ec4899)' }
  ]

  const canAccessFeature = (feature) => {
    return availableFeatures[feature] || false
  }

  const canAccessSection = (sectionType) => {
    if (sectionType.tier === 'standard') return true
    return userTier === 'premium'
  }

  const handleAddSection = (sectionType) => {
    if (!canAccessSection(sectionType)) {
      alert('This section type requires a Premium subscription. Please upgrade your plan.')
      return
    }

    const newSection = {
      type: sectionType.id,
      data: {},
      order: portfolioData.sections.length,
      isVisible: true
    }

    setPortfolioData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }))
  }

  const handleRemoveSection = (index) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }))
  }

  const handleStyleChange = (category, property, value) => {
    setPortfolioData(prev => ({
      ...prev,
      styles: {
        ...prev.styles,
        [category]: {
          ...prev.styles[category],
          [property]: value
        }
      }
    }))
  }

  const handleSettingsChange = (category, property, value) => {
    if (category === 'customDomain' && !canAccessFeature('customDomain')) {
      alert('Custom domain requires a Premium subscription. Please upgrade your plan.')
      return
    }

    setPortfolioData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [category]: typeof prev.settings[category] === 'object' 
          ? { ...prev.settings[category], [property]: value }
          : value
      }
    }))
  }

  const SectionEditor = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Portfolio Sections</h3>
        <div className="text-sm text-gray-500">
          {portfolioData.sections.length} sections
        </div>
      </div>

      {/* Current Sections */}
      <div className="space-y-3">
        {portfolioData.sections.map((section, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Move className="h-4 w-4 text-gray-400 cursor-move" />
              <span className="font-medium text-gray-900 capitalize">{section.type}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                section.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {section.isVisible ? 'Visible' : 'Hidden'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-gray-600 hover:text-gray-800">
                <Edit3 className="h-4 w-4" />
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                <Copy className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleRemoveSection(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Add New Section</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {sectionTypes.map(sectionType => {
            const accessible = canAccessSection(sectionType)
            const Icon = sectionType.icon
            
            return (
              <button
                key={sectionType.id}
                onClick={() => handleAddSection(sectionType)}
                disabled={!accessible}
                className={`relative p-3 rounded-lg border-2 text-left transition-all ${
                  accessible
                    ? 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                    : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                }`}
              >
                {sectionType.tier === 'premium' && (
                  <Crown className="absolute top-1 right-1 h-3 w-3 text-yellow-500" />
                )}
                <Icon className="h-5 w-5 text-gray-600 mb-2" />
                <div className="text-sm font-medium text-gray-900">{sectionType.name}</div>
                <div className="text-xs text-gray-500">{sectionType.description}</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )

  const StyleEditor = () => (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Theme</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {themes.map(theme => {
            const accessible = theme.tier === 'standard' || canAccessFeature('customThemes')
            
            return (
              <button
                key={theme.id}
                onClick={() => accessible && handleStyleChange('theme', 'theme', theme.id)}
                disabled={!accessible}
                className={`relative p-3 rounded-lg border-2 text-center transition-all ${
                  portfolioData.styles.theme === theme.id
                    ? 'border-primary-500 bg-primary-50'
                    : accessible
                    ? 'border-gray-200 hover:border-gray-300'
                    : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                }`}
              >
                {theme.tier === 'premium' && (
                  <Crown className="absolute top-1 right-1 h-3 w-3 text-yellow-500" />
                )}
                <div 
                  className="w-full h-6 rounded mb-2"
                  style={{ background: theme.preview }}
                />
                <div className="text-sm font-medium text-gray-900">{theme.name}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Color Customization */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          Colors
          {!canAccessFeature('advancedColors') && (
            <Lock className="h-4 w-4 ml-2 text-gray-400" />
          )}
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(portfolioData.styles.colors).map(([colorType, colorValue]) => (
            <div key={colorType}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {colorType}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={colorValue}
                  onChange={(e) => canAccessFeature('advancedColors') && handleStyleChange('colors', colorType, e.target.value)}
                  disabled={!canAccessFeature('advancedColors')}
                  className="w-12 h-8 rounded border border-gray-300 disabled:opacity-50"
                />
                <input
                  type="text"
                  value={colorValue}
                  onChange={(e) => canAccessFeature('advancedColors') && handleStyleChange('colors', colorType, e.target.value)}
                  disabled={!canAccessFeature('advancedColors')}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Font Selection */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          Typography
          {!canAccessFeature('customFonts') && (
            <Lock className="h-4 w-4 ml-2 text-gray-400" />
          )}
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heading Font</label>
            <select
              value={portfolioData.styles.fonts.heading}
              onChange={(e) => canAccessFeature('customFonts') && handleStyleChange('fonts', 'heading', e.target.value)}
              disabled={!canAccessFeature('customFonts')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              {canAccessFeature('customFonts') && (
                <>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Open Sans">Open Sans</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body Font</label>
            <select
              value={portfolioData.styles.fonts.body}
              onChange={(e) => canAccessFeature('customFonts') && handleStyleChange('fonts', 'body', e.target.value)}
              disabled={!canAccessFeature('customFonts')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              {canAccessFeature('customFonts') && (
                <>
                  <option value="Source Sans Pro">Source Sans Pro</option>
                  <option value="Lato">Lato</option>
                  <option value="Nunito">Nunito</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const SettingsEditor = () => (
    <div className="space-y-6">
      {/* Basic Settings */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Basic Settings</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Title</label>
            <input
              type="text"
              value={portfolioData.title}
              onChange={(e) => setPortfolioData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
            <div className="flex items-center">
              <span className="text-gray-500 text-sm">yoursite.com/</span>
              <input
                type="text"
                value={portfolioData.slug}
                onChange={(e) => setPortfolioData(prev => ({ ...prev, slug: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg ml-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Domain */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          Custom Domain
          {!canAccessFeature('customDomain') && (
            <>
              <Crown className="h-4 w-4 ml-2 text-yellow-500" />
              <span className="text-xs text-gray-500 ml-1">Premium</span>
            </>
          )}
        </h4>
        <input
          type="text"
          value={portfolioData.settings.customDomain || ''}
          onChange={(e) => handleSettingsChange('customDomain', null, e.target.value)}
          placeholder="www.yourdomain.com"
          disabled={!canAccessFeature('customDomain')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
        />
      </div>

      {/* SEO Settings */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          SEO Settings
          {!canAccessFeature('advancedSEO') && (
            <>
              <Crown className="h-4 w-4 ml-2 text-yellow-500" />
              <span className="text-xs text-gray-500 ml-1">Premium</span>
            </>
          )}
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input
              type="text"
              value={portfolioData.settings.seo.title || ''}
              onChange={(e) => handleSettingsChange('seo', 'title', e.target.value)}
              disabled={!canAccessFeature('advancedSEO')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea
              value={portfolioData.settings.seo.description || ''}
              onChange={(e) => handleSettingsChange('seo', 'description', e.target.value)}
              disabled={!canAccessFeature('advancedSEO')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Publishing */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Publishing</h4>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={portfolioData.settings.isPublished}
            onChange={(e) => handleSettingsChange('isPublished', null, e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">Publish portfolio</span>
        </label>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Edit3 className="h-6 w-6 mr-3 text-primary-600" />
                Portfolio Editor
              </h1>
              <p className="text-gray-600 mt-1">
                Customize your portfolio with {userTier === 'premium' ? 'premium' : 'standard'} features
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                userTier === 'premium' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {userTier === 'premium' ? '👑 Premium' : '⭐ Standard'}
              </div>
              <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>
              <button 
                onClick={() => onSave && onSave(portfolioData)}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <nav className="space-y-2">
                {[
                  { id: 'sections', name: 'Sections', icon: Layout },
                  { id: 'styles', name: 'Styles', icon: Palette },
                  { id: 'settings', name: 'Settings', icon: Settings }
                ].map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSection(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === tab.id
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {activeSection === 'sections' && <SectionEditor />}
              {activeSection === 'styles' && <StyleEditor />}
              {activeSection === 'settings' && <SettingsEditor />}
            </div>
          </div>
        </div>

        {/* Upgrade CTA for Standard Users */}
        {userTier === 'standard' && (
          <div className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Unlock Premium Portfolio Features</h3>
                <p className="text-purple-100 mb-3">
                  Get access to advanced sections, custom themes, SEO tools, and more
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Crown className="h-4 w-4 mr-1" />
                    Premium sections
                  </div>
                  <div className="flex items-center">
                    <Palette className="h-4 w-4 mr-1" />
                    Custom themes
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    Custom domain
                  </div>
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Advanced SEO
                  </div>
                </div>
              </div>
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Upgrade to Premium
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TierBasedPortfolioEditor
