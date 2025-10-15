import React, { useState, useRef } from 'react'
import { 
  Upload, Link as LinkIcon, X, Image as ImageIcon, Video, 
  FileText, Trash2, Edit, Eye, Download, Search, Grid, List,
  Filter, CheckCircle, Crown, ExternalLink, Plus
} from 'lucide-react'
import { uploadService } from '../../../services/upload'
import { subscriptionService } from '../../../services/subscription'
import Button from '../../common/Button/Button'

const MediaGallery = ({ 
  portfolioId,
  onMediaSelect,
  multiSelect = false,
  allowedTypes = ['image', 'video', 'document']
}) => {
  const [mediaItems, setMediaItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [uploading, setUploading] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showUrlModal, setShowUrlModal] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [userTier, setUserTier] = useState('free')
  const fileInputRef = useRef(null)

  // Check subscription tier
  React.useEffect(() => {
    const checkTier = async () => {
      const tier = await subscriptionService.getUserTier()
      setUserTier(tier)
    }
    checkTier()
  }, [])

  const isPremium = ['premium', 'professional', 'enterprise'].includes(userTier)
  const maxFileSize = isPremium ? 50 * 1024 * 1024 : 10 * 1024 * 1024 // 50MB vs 10MB
  const storageLimit = isPremium ? 10 * 1024 * 1024 * 1024 : 500 * 1024 * 1024 // 10GB vs 500MB

  // Handle file upload from local
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    
    if (files.length === 0) return

    setUploading(true)
    const uploadedItems = []

    for (const file of files) {
      // Check file size
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds ${isPremium ? '50MB' : '10MB'} limit`)
        continue
      }

      try {
        let result
        if (file.type.startsWith('image/')) {
          result = await uploadService.uploadImage(file)
        } else if (file.type.startsWith('video/')) {
          result = await uploadService.uploadVideo(file)
        } else {
          result = await uploadService.uploadDocument(file)
        }

        if (result.success) {
          uploadedItems.push({
            id: Date.now() + Math.random(),
            type: file.type.startsWith('image/') ? 'image' : 
                  file.type.startsWith('video/') ? 'video' : 'document',
            url: result.url,
            name: file.name,
            size: file.size,
            uploadDate: new Date(),
            source: 'local'
          })
        }
      } catch (error) {
        console.error('Upload error:', error)
        alert(`Failed to upload ${file.name}`)
      }
    }

    setMediaItems([...mediaItems, ...uploadedItems])
    setUploading(false)
  }

  // Handle URL-based media
  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return

    const mediaType = urlInput.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? 'image' :
                     urlInput.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'link'

    const newItem = {
      id: Date.now(),
      type: mediaType,
      url: urlInput,
      name: urlInput.split('/').pop() || 'External Media',
      size: 0,
      uploadDate: new Date(),
      source: 'online'
    }

    setMediaItems([...mediaItems, newItem])
    setUrlInput('')
    setShowUrlModal(false)
  }

  // Handle media selection
  const toggleSelect = (item) => {
    if (multiSelect) {
      if (selectedItems.find(i => i.id === item.id)) {
        setSelectedItems(selectedItems.filter(i => i.id !== item.id))
      } else {
        setSelectedItems([...selectedItems, item])
      }
    } else {
      setSelectedItems([item])
      if (onMediaSelect) {
        onMediaSelect(item)
      }
    }
  }

  // Delete media
  const handleDelete = (itemId) => {
    setMediaItems(mediaItems.filter(item => item.id !== itemId))
    setSelectedItems(selectedItems.filter(item => item.id !== itemId))
  }

  // Filter and search
  const filteredMedia = mediaItems.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  // Calculate storage usage
  const usedStorage = mediaItems.reduce((sum, item) => sum + (item.size || 0), 0)
  const storagePercentage = (usedStorage / storageLimit) * 100

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Media Gallery</h2>
          <p className="text-sm text-gray-600 mt-1">
            {mediaItems.length} items • {formatFileSize(usedStorage)} used
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {!isPremium && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              Free: 10MB max • 500MB storage
            </span>
          )}
          {isPremium && (
            <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
              <Crown className="h-3 w-3 mr-1" />
              Premium: 50MB max • 10GB storage
            </span>
          )}
        </div>
      </div>

      {/* Storage Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Storage Usage</span>
          <span className="text-sm font-medium text-gray-900">
            {formatFileSize(usedStorage)} / {formatFileSize(storageLimit)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              storagePercentage > 90 ? 'bg-red-500' : 
              storagePercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(storagePercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Upload Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.includes('image') ? 'image/*,video/*,application/pdf' : ''}
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          icon={Upload}
          disabled={uploading}
          loading={uploading}
        >
          Upload Local Files
        </Button>
        <Button
          onClick={() => setShowUrlModal(true)}
          icon={LinkIcon}
          variant="outline"
        >
          Add from URL
        </Button>
        <Button
          onClick={() => window.open('https://unsplash.com', '_blank')}
          icon={ExternalLink}
          variant="outline"
        >
          Browse Unsplash
        </Button>
        <Button
          onClick={() => window.open('https://pexels.com', '_blank')}
          icon={ExternalLink}
          variant="outline"
        >
          Browse Pexels
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('image')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'image' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ImageIcon className="h-4 w-4 inline mr-1" />
            Images
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'video' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Video className="h-4 w-4 inline mr-1" />
            Videos
          </button>
        </div>

        <div className="flex items-center space-x-2 border-l border-gray-300 pl-3">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                selectedItems.find(i => i.id === item.id) 
                  ? 'border-primary-500 ring-2 ring-primary-200' 
                  : 'border-gray-200 hover:border-primary-300'
              }`}
              onClick={() => toggleSelect(item)}
            >
              {/* Preview */}
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                ) : item.type === 'video' ? (
                  <video src={item.url} className="w-full h-full object-cover" />
                ) : (
                  <FileText className="h-12 w-12 text-gray-400" />
                )}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(item.url, '_blank')
                    }}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                  >
                    <Eye className="h-4 w-4 text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(item.id)
                    }}
                    className="p-2 bg-white rounded-full hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Selected Badge */}
              {selectedItems.find(i => i.id === item.id) && (
                <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full p-1">
                  <CheckCircle className="h-5 w-5" />
                </div>
              )}

              {/* Source Badge */}
              <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                item.source === 'local' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {item.source === 'local' ? 'Local' : 'Online'}
              </div>

              {/* Info */}
              <div className="p-2 bg-white">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedItems.find(i => i.id === item.id)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
              onClick={() => toggleSelect(item)}
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                ) : item.type === 'video' ? (
                  <Video className="h-8 w-8 text-gray-400" />
                ) : (
                  <FileText className="h-8 w-8 text-gray-400" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600">
                  {formatFileSize(item.size)} • {item.source === 'local' ? 'Local' : 'Online'} • 
                  {new Date(item.uploadDate).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(item.url, '_blank')
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Eye className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(item.id)
                  }}
                  className="p-2 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-5 w-5 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredMedia.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No media yet</h3>
          <p className="text-gray-600 mb-4">Upload files or add images from URL to get started</p>
          <Button onClick={() => fileInputRef.current?.click()} icon={Plus}>
            Add Media
          </Button>
        </div>
      )}

      {/* URL Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add Media from URL</h3>
              <button
                onClick={() => setShowUrlModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 mb-4"
            />
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowUrlModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUrlSubmit}
                className="flex-1"
                disabled={!urlInput.trim()}
              >
                Add Media
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MediaGallery
