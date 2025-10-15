import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import path from 'path'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

class UploadService {
  constructor() {
    this.cloudinary = cloudinary
  }

  /**
   * Create multer storage for Cloudinary
   * @param {string} folder - Cloudinary folder name
   * @param {array} allowedFormats - Allowed file formats
   */
  createCloudinaryStorage(folder = 'uploads', allowedFormats = ['jpg', 'png', 'jpeg', 'gif', 'webp', 'pdf']) {
    return new CloudinaryStorage({
      cloudinary: this.cloudinary,
      params: {
        folder,
        allowed_formats: allowedFormats,
        transformation: [{ quality: 'auto' }]
      }
    })
  }

  /**
   * Create multer instance for file uploads
   * @param {string} folder - Upload folder
   * @param {number} maxSize - Max file size in bytes (default: 5MB)
   * @param {array} allowedFormats - Allowed file formats
   */
  createUploadMiddleware(folder = 'uploads', maxSize = 5 * 1024 * 1024, allowedFormats) {
    const storage = this.createCloudinaryStorage(folder, allowedFormats)

    return multer({
      storage,
      limits: {
        fileSize: maxSize
      },
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase()
        const allowedExts = allowedFormats.map(f => `.${f}`)
        
        if (allowedExts.includes(ext)) {
          cb(null, true)
        } else {
          cb(new Error(`Only ${allowedFormats.join(', ')} files are allowed`))
        }
      }
    })
  }

  /**
   * Upload a single file to Cloudinary
   * @param {string} filePath - Local file path or buffer
   * @param {object} options - Upload options
   */
  async uploadFile(filePath, options = {}) {
    try {
      const result = await this.cloudinary.uploader.upload(filePath, {
        folder: options.folder || 'uploads',
        resource_type: options.resource_type || 'auto',
        transformation: options.transformation || [{ quality: 'auto' }],
        ...options
      })

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Upload multiple files
   * @param {array} files - Array of file paths or buffers
   * @param {object} options - Upload options
   */
  async uploadMultipleFiles(files, options = {}) {
    try {
      const uploadPromises = files.map(file => 
        this.uploadFile(file, options)
      )

      const results = await Promise.all(uploadPromises)
      
      return {
        success: true,
        files: results.filter(r => r.success),
        failed: results.filter(r => !r.success)
      }
    } catch (error) {
      console.error('Multiple upload error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Delete a file from Cloudinary
   * @param {string} publicId - Cloudinary public ID
   */
  async deleteFile(publicId) {
    try {
      const result = await this.cloudinary.uploader.destroy(publicId)
      
      return {
        success: result.result === 'ok',
        result: result.result
      }
    } catch (error) {
      console.error('Cloudinary delete error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Delete multiple files
   * @param {array} publicIds - Array of Cloudinary public IDs
   */
  async deleteMultipleFiles(publicIds) {
    try {
      const deletePromises = publicIds.map(id => 
        this.deleteFile(id)
      )

      const results = await Promise.all(deletePromises)
      
      return {
        success: true,
        deleted: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    } catch (error) {
      console.error('Multiple delete error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Generate thumbnail from image
   * @param {string} publicId - Cloudinary public ID
   * @param {object} options - Transformation options
   */
  async generateThumbnail(publicId, options = {}) {
    try {
      const {
        width = 200,
        height = 200,
        crop = 'fill',
        quality = 'auto'
      } = options

      const url = this.cloudinary.url(publicId, {
        transformation: [{
          width,
          height,
          crop,
          quality
        }]
      })

      return {
        success: true,
        url
      }
    } catch (error) {
      console.error('Thumbnail generation error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Get optimized image URL
   * @param {string} publicId - Cloudinary public ID
   * @param {object} options - Optimization options
   */
  getOptimizedUrl(publicId, options = {}) {
    const {
      width,
      height,
      crop = 'scale',
      quality = 'auto',
      format = 'auto'
    } = options

    return this.cloudinary.url(publicId, {
      transformation: [{
        width,
        height,
        crop,
        quality,
        fetch_format: format
      }]
    })
  }

  /**
   * Upload base64 image
   * @param {string} base64String - Base64 encoded image
   * @param {object} options - Upload options
   */
  async uploadBase64(base64String, options = {}) {
    try {
      const result = await this.cloudinary.uploader.upload(base64String, {
        folder: options.folder || 'uploads',
        resource_type: 'image',
        ...options
      })

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format
      }
    } catch (error) {
      console.error('Base64 upload error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Get file details
   * @param {string} publicId - Cloudinary public ID
   */
  async getFileDetails(publicId) {
    try {
      const result = await this.cloudinary.api.resource(publicId)
      
      return {
        success: true,
        details: {
          url: result.secure_url,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          created: result.created_at
        }
      }
    } catch (error) {
      console.error('Get file details error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Search files in Cloudinary
   * @param {string} expression - Search expression
   * @param {object} options - Search options
   */
  async searchFiles(expression, options = {}) {
    try {
      const result = await this.cloudinary.search
        .expression(expression)
        .max_results(options.max_results || 30)
        .execute()

      return {
        success: true,
        files: result.resources,
        total: result.total_count
      }
    } catch (error) {
      console.error('Search files error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Create upload signature for client-side uploads
   * @param {object} params - Upload parameters
   */
  createUploadSignature(params = {}) {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000)
      
      const signature = this.cloudinary.utils.api_sign_request(
        {
          timestamp,
          ...params
        },
        process.env.CLOUDINARY_API_SECRET
      )

      return {
        success: true,
        signature,
        timestamp,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME
      }
    } catch (error) {
      console.error('Create signature error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Create middleware instances
export const uploadService = new UploadService()

// Pre-configured middleware for common use cases
export const imageUpload = uploadService.createUploadMiddleware('images', 5 * 1024 * 1024, ['jpg', 'png', 'jpeg', 'gif', 'webp'])
export const documentUpload = uploadService.createUploadMiddleware('documents', 10 * 1024 * 1024, ['pdf', 'doc', 'docx'])
export const profilePictureUpload = uploadService.createUploadMiddleware('profile-pictures', 2 * 1024 * 1024, ['jpg', 'png', 'jpeg'])
export const portfolioImageUpload = uploadService.createUploadMiddleware('portfolio-images', 10 * 1024 * 1024, ['jpg', 'png', 'jpeg', 'gif', 'webp'])

export default uploadService
