import React, { useState } from 'react'
import { Copy, Share2, Mail, MessageCircle, Link2, CheckCircle } from 'lucide-react'
import Button from '../../common/Button/Button'
import Modal from '../../common/Modal/Modal'

const ShareModal = ({ isOpen, onClose, portfolioUrl = 'https://portfolio.example.com/johndoe' }) => {
  const [copied, setCopied] = useState(false)
  const [shareMethod, setShareMethod] = useState('link')

  const shareOptions = [
    {
      id: 'link',
      name: 'Copy Link',
      icon: Link2,
      description: 'Share via any platform'
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      description: 'Send via email'
    },
    {
      id: 'social',
      name: 'Social Media',
      icon: MessageCircle,
      description: 'Share on social platforms'
    }
  ]

  const socialPlatforms = [
    { name: 'LinkedIn', icon: '💼', color: 'bg-blue-600' },
    { name: 'Twitter', icon: '🐦', color: 'bg-blue-400' },
    { name: 'Facebook', icon: '📘', color: 'bg-blue-800' },
    { name: 'WhatsApp', icon: '💬', color: 'bg-green-500' }
  ]

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portfolioUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async (platform = null) => {
    if (platform) {
      // Platform-specific sharing logic
      console.log('Sharing to:', platform)
    } else {
      // Native share API
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'My Portfolio',
            text: 'Check out my professional portfolio',
            url: portfolioUrl,
          })
        } catch (err) {
          console.log('Error sharing:', err)
        }
      } else {
        handleCopyLink()
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Portfolio"
      size="md"
    >
      <div className="space-y-6">
        {/* Share Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Share via
          </label>
          <div className="grid grid-cols-3 gap-3">
            {shareOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => setShareMethod(option.id)}
                  className={`p-4 border rounded-lg text-center transition-all ${
                    shareMethod === option.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${
                    shareMethod === option.id ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                  <span className={`block text-sm font-medium ${
                    shareMethod === option.id ? 'text-primary-900' : 'text-gray-900'
                  }`}>
                    {option.name}
                  </span>
                  <span className="text-xs text-gray-500">{option.description}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Link Sharing */}
        {shareMethod === 'link' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portfolio Link
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={portfolioUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
              <Button
                variant={copied ? "success" : "primary"}
                icon={copied ? CheckCircle : Copy}
                onClick={handleCopyLink}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        )}

        {/* Email Sharing */}
        {shareMethod === 'email' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Addresses
            </label>
            <textarea
              placeholder="Enter email addresses separated by commas"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
            <Button variant="primary" icon={Mail} className="w-full mt-3">
              Send Emails
            </Button>
          </div>
        )}

        {/* Social Media Sharing */}
        {shareMethod === 'social' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Social Platforms
            </label>
            <div className="grid grid-cols-2 gap-3">
              {socialPlatforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handleShare(platform.name)}
                  className={`flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${platform.color}`}>
                    <span className="text-lg">{platform.icon}</span>
                  </div>
                  <span className="font-medium text-gray-900">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Options */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Advanced Options</h4>
              <p className="text-sm text-gray-500">Customize sharing settings</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            icon={Share2}
            onClick={() => handleShare()}
          >
            Share Now
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ShareModal