import cloudinary from '../config/cloudinary.js'
import fs from 'fs'
import path from 'path'

export const uploadImage = async (filePath, folder = 'efolio') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto'
    })

    // Clean up local file
    fs.unlinkSync(filePath)

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    }
  } catch (error) {
    console.error('Image upload error:', error)
    
    // Clean up local file even if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    
    throw new Error('Failed to upload image')
  }
}

export const uploadFile = async (filePath, options = {}) => {
  try {
    const { folder = 'efolio/files', resourceType = 'raw' } = options

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: false
    })

    // Clean up local file
    fs.unlinkSync(filePath)

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes
    }
  } catch (error) {
    console.error('File upload error:', error)
    
    // Clean up local file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    
    throw new Error('Failed to upload file')
  }
}

export const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    })

    return result.result === 'ok'
  } catch (error) {
    console.error('File deletion error:', error)
    throw new Error('Failed to delete file')
  }
}

export const generateUploadSignature = (folder = 'efolio') => {
  const timestamp = Math.round((new Date).getTime() / 1000)
  
  const signature = cloudinary.utils.api_sign_request({
    timestamp,
    folder
  }, process.env.CLOUDINARY_API_SECRET)

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder
  }
}

export const optimizeImage = async (imageUrl, transformations = {}) => {
  try {
    const defaultTransformations = {
      quality: 'auto',
      fetch_format: 'auto',
      ...transformations
    }

    const optimizedUrl = cloudinary.url(imageUrl, {
      transformation: [defaultTransformations]
    })

    return optimizedUrl
  } catch (error) {
    console.error('Image optimization error:', error)
    return imageUrl // Return original URL if optimization fails
  }
}

export const getStorageUsage = async (userId) => {
  try {
    // This would query Cloudinary for user's storage usage
    // For now, return mock data
    return {
      totalUsed: 154.32, // MB
      imageCount: 23,
      fileCount: 5,
      limit: 1024, // 1GB
      percentageUsed: 15.1
    }
  } catch (error) {
    console.error('Get storage usage error:', error)
    throw new Error('Failed to get storage usage')
  }
}