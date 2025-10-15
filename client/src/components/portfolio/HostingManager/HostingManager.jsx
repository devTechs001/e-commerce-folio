import React, { useState, useEffect } from 'react'
import { 
  Globe, Server, Link as LinkIcon, Zap, Shield, CheckCircle,
  AlertCircle, Copy, ExternalLink, Settings, Crown, RefreshCw,
  Download, Upload, Code, Lock, TrendingUp
} from 'lucide-react'
import { subscriptionService } from '../../../services/subscription'
import Button from '../../common/Button/Button'

const HostingManager = ({ portfolioId, portfolioData }) => {
  const [hostingStatus, setHostingStatus] = useState({
    isPublished: false,
    customDomain: '',
    defaultUrl: `${portfolioId}.efolio.app`,
    sslEnabled: true,
    lastPublished: null,
    deploymentStatus: 'ready', // ready, deploying, failed
    bandwidth: 0,
    visitors: 0,
    storageUsed: 0
  })

  const [userTier, setUserTier] = useState('free')
  const [showDomainSetup, setShowDomainSetup] = useState(false)
  const [customDomainInput, setCustomDomainInput] = useState('')
  const [deploying, setDeploying] = useState(false)

  useEffect(() => {
    const checkTier = async () => {
      const tier = await subscriptionService.getUserTier()
      setUserTier(tier)
    }
    checkTier()
  }, [])

  const isPremium = ['premium', 'professional', 'enterprise'].includes(userTier)

  const hostingProviders = [
    {
      id: 'netlify',
      name: 'Netlify',
      icon: Globe,
      description: 'Fast, reliable hosting with automatic deployments',
      free: true,
      features: ['Free SSL', 'CDN', 'Automatic Deployment']
    },
    {
      id: 'vercel',
      name: 'Vercel',
      icon: Zap,
      description: 'Optimized for performance and speed',
      free: true,
      features: ['Edge Network', 'Analytics', 'Preview Deployments']
    },
    {
      id: 'github',
      name: 'GitHub Pages',
      icon: Code,
      description: 'Host directly from your GitHub repository',
      free: true,
      features: ['Free Hosting', 'Custom Domain', 'Version Control']
    },
    {
      id: 'custom',
      name: 'Custom Domain',
      icon: LinkIcon,
      description: 'Use your own domain name',
      free: false,
      premium: true,
      features: ['Professional URL', 'SSL Certificate', 'Email Support']
    }
  ]

  const handlePublish = async () => {
    setDeploying(true)
    setHostingStatus({ ...hostingStatus, deploymentStatus: 'deploying' })

    // Simulate deployment
    setTimeout(() => {
      setHostingStatus({
        ...hostingStatus,
        isPublished: true,
        deploymentStatus: 'ready',
        lastPublished: new Date()
      })
      setDeploying(false)
    }, 3000)
  }

  const handleUnpublish = () => {
    setHostingStatus({
      ...hostingStatus,
      isPublished: false,
      deploymentStatus: 'ready'
    })
  }

  const connectCustomDomain = () => {
    if (!isPremium) {
      alert('Custom domains require a Premium subscription')
      return
    }

    if (customDomainInput.trim()) {
      setHostingStatus({
        ...hostingStatus,
        customDomain: customDomainInput.trim()
      })
      setShowDomainSetup(false)
      setCustomDomainInput('')
    }
  }

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url)
    alert('URL copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hosting & Deployment</h2>
          <p className="text-gray-600">Publish your portfolio and manage hosting</p>
        </div>
        <div className="flex items-center space-x-2">
          {hostingStatus.isPublished ? (
            <>
              <Button
                onClick={handlePublish}
                icon={RefreshCw}
                variant="outline"
                loading={deploying}
              >
                Redeploy
              </Button>
              <Button onClick={handleUnpublish} variant="outline">
                Unpublish
              </Button>
            </>
          ) : (
            <Button
              onClick={handlePublish}
              icon={Upload}
              loading={deploying}
            >
              Publish Portfolio
            </Button>
          )}
        </div>
      </div>

      {/* Deployment Status */}
      {hostingStatus.deploymentStatus === 'deploying' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
          <RefreshCw className="h-5 w-5 text-blue-600 animate-spin flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Deploying...</h4>
            <p className="text-sm text-blue-700">Your portfolio is being deployed. This usually takes 1-2 minutes.</p>
          </div>
        </div>
      )}

      {hostingStatus.isPublished && hostingStatus.deploymentStatus === 'ready' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-green-900">Live & Published!</h4>
            <p className="text-sm text-green-700 mb-3">
              Your portfolio is live and accessible at the following URL
            </p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-white border border-green-200 rounded-lg px-4 py-2 flex items-center justify-between">
                <span className="text-sm font-mono text-gray-900">
                  {hostingStatus.customDomain || hostingStatus.defaultUrl}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyUrl(hostingStatus.customDomain || hostingStatus.defaultUrl)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy className="h-4 w-4 text-gray-600" />
                  </button>
                  <a
                    href={`https://${hostingStatus.customDomain || hostingStatus.defaultUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ExternalLink className="h-4 w-4 text-gray-600" />
                  </a>
                </div>
              </div>
            </div>
            {hostingStatus.lastPublished && (
              <p className="text-xs text-green-600 mt-2">
                Last published: {new Date(hostingStatus.lastPublished).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      {hostingStatus.isPublished && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{hostingStatus.visitors.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bandwidth Used</p>
                <p className="text-2xl font-bold text-gray-900">{hostingStatus.bandwidth} GB</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Server className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Storage</p>
                <p className="text-2xl font-bold text-gray-900">{hostingStatus.storageUsed} MB</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Domain Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <LinkIcon className="h-5 w-5" />
              <span>Custom Domain</span>
              {!isPremium && <Crown className="h-5 w-5 text-yellow-500" />}
            </h3>
            <p className="text-sm text-gray-600">Connect your own domain name</p>
          </div>
          {isPremium && (
            <Button
              onClick={() => setShowDomainSetup(!showDomainSetup)}
              variant="outline"
              size="sm"
              icon={Settings}
            >
              {hostingStatus.customDomain ? 'Change Domain' : 'Setup Domain'}
            </Button>
          )}
        </div>

        {hostingStatus.customDomain ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">{hostingStatus.customDomain}</p>
                <p className="text-sm text-green-700">SSL Certificate Active</p>
              </div>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        ) : !isPremium ? (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 text-center">
            <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Premium Feature</h4>
            <p className="text-gray-600 mb-4">
              Connect custom domains with SSL certificates on Premium plans
            </p>
            <Button onClick={() => window.location.href = '/pricing'}>
              Upgrade to Premium
            </Button>
          </div>
        ) : showDomainSetup ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Domain Name
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="www.yourdomain.com"
                  value={customDomainInput}
                  onChange={(e) => setCustomDomainInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <Button onClick={connectCustomDomain}>
                  Connect
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span>DNS Configuration Required</span>
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                Add these DNS records to your domain provider:
              </p>
              <div className="bg-white rounded border border-blue-200 p-3 font-mono text-xs space-y-1">
                <div>Type: CNAME</div>
                <div>Name: www</div>
                <div>Value: {hostingStatus.defaultUrl}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No custom domain configured</p>
            <Button onClick={() => setShowDomainSetup(true)} variant="outline" size="sm">
              Setup Custom Domain
            </Button>
          </div>
        )}
      </div>

      {/* Hosting Providers */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hosting Providers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hostingProviders.map((provider) => {
            const Icon = provider.icon
            const canUse = !provider.premium || isPremium

            return (
              <div
                key={provider.id}
                className={`p-6 rounded-xl border-2 transition-all ${
                  canUse
                    ? 'border-gray-200 hover:border-primary-300 cursor-pointer'
                    : 'border-gray-200 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                      {provider.free && (
                        <span className="text-xs text-green-600 font-medium">Free</span>
                      )}
                    </div>
                  </div>
                  {provider.premium && !isPremium && (
                    <Crown className="h-5 w-5 text-yellow-500" />
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4">{provider.description}</p>

                <div className="space-y-2 mb-4">
                  {provider.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={canUse ? 'primary' : 'outline'}
                  size="sm"
                  className="w-full"
                  disabled={!canUse}
                  onClick={() => canUse && alert(`Connect to ${provider.name} - Coming Soon!`)}
                >
                  {canUse ? 'Connect' : 'Premium Required'}
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      {/* SSL Certificate */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">SSL Certificate</h3>
              <p className="text-sm text-gray-600">Your portfolio is secured with HTTPS</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Active</span>
          </div>
        </div>

        {hostingStatus.sslEnabled && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Secure Connection Enabled</p>
                <p>Your portfolio is protected with industry-standard SSL/TLS encryption</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Download Portfolio */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Download Portfolio</h3>
            <p className="text-sm text-gray-600">Export your portfolio as static HTML files</p>
          </div>
          <Button icon={Download} variant="outline">
            Download ZIP
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HostingManager
