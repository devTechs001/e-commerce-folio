import Integration from '../models/Integration.js'
import Portfolio from '../models/Portfolio.js'

export const getIntegrations = async (req, res) => {
  try {
    const integrations = await Integration.find({ userId: req.user.id })

    res.json({
      integrations: integrations.map(integration => ({
        id: integration._id,
        platform: integration.platform,
        status: integration.status,
        connectedAt: integration.connectedAt,
        settings: integration.settings
      }))
    })
  } catch (error) {
    console.error('Get integrations error:', error)
    res.status(500).json({ error: 'Failed to fetch integrations' })
  }
}

export const connectIntegration = async (req, res) => {
  try {
    const { platform, credentials, settings = {} } = req.body

    // Check if integration already exists
    const existingIntegration = await Integration.findOne({
      userId: req.user.id,
      platform
    })

    if (existingIntegration) {
      return res.status(400).json({ error: 'Integration already connected' })
    }

    // Validate credentials based on platform
    const validationResult = await validateIntegrationCredentials(platform, credentials)
    if (!validationResult.valid) {
      return res.status(400).json({ error: validationResult.message })
    }

    const integration = new Integration({
      userId: req.user.id,
      platform,
      credentials,
      settings,
      status: 'connected',
      connectedAt: new Date()
    })

    await integration.save()

    res.status(201).json({
      success: true,
      integration: {
        id: integration._id,
        platform: integration.platform,
        status: integration.status,
        connectedAt: integration.connectedAt
      }
    })
  } catch (error) {
    console.error('Connect integration error:', error)
    res.status(500).json({ error: 'Failed to connect integration' })
  }
}

export const disconnectIntegration = async (req, res) => {
  try {
    const { integrationId } = req.params

    const integration = await Integration.findOneAndDelete({
      _id: integrationId,
      userId: req.user.id
    })

    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' })
    }

    res.json({ success: true, message: 'Integration disconnected successfully' })
  } catch (error) {
    console.error('Disconnect integration error:', error)
    res.status(500).json({ error: 'Failed to disconnect integration' })
  }
}

export const syncToPlatform = async (req, res) => {
  try {
    const { integrationId, portfolioId } = req.params

    const integration = await Integration.findOne({
      _id: integrationId,
      userId: req.user.id
    })

    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' })
    }

    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId: req.user.id
    })

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' })
    }

    // Sync portfolio to external platform
    const syncResult = await syncPortfolioToPlatform(integration, portfolio)

    res.json({
      success: true,
      message: 'Portfolio synced successfully',
      platform: integration.platform,
      result: syncResult
    })
  } catch (error) {
    console.error('Sync integration error:', error)
    res.status(500).json({ error: 'Failed to sync portfolio' })
  }
}

// Helper functions
const validateIntegrationCredentials = async (platform, credentials) => {
  // This would validate credentials with the actual platform API
  switch (platform) {
    case 'linkedin':
      return { valid: true, message: 'LinkedIn credentials validated' }
    case 'github':
      return { valid: true, message: 'GitHub credentials validated' }
    case 'wordpress':
      return { valid: true, message: 'WordPress credentials validated' }
    default:
      return { valid: false, message: 'Unsupported platform' }
  }
}

const syncPortfolioToPlatform = async (integration, portfolio) => {
  // This would sync the portfolio to the external platform
  // For now, return a mock response
  return {
    url: `https://${integration.platform}.com/portfolio/${portfolio.slug}`,
    syncedAt: new Date(),
    status: 'success'
  }
}