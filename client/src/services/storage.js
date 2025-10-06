import api from './api'

export const storageService = {
  // File Upload
  async uploadFile(file, options = {}) {
    const formData = new FormData()
    formData.append('file', file)
    
    if (options.folder) {
      formData.append('folder', options.folder)
    }
    
    if (options.metadata) {
      formData.append('metadata', JSON.stringify(options.metadata))
    }

    const response = await api.post('/storage/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: options.onProgress || (() => {})
    })
    
    return response.data
  },

  async uploadMultipleFiles(files, options = {}) {
    const formData = new FormData()
    
    files.forEach((file, index) => {
      formData.append(`files`, file)
    })
    
    if (options.folder) {
      formData.append('folder', options.folder)
    }

    const response = await api.post('/storage/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: options.onProgress || (() => {})
    })
    
    return response.data
  },

  // File Management
  async getFiles(folder = '', page = 1, limit = 50) {
    const response = await api.get('/storage/files', {
      params: { folder, page, limit }
    })
    return response.data
  },

  async getFile(fileId) {
    const response = await api.get(`/storage/files/${fileId}`)
    return response.data
  },

  async updateFile(fileId, updates) {
    const response = await api.put(`/storage/files/${fileId}`, updates)
    return response.data
  },

  async deleteFile(fileId) {
    const response = await api.delete(`/storage/files/${fileId}`)
    return response.data
  },

  async deleteMultipleFiles(fileIds) {
    const response = await api.post('/storage/files/delete-multiple', { fileIds })
    return response.data
  },

  // Folder Management
  async createFolder(name, parentFolder = '') {
    const response = await api.post('/storage/folders', {
      name,
      parentFolder
    })
    return response.data
  },

  async getFolders(parentFolder = '') {
    const response = await api.get('/storage/folders', {
      params: { parentFolder }
    })
    return response.data
  },

  async updateFolder(folderId, updates) {
    const response = await api.put(`/storage/folders/${folderId}`, updates)
    return response.data
  },

  async deleteFolder(folderId) {
    const response = await api.delete(`/storage/folders/${folderId}`)
    return response.data
  },

  // File Operations
  async downloadFile(fileId) {
    const response = await api.get(`/storage/files/${fileId}/download`, {
      responseType: 'blob'
    })
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    
    // Get filename from response headers
    const contentDisposition = response.headers['content-disposition']
    let filename = 'download'
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/)
      if (filenameMatch) {
        filename = filenameMatch[1]
      }
    }
    
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    return { success: true, filename }
  },

  async getFileUrl(fileId) {
    const response = await api.get(`/storage/files/${fileId}/url`)
    return response.data
  },

  async generatePresignedUrl(fileId, operation = 'get') {
    const response = await api.post(`/storage/files/${fileId}/presigned-url`, {
      operation
    })
    return response.data
  },

  // Storage Analytics
  async getStorageUsage() {
    const response = await api.get('/storage/usage')
    return response.data
  },

  async getStorageStats() {
    const response = await api.get('/storage/stats')
    return response.data
  },

  // File Search
  async searchFiles(query, filters = {}) {
    const response = await api.get('/storage/search', {
      params: { query, ...filters }
    })
    return response.data
  },

  // Bulk Operations
  async moveFiles(fileIds, targetFolder) {
    const response = await api.post('/storage/files/move', {
      fileIds,
      targetFolder
    })
    return response.data
  },

  async copyFiles(fileIds, targetFolder) {
    const response = await api.post('/storage/files/copy', {
      fileIds,
      targetFolder
    })
    return response.data
  },

  // File Sharing
  async createShareLink(fileId, settings) {
    const response = await api.post(`/storage/files/${fileId}/share`, settings)
    return response.data
  },

  async getShareLinks(fileId) {
    const response = await api.get(`/storage/files/${fileId}/shares`)
    return response.data
  },

  async revokeShareLink(fileId, shareId) {
    const response = await api.delete(`/storage/files/${fileId}/shares/${shareId}`)
    return response.data
  },

  // File Preview
  async getFilePreview(fileId) {
    const response = await api.get(`/storage/files/${fileId}/preview`)
    return response.data
  },

  // Backup and Restore
  async createBackup() {
    const response = await api.post('/storage/backup')
    return response.data
  },

  async getBackups() {
    const response = await api.get('/storage/backups')
    return response.data
  },

  async restoreBackup(backupId) {
    const response = await api.post(`/storage/backups/${backupId}/restore`)
    return response.data
  },

  // File Validation
  async validateFile(file, rules = {}) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('rules', JSON.stringify(rules))

    const response = await api.post('/storage/validate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  },

  // Image Processing
  async processImage(fileId, operations) {
    const response = await api.post(`/storage/files/${fileId}/process`, {
      operations
    })
    return response.data
  },

  // File Metadata
  async updateFileMetadata(fileId, metadata) {
    const response = await api.put(`/storage/files/${fileId}/metadata`, metadata)
    return response.data
  },

  async getFileMetadata(fileId) {
    const response = await api.get(`/storage/files/${fileId}/metadata`)
    return response.data
  }
}

// Local storage helper functions
export const localStorageService = {
  set(key, value) {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
      return true
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return false
    }
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  },

  clear() {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  },

  // Portfolio-specific storage
  setPortfolioData(portfolioId, data) {
    return this.set(`portfolio_${portfolioId}`, data)
  },

  getPortfolioData(portfolioId) {
    return this.get(`portfolio_${portfolioId}`)
  },

  removePortfolioData(portfolioId) {
    return this.remove(`portfolio_${portfolioId}`)
  },

  // User preferences
  setUserPreferences(preferences) {
    return this.set('user_preferences', preferences)
  },

  getUserPreferences() {
    return this.get('user_preferences', {})
  },

  // Draft management
  saveDraft(portfolioId, sectionId, content) {
    const drafts = this.get('portfolio_drafts', {})
    if (!drafts[portfolioId]) {
      drafts[portfolioId] = {}
    }
    drafts[portfolioId][sectionId] = {
      content,
      timestamp: Date.now()
    }
    return this.set('portfolio_drafts', drafts)
  },

  getDraft(portfolioId, sectionId) {
    const drafts = this.get('portfolio_drafts', {})
    return drafts[portfolioId]?.[sectionId] || null
  },

  clearDraft(portfolioId, sectionId) {
    const drafts = this.get('portfolio_drafts', {})
    if (drafts[portfolioId]?.[sectionId]) {
      delete drafts[portfolioId][sectionId]
      return this.set('portfolio_drafts', drafts)
    }
    return true
  },

  clearAllDrafts(portfolioId) {
    const drafts = this.get('portfolio_drafts', {})
    if (drafts[portfolioId]) {
      delete drafts[portfolioId]
      return this.set('portfolio_drafts', drafts)
    }
    return true
  }
}