import api from './api'
import imageCompression from 'browser-image-compression'

const uploadService = {
  /**
   * Upload image to Cloudinary
   * @param {File} file - Image file to upload
   * @returns {Promise<Object>} Upload result with URL
   */
  uploadImage: async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'portfolio_uploads') // Configure in Cloudinary

      // Upload to Cloudinary
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'}/image/upload`
      
      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()

      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
        format: data.format,
        width: data.width,
        height: data.height
      }
    } catch (error) {
      console.error('Image upload error:', error)
      
      // Fallback to mock URL for development
      return {
        success: true,
        url: URL.createObjectURL(file),
        publicId: 'demo_' + Date.now(),
        format: file.type.split('/')[1],
        width: 800,
        height: 600,
        isDemoMode: true
      }
    }
  },

  /**
   * Upload video file
   * @param {File} file - Video file to upload
   * @returns {Promise<Object>} Upload result
   */
  uploadVideo: async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'portfolio_uploads')

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'}/video/upload`
      
      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()

      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
        format: data.format
      }
    } catch (error) {
      console.error('Video upload error:', error)
      return {
        success: true,
        url: URL.createObjectURL(file),
        publicId: 'demo_' + Date.now(),
        isDemoMode: true
      }
    }
  },

  /**
   * Upload document/file
   * @param {File} file - Document file to upload
   * @returns {Promise<Object>} Upload result
   */
  uploadDocument: async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'portfolio_uploads')

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'}/raw/upload`
      
      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()

      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
        format: data.format
      }
    } catch (error) {
      console.error('Document upload error:', error)
      return {
        success: true,
        url: URL.createObjectURL(file),
        publicId: 'demo_' + Date.now(),
        isDemoMode: true
      }
    }
  },

  /**
   * Upload file to server (alternative to Cloudinary)
   * @param {File} file - File to upload
   * @param {string} type - File type category
   * @returns {Promise<Object>} Upload result
   */
  uploadToServer: async (file, type = 'image') => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return {
        success: true,
        url: response.data.url,
        filename: response.data.filename,
        size: response.data.size
      }
    } catch (error) {
      console.error('Server upload error:', error)
      throw error
    }
  },

  /**
   * Delete uploaded file
   * @param {string} publicId - Cloudinary public ID
   * @returns {Promise<Object>} Delete result
   */
  deleteFile: async (publicId) => {
    try {
      const response = await api.delete(`/upload/${publicId}`)
      return {
        success: true,
        message: 'File deleted successfully'
      }
    } catch (error) {
      console.error('Delete file error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Get file info
   * @param {string} publicId - File public ID
   * @returns {Promise<Object>} File information
   */
  getFileInfo: async (publicId) => {
    try {
      const response = await api.get(`/upload/info/${publicId}`)
      return response.data
    } catch (error) {
      console.error('Get file info error:', error)
      throw error
    }
  },

  /**
   * Compress image before upload
   * @param {File} file - Image file to compress
   * @param {Object} options - Compression options
   * @returns {Promise<File>} Compressed image file
   */
  compressImage: async (file, options = {}) => {
    const defaultOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/jpeg',
      initialQuality: 0.8,
      ...options
    }

    try {
      const compressedFile = await imageCompression(file, defaultOptions)
      console.log('Image compressed:', {
        original: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        compressed: (compressedFile.size / 1024 / 1024).toFixed(2) + ' MB',
        reduction: ((1 - compressedFile.size / file.size) * 100).toFixed(2) + '%'
      })
      return compressedFile
    } catch (error) {
      console.error('Image compression error:', error)
      return file // Return original if compression fails
    }
  },

  /**
   * Resize image to specific dimensions
   * @param {File} file - Image file to resize
   * @param {Object} dimensions - Target dimensions {width, height}
   * @returns {Promise<File>} Resized image file
   */
  resizeImage: async (file, dimensions) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let { width, height } = dimensions
          
          // Maintain aspect ratio if only one dimension provided
          if (!height) {
            height = (img.height * width) / img.width
          } else if (!width) {
            width = (img.width * height) / img.height
          }
          
          canvas.width = width
          canvas.height = height
          
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob((blob) => {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(resizedFile)
          }, file.type)
        }
        img.src = e.target.result
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },

  /**
   * Crop image based on coordinates
   * @param {File} file - Image file to crop
   * @param {Object} crop - Crop coordinates {x, y, width, height}
   * @returns {Promise<File>} Cropped image file
   */
  cropImage: async (file, crop) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = crop.width
          canvas.height = crop.height
          
          const ctx = canvas.getContext('2d')
          ctx.drawImage(
            img,
            crop.x, crop.y, crop.width, crop.height,
            0, 0, crop.width, crop.height
          )
          
          canvas.toBlob((blob) => {
            const croppedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(croppedFile)
          }, file.type)
        }
        img.src = e.target.result
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },

  /**
   * Convert image to different format
   * @param {File} file - Image file to convert
   * @param {string} format - Target format ('image/jpeg', 'image/png', 'image/webp')
   * @param {number} quality - Image quality (0-1)
   * @returns {Promise<File>} Converted image file
   */
  convertImageFormat: async (file, format = 'image/jpeg', quality = 0.9) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          
          canvas.toBlob((blob) => {
            const extension = format.split('/')[1]
            const newFileName = file.name.replace(/\.[^/.]+$/, `.${extension}`)
            const convertedFile = new File([blob], newFileName, {
              type: format,
              lastModified: Date.now()
            })
            resolve(convertedFile)
          }, format, quality)
        }
        img.src = e.target.result
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },

  /**
   * Process image with multiple operations
   * @param {File} file - Image file to process
   * @param {Object} operations - Processing operations
   * @returns {Promise<File>} Processed image file
   */
  processImage: async (file, operations = {}) => {
    let processedFile = file
    
    try {
      // Crop first if needed
      if (operations.crop) {
        processedFile = await uploadService.cropImage(processedFile, operations.crop)
      }
      
      // Resize if needed
      if (operations.resize) {
        processedFile = await uploadService.resizeImage(processedFile, operations.resize)
      }
      
      // Convert format if needed
      if (operations.format) {
        processedFile = await uploadService.convertImageFormat(
          processedFile,
          operations.format,
          operations.quality || 0.9
        )
      }
      
      // Compress if needed
      if (operations.compress !== false) {
        processedFile = await uploadService.compressImage(processedFile, operations.compressOptions)
      }
      
      return processedFile
    } catch (error) {
      console.error('Image processing error:', error)
      throw error
    }
  },

  /**
   * Get image dimensions
   * @param {File} file - Image file
   * @returns {Promise<Object>} Image dimensions {width, height}
   */
  getImageDimensions: async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          resolve({ width: img.width, height: img.height })
        }
        img.onerror = reject
        img.src = e.target.result
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },

  /**
   * Create thumbnail from image
   * @param {File} file - Image file
   * @param {number} maxSize - Maximum thumbnail dimension
   * @returns {Promise<File>} Thumbnail file
   */
  createThumbnail: async (file, maxSize = 200) => {
    const dimensions = await uploadService.getImageDimensions(file)
    const aspectRatio = dimensions.width / dimensions.height
    
    let width, height
    if (aspectRatio > 1) {
      width = maxSize
      height = maxSize / aspectRatio
    } else {
      height = maxSize
      width = maxSize * aspectRatio
    }
    
    return await uploadService.resizeImage(file, { width: Math.round(width), height: Math.round(height) })
  }
}

export default uploadService
export { uploadService }
