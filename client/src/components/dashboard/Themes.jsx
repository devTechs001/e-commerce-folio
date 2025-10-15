import React, { useState } from 'react'
import { Palette, Sun, Moon, Monitor, Check, Sparkles } from 'lucide-react'

const Themes = () => {
  const [activeTheme, setActiveTheme] = useState('system')
  const [accentColor, setAccentColor] = useState('blue')

  const themes = [
    {
      id: 'light',
      name: 'Light',
      icon: Sun,
      description: 'Clean and bright interface',
      preview: 'bg-white border-gray-200'
    },
    {
      id: 'dark',
      name: 'Dark',
      icon: Moon,
      description: 'Easy on the eyes',
      preview: 'bg-gray-900 border-gray-700'
    },
    {
      id: 'system',
      name: 'System',
      icon: Monitor,
      description: 'Follows system preferences',
      preview: 'bg-gradient-to-r from-white to-gray-900'
    }
  ]

  const accentColors = [
    { id: 'blue', name: 'Blue', color: 'bg-blue-600', hex: '#2563EB' },
    { id: 'purple', name: 'Purple', color: 'bg-purple-600', hex: '#9333EA' },
    { id: 'green', name: 'Green', color: 'bg-green-600', hex: '#16A34A' },
    { id: 'orange', name: 'Orange', color: 'bg-orange-600', hex: '#EA580C' },
    { id: 'pink', name: 'Pink', color: 'bg-pink-600', hex: '#DB2777' },
    { id: 'indigo', name: 'Indigo', color: 'bg-indigo-600', hex: '#4F46E5' }
  ]

  const handleThemeChange = (themeId) => {
    setActiveTheme(themeId)
    console.log('Theme changed to:', themeId)
  }

  const handleAccentChange = (colorId) => {
    setAccentColor(colorId)
    console.log('Accent color changed to:', colorId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Theme Settings</h1>
        <p className="mt-2 text-gray-600">Customize the appearance of your dashboard</p>
      </div>

      {/* Theme Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Palette className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Choose Theme</h2>
            <p className="text-sm text-gray-500">Select your preferred theme mode</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((theme) => {
            const Icon = theme.icon
            const isActive = activeTheme === theme.id
            
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`relative p-6 rounded-lg border-2 transition-all ${
                  isActive
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {isActive && (
                  <div className="absolute top-3 right-3">
                    <Check className="h-5 w-5 text-primary-600" />
                  </div>
                )}
                
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-lg ${theme.preview} flex items-center justify-center mb-4 border-2 border-gray-300`}>
                    <Icon className={`h-8 w-8 ${isActive ? 'text-primary-600' : 'text-gray-600'}`} />
                  </div>
                  <h3 className={`font-semibold ${isActive ? 'text-primary-600' : 'text-gray-900'}`}>
                    {theme.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{theme.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Accent Color Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Sparkles className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Accent Color</h2>
            <p className="text-sm text-gray-500">Choose your primary accent color</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {accentColors.map((color) => {
            const isActive = accentColor === color.id
            
            return (
              <button
                key={color.id}
                onClick={() => handleAccentChange(color.id)}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  isActive
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {isActive && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4 text-gray-900" />
                  </div>
                )}
                
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full ${color.color} mb-2`}></div>
                  <p className="text-sm font-medium text-gray-900">{color.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{color.hex}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Additional Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Compact Mode</h3>
              <p className="text-sm text-gray-500">Reduce spacing for more content</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Animations</h3>
              <p className="text-sm text-gray-500">Enable smooth transitions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">High Contrast</h3>
              <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          Reset to Default
        </button>
        <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default Themes