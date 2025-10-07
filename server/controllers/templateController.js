import Template from '../models/Template.js'
import User from '../models/User.js'

// @desc    Get all templates
// @route   GET /api/templates
// @access  Public
export const getTemplates = async (req, res) => {
  try {
    const {
      category,
      search,
      tags,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12,
      isPublic = true
    } = req.query

    // Build filter object
    const filter = { isActive: true }
    
    if (isPublic !== 'false') {
      filter.isPublic = true
    }
    
    if (category && category !== 'all') {
      filter.category = category
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }
    
    if (tags) {
      const tagArray = tags.split(',')
      filter.tags = { $in: tagArray }
    }
    
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)

    // Build sort object
    let sortObj = {}
    switch (sortBy) {
      case 'popular':
        sortObj = { downloads: -1, 'ratings.average': -1 }
        break
      case 'rating':
        sortObj = { 'ratings.average': -1, 'ratings.count': -1 }
        break
      case 'downloads':
        sortObj = { downloads: -1 }
        break
      case 'likes':
        sortObj = { likes: -1 }
        break
      case 'oldest':
        sortObj = { createdAt: 1 }
        break
      default: // newest
        sortObj = { createdAt: -1 }
    }

    // Get templates with pagination
    const templates = await Template.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('creator', 'profile.firstName profile.lastName email')

    const total = await Template.countDocuments(filter)

    res.json({
      success: true,
      data: templates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Get templates error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching templates',
      error: error.message
    })
  }
}

// @desc    Get single template
// @route   GET /api/templates/:id
// @access  Public
export const getTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id)
      .populate('creator', 'profile.firstName profile.lastName email')

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      })
    }

    // Increment view count
    template.views += 1
    await template.save()

    res.json({
      success: true,
      data: template
    })
  } catch (error) {
    console.error('Get template error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching template',
      error: error.message
    })
  }
}

// @desc    Create new template
// @route   POST /api/templates
// @access  Private
export const createTemplate = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      sections,
      globalStyles,
      tags,
      isPublic = true,
      price = 0
    } = req.body

    // Get user info for author field
    const user = await User.findById(req.user.id)
    const authorName = `${user.profile.firstName} ${user.profile.lastName}`

    const template = new Template({
      name,
      description,
      category,
      sections,
      globalStyles,
      tags,
      isPublic,
      price,
      creator: req.user.id,
      author: authorName
    })

    const savedTemplate = await template.save()
    await savedTemplate.populate('creator', 'profile.firstName profile.lastName email')

    res.status(201).json({
      success: true,
      data: savedTemplate,
      message: 'Template created successfully'
    })
  } catch (error) {
    console.error('Create template error:', error)
    res.status(400).json({
      success: false,
      message: 'Error creating template',
      error: error.message
    })
  }
}

// @desc    Update template
// @route   PUT /api/templates/:id
// @access  Private
export const updateTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id)

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      })
    }

    // Check if user owns the template or is admin
    if (template.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this template'
      })
    }

    const updatedTemplate = await Template.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('creator', 'profile.firstName profile.lastName email')

    res.json({
      success: true,
      data: updatedTemplate,
      message: 'Template updated successfully'
    })
  } catch (error) {
    console.error('Update template error:', error)
    res.status(400).json({
      success: false,
      message: 'Error updating template',
      error: error.message
    })
  }
}

// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private
export const deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id)

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      })
    }

    // Check if user owns the template or is admin
    if (template.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this template'
      })
    }

    await Template.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Template deleted successfully'
    })
  } catch (error) {
    console.error('Delete template error:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting template',
      error: error.message
    })
  }
}

// @desc    Duplicate template
// @route   POST /api/templates/:id/duplicate
// @access  Private
export const duplicateTemplate = async (req, res) => {
  try {
    const originalTemplate = await Template.findById(req.params.id)

    if (!originalTemplate) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      })
    }

    // Get user info for author field
    const user = await User.findById(req.user.id)
    const authorName = `${user.profile.firstName} ${user.profile.lastName}`

    // Create duplicate
    const duplicateData = originalTemplate.toObject()
    delete duplicateData._id
    delete duplicateData.createdAt
    delete duplicateData.updatedAt
    
    const duplicatedTemplate = new Template({
      ...duplicateData,
      name: `${originalTemplate.name} (Copy)`,
      creator: req.user.id,
      author: authorName,
      downloads: 0,
      likes: 0,
      views: 0,
      ratings: { average: 0, count: 0 }
    })

    const savedTemplate = await duplicatedTemplate.save()
    await savedTemplate.populate('creator', 'profile.firstName profile.lastName email')

    res.status(201).json({
      success: true,
      data: savedTemplate,
      message: 'Template duplicated successfully'
    })
  } catch (error) {
    console.error('Duplicate template error:', error)
    res.status(400).json({
      success: false,
      message: 'Error duplicating template',
      error: error.message
    })
  }
}

// @desc    Like/Unlike template
// @route   POST /api/templates/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id)

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      })
    }

    // For simplicity, just increment/decrement likes
    // In a real app, you'd track which users liked which templates
    const { action } = req.body // 'like' or 'unlike'
    
    if (action === 'like') {
      template.likes += 1
    } else if (action === 'unlike' && template.likes > 0) {
      template.likes -= 1
    }

    await template.save()

    res.json({
      success: true,
      data: { likes: template.likes },
      message: `Template ${action}d successfully`
    })
  } catch (error) {
    console.error('Toggle like error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating like status',
      error: error.message
    })
  }
}

// @desc    Rate template
// @route   POST /api/templates/:id/rate
// @access  Private
export const rateTemplate = async (req, res) => {
  try {
    const { rating } = req.body

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      })
    }

    const template = await Template.findById(req.params.id)

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      })
    }

    await template.updateRating(rating)

    res.json({
      success: true,
      data: {
        rating: template.ratings.average,
        count: template.ratings.count
      },
      message: 'Template rated successfully'
    })
  } catch (error) {
    console.error('Rate template error:', error)
    res.status(500).json({
      success: false,
      message: 'Error rating template',
      error: error.message
    })
  }
}

// @desc    Get user's templates
// @route   GET /api/templates/my-templates
// @access  Private
export const getMyTemplates = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const sortObj = { [sortBy]: order === 'desc' ? -1 : 1 }

    const templates = await Template.find({ creator: req.user.id })
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('creator', 'profile.firstName profile.lastName email')

    const total = await Template.countDocuments({ creator: req.user.id })

    res.json({
      success: true,
      data: templates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Get my templates error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching your templates',
      error: error.message
    })
  }
}

// @desc    Get template categories with counts
// @route   GET /api/templates/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Template.aggregate([
      { $match: { isActive: true, isPublic: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    const totalCount = await Template.countDocuments({ isActive: true, isPublic: true })

    const result = [
      { id: 'all', name: 'All Templates', count: totalCount },
      ...categories.map(cat => ({
        id: cat._id,
        name: cat._id.charAt(0).toUpperCase() + cat._id.slice(1),
        count: cat.count
      }))
    ]

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error?.message || 'Unknown error'
    })
  }
}
