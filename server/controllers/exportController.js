import Portfolio from '../models/Portfolio.js'
import User from '../models/User.js'
import { generatePDF, generateStaticSite } from '../services/exportService.js'

export const exportPDF = async (req, res) => {
  try {
    const { portfolioId } = req.params

    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId: req.user.id
    }).populate('userId', 'profile')

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' })
    }

    const pdfBuffer = await generatePDF(portfolio, portfolio.userId)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${portfolio.slug}.pdf"`)
    res.send(pdfBuffer)
  } catch (error) {
    console.error('PDF export error:', error)
    res.status(500).json({ error: 'Failed to export PDF' })
  }
}

export const exportHTML = async (req, res) => {
  try {
    const { portfolioId } = req.params

    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId: req.user.id
    }).populate('userId', 'profile')

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' })
    }

    const htmlBuffer = await generateStaticSite(portfolio, portfolio.userId)

    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Content-Disposition', `attachment; filename="${portfolio.slug}.html"`)
    res.send(htmlBuffer)
  } catch (error) {
    console.error('HTML export error:', error)
    res.status(500).json({ error: 'Failed to export HTML' })
  }
}

export const exportData = async (req, res) => {
  try {
    const { portfolioId } = req.params
    const { format = 'json' } = req.query

    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId: req.user.id
    })

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' })
    }

    const exportData = {
      portfolio: {
        id: portfolio._id,
        title: portfolio.title,
        slug: portfolio.slug,
        sections: portfolio.sections,
        styles: portfolio.styles,
        settings: portfolio.settings,
        createdAt: portfolio.createdAt,
        updatedAt: portfolio.updatedAt
      },
      exportedAt: new Date(),
      version: '1.0'
    }

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Disposition', `attachment; filename="${portfolio.slug}.json"`)
      res.send(JSON.stringify(exportData, null, 2))
    } else {
      res.json(exportData)
    }
  } catch (error) {
    console.error('Data export error:', error)
    res.status(500).json({ error: 'Failed to export data' })
  }
}