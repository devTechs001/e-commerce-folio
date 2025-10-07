import { validationResult, body } from 'express-validator'

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    })
  }
  next()
}

// Job validation
export const validateJob = [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  body('description').trim().isLength({ min: 20, max: 2000 }).withMessage('Description must be 20-2000 characters'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('budgetMin').isNumeric().isFloat({ min: 1 }).withMessage('Budget minimum must be a positive number'),
  body('budgetMax').isNumeric().isFloat({ min: 1 }).withMessage('Budget maximum must be a positive number'),
  body('budgetType').isIn(['fixed', 'hourly']).withMessage('Budget type must be fixed or hourly'),
  body('duration').trim().isLength({ min: 1 }).withMessage('Duration is required'),
  body('experienceLevel').isIn(['entry', 'intermediate', 'expert']).withMessage('Invalid experience level'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  handleValidationErrors
]

// Proposal validation
export const validateProposal = [
  body('coverLetter').trim().isLength({ min: 50, max: 1000 }).withMessage('Cover letter must be 50-1000 characters'),
  body('proposedRate').isNumeric().isFloat({ min: 1 }).withMessage('Proposed rate must be a positive number'),
  body('estimatedDuration').trim().isLength({ min: 1 }).withMessage('Estimated duration is required'),
  handleValidationErrors
]