import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const Breadcrumb = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <Link to="/" className="flex items-center hover:text-gray-700">
        <Home className="h-4 w-4" />
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        
        return (
          <div key={to} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="text-gray-900 font-medium capitalize">
                {value.replace(/-/g, ' ')}
              </span>
            ) : (
              <Link to={to} className="hover:text-gray-700 capitalize">
                {value.replace(/-/g, ' ')}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default Breadcrumb