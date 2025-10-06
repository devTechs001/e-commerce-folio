import React from 'react'
import { Eye, Download, Share2, Smartphone, Monitor, Tablet } from 'lucide-react'
import Button from '../../common/Button/Button'

const Preview = ({ portfolioData, onView, onDownload, onShare }) => {
  const [device, setDevice] = React.useState('desktop')

  const deviceSizes = {
    mobile: 'w-80 h-[600px]',
    tablet: 'w-[768px] h-[1024px]',
    desktop: 'w-full h-[800px]'
  }

  const deviceFrames = {
    mobile: 'rounded-3xl border-8 border-gray-800',
    tablet: 'rounded-2xl border-8 border-gray-800',
    desktop: 'rounded-lg border border-gray-200'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Preview Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Portfolio Preview</h2>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={onView}
          >
            View Live
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={onDownload}
          >
            Export PDF
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Share2}
            onClick={onShare}
          >
            Share
          </Button>
        </div>
      </div>

      {/* Device Selector */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg border border-gray-200 p-1">
          {[
            { key: 'mobile', icon: Smartphone, label: 'Mobile' },
            { key: 'tablet', icon: Tablet, label: 'Tablet' },
            { key: 'desktop', icon: Monitor, label: 'Desktop' }
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setDevice(key)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                device === key
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex justify-center">
        <div className={`${deviceSizes[device]} ${deviceFrames[device]} bg-white overflow-hidden shadow-lg`}>
          {/* Mock Browser Bar for Desktop */}
          {device === 'desktop' && (
            <div className="flex items-center px-4 py-2 bg-gray-100 border-b border-gray-200">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex-1 mx-4 bg-white border border-gray-300 rounded px-3 py-1 text-xs text-gray-500">
                https://portfolio.example.com
              </div>
            </div>
          )}

          {/* Mock Status Bar for Mobile */}
          {device === 'mobile' && (
            <div className="bg-gray-800 text-white px-4 py-2 text-xs flex justify-between items-center">
              <span>9:41</span>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-2 bg-gray-600 rounded"></div>
                <div className="w-3 h-3 border border-white rounded-full"></div>
              </div>
            </div>
          )}

          {/* Preview Content */}
          <div className="h-full overflow-y-auto">
            {/* Hero Section Preview */}
            <div className="bg-gradient-to-br from-slate-900 to-primary-900 text-white p-6 text-center">
              <h1 className="text-2xl font-bold mb-2">
                {portfolioData?.about?.firstName} {portfolioData?.about?.lastName}
              </h1>
              <p className="text-primary-200 mb-4">
                {portfolioData?.about?.title || 'Professional Portfolio'}
              </p>
              <div className="flex justify-center space-x-3">
                <div className="w-20 h-1 bg-primary-400 rounded"></div>
                <div className="w-4 h-1 bg-primary-400 rounded"></div>
                <div className="w-20 h-1 bg-primary-400 rounded"></div>
              </div>
            </div>

            {/* About Section Preview */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {portfolioData?.about?.bio || 'Add your bio to introduce yourself to visitors...'}
              </p>
            </div>

            {/* Skills Preview */}
            {portfolioData?.skills && portfolioData.skills.length > 0 && (
              <div className="p-6 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.skills.slice(0, 4).map((skill, index) => (
                    <span
                      key={index}
                      className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {portfolioData.skills.length > 4 && (
                    <span className="bg-white px-3 py-1 rounded-full text-sm text-gray-500 border border-gray-200">
                      +{portfolioData.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Projects Preview */}
            {portfolioData?.projects && portfolioData.projects.length > 0 && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Projects</h2>
                <div className="space-y-4">
                  {portfolioData.projects.slice(0, 2).map((project, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Preview */}
            <div className="bg-gray-900 text-white p-6 text-center">
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} {portfolioData?.about?.firstName} {portfolioData?.about?.lastName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Notes */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> This is a preview of how your portfolio will appear to visitors. 
          Some elements may look different in the live version.
        </p>
      </div>
    </div>
  )
}

export default Preview