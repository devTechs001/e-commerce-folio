import express from 'express'
import {
  exportPDF,
  exportHTML,
  exportData
} from '../controllers/exportController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// All routes are protected
router.use(auth)

// @route   GET /api/export/portfolio/:portfolioId/pdf
// @desc    Export portfolio as PDF
// @access  Private
router.get('/portfolio/:portfolioId/pdf', exportPDF)

// @route   GET /api/export/portfolio/:portfolioId/html
// @desc    Export portfolio as HTML
// @access  Private
router.get('/portfolio/:portfolioId/html', exportHTML)

// @route   GET /api/export/portfolio/:portfolioId/data
// @desc    Export portfolio data
// @access  Private
router.get('/portfolio/:portfolioId/data', exportData)

export default router