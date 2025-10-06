import React, { useState } from 'react'
import { Folder, FileText, Image, Download, Upload, MoreVertical, Search, Grid, List } from 'lucide-react'
import Button from '../../common/Button/Button'

const FileExplorer = () => {
  const [viewMode, setViewMode] = useState('grid')
  const [selectedFiles, setSelectedFiles] = useState([])

  const files = [
    {
      id: 1,
      name: 'project-documentation.pdf',
      type: 'pdf',
      size: '2.4 MB',
      modified: '2024-03-15T14:30:00Z',
      url: '#'
    },
    {
      id: 2,
      name: 'profile-picture.jpg',
      type: 'image',
      size: '1.2 MB',
      modified: '2024-03-14T09:15:00Z',
      url: '#'
    },
    {
      id: 3,
      name: 'resume.docx',
      type: 'document',
      size: '0.8 MB',
      modified: '2024-03-13T16:20:00Z',
      url: '#'
    },
    {
      id: 4,
      name: 'project-screenshots',
      type: 'folder',
      size: '15.7 MB',
      modified: '2024-03-12T11:45:00Z',
      items: 8
    },
    {
      id: 5,
      name: 'portfolio-backup.zip',
      type: 'archive',
      size: '45.2 MB',
      modified: '2024-03-10T10:30:00Z',
      url: '#'
    },
    {
      id: 6,
      name: 'brand-assets',
      type: 'folder',
      size: '32.1 MB',
      modified: '2024-03-08T14:15:00Z',
      items: 12
    }
  ]

  const fileTypes = {
    pdf: { icon: FileText, color: 'text-red-500' },
    image: { icon: Image, color: 'text-green-500' },
    document: { icon: FileText, color: 'text-blue-500' },
    folder: { icon: Folder, color: 'text-yellow-500' },
    archive: { icon: FileText, color: 'text-purple-500' }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const formatSize = (size) => {
    return size
  }

  const handleFileSelect = (fileId) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleDownload = (file) => {
    // Download logic
    console.log('Downloading:', file.name)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">File Explorer</h3>
          <p className="text-sm text-gray-500">Manage your portfolio files and assets</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Button variant="primary" icon={Upload}>
            Upload
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
          <option>All Files</option>
          <option>Images</option>
          <option>Documents</option>
          <option>Archives</option>
        </select>
      </div>

      {/* Files Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => {
            const FileIcon = fileTypes[file.type].icon
            return (
              <div
                key={file.id}
                className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${
                  selectedFiles.includes(file.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleFileSelect(file.id)}
              >
                <FileIcon className={`h-8 w-8 mx-auto mb-2 ${fileTypes[file.type].color}`} />
                <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                  {file.name}
                </h4>
                <p className="text-xs text-gray-500">{file.size}</p>
                <p className="text-xs text-gray-400">{formatDate(file.modified)}</p>
                
                {file.type === 'folder' && (
                  <div className="mt-2 text-xs text-gray-500">
                    {file.items} items
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map((file) => {
                const FileIcon = fileTypes[file.type].icon
                return (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileIcon className={`h-5 w-5 mr-3 ${fileTypes[file.type].color}`} />
                        <span className="text-sm font-medium text-gray-900">
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(file.modified)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Download}
                          onClick={() => handleDownload(file)}
                        >
                          Download
                        </Button>
                        <Button variant="ghost" size="sm" icon={MoreVertical} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Storage Usage */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">Storage Usage</span>
          <span className="text-sm text-gray-500">125.8 MB of 1 GB used</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary-600 h-2 rounded-full" style={{ width: '12.6%' }}></div>
        </div>
      </div>
    </div>
  )
}

export default FileExplorer