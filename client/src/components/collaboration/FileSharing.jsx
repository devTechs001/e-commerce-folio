import React, { useState, useEffect, useCallback } from 'react'
import { Upload, File, FileText, Image as ImageIcon, Video, Music, Archive, X, Download, Eye, Share2, Trash2, FolderOpen, Grid, List, Search, Filter, ChevronDown } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import uploadService from '../../services/upload'
import { socketService } from '../../services/socket'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const FileSharing = ({ teamId }) => {
  const { user } = useAuth()
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [previewFile, setPreviewFile] = useState(null)

  useEffect(() => {
    loadFiles()

    // Socket listeners for real-time sync
    socketService.on('file_uploaded', handleFileUploaded)
    socketService.on('file_deleted', handleFileDeleted)

    return () => {
      socketService.off('file_uploaded')
      socketService.off('file_deleted')
    }
  }, [teamId])

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true)

    for (const file of acceptedFiles) {
      try {
        const fileId = `${Date.now()}-${file.name}`
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))

        // Process image if applicable
        let processedFile = file
        if (file.type.startsWith('image/')) {
          processedFile = await uploadService.compressImage(file, {
            maxSizeMB: 2,
            maxWidthOrHeight: 2000
          })
        }

        // Upload file
        const result = await uploadService.uploadImage(processedFile)

        // Create file record
        const newFile = {
          id: Date.now(),
          name: file.name,
          url: result.url,
          type: file.type,
          size: file.size,
          uploadedBy: user.name,
          uploadedById: user.id,
          uploadedAt: new Date(),
          teamId: teamId
        }

        // Add to files list
        setFiles(prev => [newFile, ...prev])

        // Notify team via socket
        socketService.emit('file_uploaded', newFile)

        // Clear progress
        setUploadProgress(prev => {
          const updated = { ...prev }
          delete updated[fileId]
          return updated
        })

        toast.success(`${file.name} uploaded successfully`)
      } catch (error) {
        console.error('Upload error:', error)
        toast.error(`Failed to upload ${file.name}`)
      }
    }

    setUploading(false)
  }, [user, teamId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true
  })

  const loadFiles = () => {
    // Load from localStorage or API
    const saved = localStorage.getItem(`team_files_${teamId}`)
    if (saved) {
      setFiles(JSON.parse(saved))
    }
  }

  const saveFiles = (fileList) => {
    localStorage.setItem(`team_files_${teamId}`, JSON.stringify(fileList))
  }

  const handleFileUploaded = (file) => {
    if (file.teamId === teamId && file.uploadedById !== user.id) {
      setFiles(prev => {
        const updated = [file, ...prev]
        saveFiles(updated)
        return updated
      })
      toast(`${file.uploadedBy} uploaded ${file.name}`, { icon: '📁' })
    }
  }

  const handleFileDeleted = (fileId) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId)
      saveFiles(updated)
      return updated
    })
  }

  const deleteFile = (file) => {
    if (window.confirm(`Delete ${file.name}?`)) {
      setFiles(prev => {
        const updated = prev.filter(f => f.id !== file.id)
        saveFiles(updated)
        return updated
      })
      socketService.emit('file_deleted', file.id)
      toast.success('File deleted')
    }
  }

  const downloadFile = (file) => {
    const a = document.createElement('a')
    a.href = file.url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success('Downloading...')
  }

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-5 h-5" />
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />
    if (type.startsWith('audio/')) return <Music className="w-5 h-5" />
    if (type.includes('pdf')) return <FileText className="w-5 h-5" />
    if (type.includes('zip') || type.includes('rar')) return <Archive className="w-5 h-5" />
    return <File className="w-5 h-5" />
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch = !searchQuery || file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || file.type.startsWith(filterType)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        {isDragActive ? (
          <p className="text-primary-600 font-medium">Drop files here...</p>
        ) : (
          <>
            <p className="text-gray-700 font-medium mb-1">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Images will be automatically compressed
            </p>
          </>
        )}
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900 mb-2">Uploading...</p>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="mb-2">
              <div className="flex items-center justify-between text-xs text-blue-700 mb-1">
                <span>{fileId.split('-').slice(1).join('-')}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Files</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="application">Documents</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Files Grid/List */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No files yet</p>
          <p className="text-sm text-gray-400">Upload files to share with your team</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {file.type.startsWith('image/') && (
                    <button
                      onClick={() => setPreviewFile(file)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                  <button
                    onClick={() => downloadFile(file)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteFile(file)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900 truncate mb-1" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              <p className="text-xs text-gray-400 mt-2">{file.uploadedBy}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded By</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-400">{getFileIcon(file.type)}</div>
                      <span className="text-sm font-medium text-gray-900">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatFileSize(file.size)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{file.uploadedBy}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(file.uploadedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {file.type.startsWith('image/') && (
                        <button
                          onClick={() => setPreviewFile(file)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                      <button
                        onClick={() => downloadFile(file)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => deleteFile(file)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewFile(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setPreviewFile(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={previewFile.url}
            alt={previewFile.name}
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
            <span>{previewFile.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                downloadFile(previewFile)
              }}
              className="flex items-center space-x-2 bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileSharing
