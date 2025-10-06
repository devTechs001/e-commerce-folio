import React from 'react'
import { Link, useRouteError } from 'react-router-dom'
import { Home, RefreshCw, AlertCircle, Search, Server } from 'lucide-react'
import Button from '../../components/common/Button/Button'

const Error = () => {
  const error = useRouteError()
  const status = error?.status || 404
  const message = error?.data?.message || getErrorMessage(status)

  function getErrorMessage(status) {
    switch (status) {
      case 404:
        return "The page you're looking for doesn't exist."
      case 500:
        return "Something went wrong on our end. Please try again later."
      case 403:
        return "You don't have permission to access this page."
      case 401:
        return "Please log in to access this page."
      default:
        return "An unexpected error occurred."
    }
  }

  function getErrorTitle(status) {
    switch (status) {
      case 404:
        return "Page Not Found"
      case 500:
        return "Server Error"
      case 403:
        return "Access Denied"
      case 401:
        return "Unauthorized"
      default:
        return "Error"
    }
  }

  function getErrorIcon(status) {
    switch (status) {
      case 404:
        return <Search className="h-16 w-16" />
      case 500:
        return <Server className="h-16 w-16" />
      default:
        return <AlertCircle className="h-16 w-16" />
    }
  }

  const suggestions = {
    404: [
      'Check the URL for typos',
      'Go back to the previous page',
      'Visit our homepage',
      'Browse our templates'
    ],
    500: [
      'Try refreshing the page',
      'Wait a few minutes and try again',
      'Check our status page',
      'Contact support if the problem persists'
    ],
    403: [
      'Check if you are logged in',
      'Verify your account permissions',
      'Contact the portfolio owner',
      'Go back to the homepage'
    ],
    401: [
      'Log in to your account',
      'Check your credentials',
      'Reset your password if needed',
      'Contact support for help'
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        {/* Error Icon */}
        <div className="mx-auto flex items-center justify-center h-32 w-32 rounded-full bg-white shadow-lg border border-gray-200 mb-8">
          <div className="text-primary-600">
            {getErrorIcon(status)}
          </div>
        </div>

        {/* Error Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            {status}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {getErrorTitle(status)}
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            {message}
          </p>

          {/* Suggestions */}
          {suggestions[status] && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-primary-600 mr-2" />
                Here are some things you can try:
              </h3>
              <ul className="space-y-2">
                {suggestions[status].map((suggestion, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              icon={Home}
              href="/"
            >
              Go Home
            </Button>
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm mb-4">
              Need more help?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/contact"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                Contact Support
              </Link>
              <span className="text-gray-300 hidden sm:block">•</span>
              <Link
                to="/templates"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                Browse Templates
              </Link>
              <span className="text-gray-300 hidden sm:block">•</span>
              <Link
                to="/pricing"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>

        {/* Error Details (Development) */}
        {import.meta.env.DEV && error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">Error Details (Development):</h4>
            <pre className="text-sm text-red-700 overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default Error