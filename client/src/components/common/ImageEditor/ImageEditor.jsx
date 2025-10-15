import React, { useState, useRef, useEffect } from 'react'
import { 
  Upload, Download, RotateCw, Crop, Zap, Sun, Contrast,
  Droplet, Grid, Maximize2, Crown, X, Check, RefreshCw
} from 'lucide-react'
import { subscriptionService } from '../../../services/subscription'
import { uploadService } from '../../../services/upload'
import Button from '../Button/Button'

const ImageEditor = ({ 
  onSave, 
  onClose,
  initialImage = null,
  requiresPremium = true 
}) => {
  const [image, setImage] = useState(initialImage)
  const [editedImage, setEditedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userTier, setUserTier] = useState('free')
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    rotate: 0
  })
  
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)

  // Check user subscription tier
  useEffect(() => {
    const checkTier = async () => {
      const tier = await subscriptionService.getUserTier()
      setUserTier(tier)
    }
    checkTier()
  }, [])

  // Premium check
  const isPremiumUser = userTier === 'premium' || userTier === 'professional' || userTier === 'enterprise'
  const canUse = !requiresPremium || isPremiumUser

  useEffect(() => {
    if (image) {
      applyFilters()
    }
  }, [filters, image])

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const applyFilters = () => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Set canvas size to image size
      canvas.width = img.width
      canvas.height = img.height

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Apply rotation
      if (filters.rotate !== 0) {
        ctx.save()
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate((filters.rotate * Math.PI) / 180)
        ctx.translate(-canvas.width / 2, -canvas.height / 2)
      }

      // Apply filters
      ctx.filter = `
        brightness(${filters.brightness}%)
        contrast(${filters.contrast}%)
        saturate(${filters.saturate}%)
        blur(${filters.blur}px)
        grayscale(${filters.grayscale}%)
        sepia(${filters.sepia}%)
      `

      ctx.drawImage(img, 0, 0)
      
      if (filters.rotate !== 0) {
        ctx.restore()
      }

      // Get edited image data
      setEditedImage(canvas.toDataURL('image/png'))
    }

    img.src = image
  }

  const handleUpload = async () => {
    if (!editedImage && !image) return

    setLoading(true)
    try {
      // Convert data URL to blob
      const response = await fetch(editedImage || image)
      const blob = await response.blob()
      const file = new File([blob], 'edited-image.png', { type: 'image/png' })

      // Upload to Cloudinary
      const result = await uploadService.uploadImage(file)
      
      if (result.success) {
        if (onSave) {
          onSave(result.url)
        }
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload image')
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = () => {
    if (!editedImage && !image) return

    const link = document.createElement('a')
    link.download = 'edited-image.png'
    link.href = editedImage || image
    link.click()
  }

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturate: 100,
      blur: 0,
      grayscale: 0,
      sepia: 0,
      rotate: 0
    })
  }

  const rotateImage = () => {
    setFilters(prev => ({
      ...prev,
      rotate: (prev.rotate + 90) % 360
    }))
  }

  if (!canUse) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
          <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Premium Feature</h2>
          <p className="text-gray-600 mb-6">
            Image editing is available for Premium users. Upgrade now to access advanced image editing tools.
          </p>
          <div className="flex space-x-3">
            {onClose && (
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
            )}
            <Button
              variant="primary"
              onClick={() => window.location.href = '/pricing'}
              className="flex-1"
            >
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Image Editor</h2>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Premium</span>
          </div>
          <div className="flex items-center space-x-2">
            {image && (
              <>
                <Button
                  onClick={downloadImage}
                  variant="outline"
                  size="sm"
                  icon={Download}
                >
                  Download
                </Button>
                <Button
                  onClick={handleUpload}
                  variant="primary"
                  size="sm"
                  icon={Check}
                  loading={loading}
                >
                  Save
                </Button>
              </>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Controls */}
          <div className="w-80 border-r border-gray-200 p-4 overflow-y-auto bg-gray-50">
            {/* Upload Button */}
            {!image && (
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="primary"
                  icon={Upload}
                  className="w-full"
                >
                  Upload Image
                </Button>
              </div>
            )}

            {image && (
              <>
                {/* Quick Actions */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={rotateImage}
                      className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <RotateCw className="h-4 w-4" />
                      <span className="text-sm">Rotate</span>
                    </button>
                    <button
                      onClick={resetFilters}
                      className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span className="text-sm">Reset</span>
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900">Adjustments</h3>
                  
                  {/* Brightness */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center space-x-2 text-sm text-gray-700">
                        <Sun className="h-4 w-4" />
                        <span>Brightness</span>
                      </label>
                      <span className="text-xs text-gray-500">{filters.brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filters.brightness}
                      onChange={(e) => setFilters({ ...filters, brightness: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Contrast */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center space-x-2 text-sm text-gray-700">
                        <Contrast className="h-4 w-4" />
                        <span>Contrast</span>
                      </label>
                      <span className="text-xs text-gray-500">{filters.contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filters.contrast}
                      onChange={(e) => setFilters({ ...filters, contrast: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Saturation */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center space-x-2 text-sm text-gray-700">
                        <Droplet className="h-4 w-4" />
                        <span>Saturation</span>
                      </label>
                      <span className="text-xs text-gray-500">{filters.saturate}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filters.saturate}
                      onChange={(e) => setFilters({ ...filters, saturate: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Blur */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center space-x-2 text-sm text-gray-700">
                        <Grid className="h-4 w-4" />
                        <span>Blur</span>
                      </label>
                      <span className="text-xs text-gray-500">{filters.blur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={filters.blur}
                      onChange={(e) => setFilters({ ...filters, blur: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Grayscale */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-gray-700">Grayscale</label>
                      <span className="text-xs text-gray-500">{filters.grayscale}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.grayscale}
                      onChange={(e) => setFilters({ ...filters, grayscale: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Sepia */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-gray-700">Sepia</label>
                      <span className="text-xs text-gray-500">{filters.sepia}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.sepia}
                      onChange={(e) => setFilters({ ...filters, sepia: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Main Canvas Area */}
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-100">
            {!image ? (
              <div className="text-center">
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Image Selected</h3>
                <p className="text-gray-600 mb-4">Upload an image to start editing</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="primary"
                  icon={Upload}
                >
                  Choose Image
                </Button>
              </div>
            ) : (
              <div className="relative max-w-full max-h-full">
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full object-contain shadow-2xl"
                  style={{ display: editedImage ? 'block' : 'none' }}
                />
                {!editedImage && (
                  <img
                    src={image}
                    alt="Original"
                    className="max-w-full max-h-full object-contain shadow-2xl"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageEditor
