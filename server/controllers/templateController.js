import Template from '../models/Template.js';

// @desc    Get all templates
// @route   GET /api/templates
// @access  Public
export const getTemplates = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get templates with pagination
    const templates = await Template.find(filter)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'profile.firstName profile.lastName');

    const total = await Template.countDocuments(filter);

    res.json({
      success: true,
      data: templates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching templates',
      error: error.message
    });
  }
};

// @desc    Get single template
// @route   GET /api/templates/:templateId
// @access  Public
export const getTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.templateId)
      .populate('createdBy', 'profile.firstName profile.lastName profile.avatar');

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching template',
      error: error.message
    });
  }
};

// @desc    Create new template
// @route   POST /api/templates
// @access  Private
export const createTemplate = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      previewImage,
      demoUrl,
      features,
      tags
    } = req.body;

    // Check if template with same name exists
    const existingTemplate = await Template.findOne({ name });
    if (existingTemplate) {
      return res.status(400).json({
        success: false,
        message: 'Template with this name already exists'
      });
    }

    const template = new Template({
      name,
      description,
      category,
      price,
      previewImage,
      demoUrl,
      features: features || [],
      tags: tags || [],
      createdBy: req.user.id
    });

    await template.save();

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating template',
      error: error.message
    });
  }
};

// @desc    Update template
// @route   PUT /api/templates/:templateId
// @access  Private
export const updateTemplate = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      previewImage,
      demoUrl,
      features,
      tags,
      isActive
    } = req.body;

    const template = await Template.findById(req.params.templateId);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Check if user owns the template or is admin
    if (template.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this template'
      });
    }

    // Update fields
    if (name) template.name = name;
    if (description) template.description = description;
    if (category) template.category = category;
    if (price !== undefined) template.price = price;
    if (previewImage) template.previewImage = previewImage;
    if (demoUrl) template.demoUrl = demoUrl;
    if (features) template.features = features;
    if (tags) template.tags = tags;
    if (isActive !== undefined) template.isActive = isActive;

    await template.save();

    res.json({
      success: true,
      message: 'Template updated successfully',
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating template',
      error: error.message
    });
  }
};

// @desc    Rate a template
// @route   POST /api/templates/:templateId/rate
// @access  Private
export const rateTemplate = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const templateId = req.params.templateId;
    const userId = req.user.id;

    const template = await Template.findById(templateId);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Check if user already rated this template
    const existingRating = template.ratings.find(
      r => r.user.toString() === userId
    );

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      if (review) existingRating.review = review;
    } else {
      // Add new rating
      template.ratings.push({
        user: userId,
        rating,
        review: review || ''
      });
    }

    // Calculate average rating
    const totalRatings = template.ratings.length;
    const sumRatings = template.ratings.reduce((sum, r) => sum + r.rating, 0);
    template.averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    await template.save();

    res.json({
      success: true,
      message: existingRating ? 'Rating updated' : 'Rating added',
      data: {
        averageRating: template.averageRating,
        totalRatings: template.ratings.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rating template',
      error: error.message
    });
  }
};
