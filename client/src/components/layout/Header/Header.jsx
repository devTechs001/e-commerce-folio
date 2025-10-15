import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut, Bell, ChevronDown, Search, Palette, Zap, Users, BarChart3, Settings } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useNotification } from '../../../context/NotificationContext'
import Button from '../../common/Button/Button'
import NotificationPanel from '../../notifications/NotificationPanel'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { user, logout } = useAuth()
  const { unreadCount, notifications } = useNotification()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Templates', href: '/templates', hasMegaMenu: true },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
  ]

  const megaMenuItems = {
    templates: [
      {
        category: 'Popular Templates',
        items: [
          { name: 'Creative Portfolio', href: '/templates/creative', icon: <Palette className="h-4 w-4" /> },
          { name: 'Developer Portfolio', href: '/templates/developer', icon: <Zap className="h-4 w-4" /> },
          { name: 'Business Portfolio', href: '/templates/business', icon: <Users className="h-4 w-4" /> },
          { name: 'Template Gallery', href: '/dashboard/templates', icon: <BarChart3 className="h-4 w-4" /> }
        ]
      },
      {
        category: 'Tools & Features',
        items: [
          { name: 'AI Portfolio Generator', href: '/dashboard/ai-generator', icon: <Zap className="h-4 w-4" /> },
          { name: 'Template Builder', href: '/dashboard/templates/create', icon: <Palette className="h-4 w-4" /> },
          { name: 'Analytics Dashboard', href: '/dashboard/analytics-full', icon: <BarChart3 className="h-4 w-4" /> },
          { name: 'Revenue Dashboard', href: '/revenue', icon: <Settings className="h-4 w-4" /> }
        ]
      },
      {
        category: 'Workspace',
        items: [
          { name: 'Freelancing Hub', href: '/dashboard/freelancing', icon: <Users className="h-4 w-4" /> },
          { name: 'Messages', href: '/dashboard/messages', icon: <Zap className="h-4 w-4" /> },
          { name: 'Collaboration', href: '/dashboard/collaboration', icon: <Users className="h-4 w-4" /> },
          { name: 'Integrations', href: '/dashboard/integrations', icon: <Settings className="h-4 w-4" /> },
          { name: 'Email Marketing', href: '/dashboard/marketing', icon: <Settings className="h-4 w-4" /> },
          { name: 'Social Media', href: '/dashboard/social-media', icon: <Users className="h-4 w-4" /> },
          { name: 'Portfolio Editor', href: '/dashboard/portfolio-editor', icon: <Palette className="h-4 w-4" /> },
          { name: 'Help & Support', href: '/help', icon: <Settings className="h-4 w-4" /> }
        ]
      }
    ]
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary-600 to-blue-600 p-2 rounded-lg">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className={`text-xl font-bold ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                Folio
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasMegaMenu ? (
                    <div className="flex items-center">
                      <Link
                        to={item.href}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive(item.href)
                            ? 'text-primary-600 bg-primary-50'
                            : isScrolled 
                              ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50' 
                              : 'text-white/90 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {item.name}
                      </Link>
                      <button
                        onMouseEnter={() => setShowMegaMenu(true)}
                        onMouseLeave={() => setShowMegaMenu(false)}
                        className={`px-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isScrolled 
                            ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50' 
                            : 'text-white/90 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? 'text-primary-600 bg-primary-50'
                          : isScrolled 
                            ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50' 
                            : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mega Menu */}
          {showMegaMenu && (
            <div 
              className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-40"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-2 gap-8">
                  {megaMenuItems.templates.map((category, index) => (
                    <div key={index}>
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                        {category.category}
                      </h3>
                      <div className="space-y-2">
                        {category.items.map((menuItem, itemIndex) => (
                          <Link
                            key={itemIndex}
                            to={menuItem.href}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            onClick={() => setShowMegaMenu(false)}
                          >
                            <div className="text-primary-600 group-hover:text-primary-700">
                              {menuItem.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                              {menuItem.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Desktop Auth Section */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className={`p-2 rounded-lg transition-colors ${
                    isScrolled 
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Search className="h-5 w-5" />
                </button>

                {/* Search Dropdown */}
                {showSearch && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
                    <form onSubmit={handleSearch}>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search templates, features..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          autoFocus
                        />
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs text-gray-500">Press Enter to search</span>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-primary-600 text-white text-xs rounded-md hover:bg-primary-700 transition-colors"
                        >
                          Search
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {user ? (
                <>
                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className={`p-2 rounded-lg transition-colors relative ${
                        isScrolled 
                          ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.slice(0, 5).map((notification) => (
                              <div
                                key={notification.id}
                                className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                              >
                                <p className="text-sm text-gray-900">{notification.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-8 text-center">
                              <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">No notifications</p>
                            </div>
                          )}
                        </div>
                        <div className="px-4 py-2 border-t border-gray-200">
                          <Link
                            to="/dashboard"
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            View all notifications
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                        isScrolled 
                          ? 'text-gray-700 hover:bg-gray-100' 
                          : 'text-white/90 hover:bg-white/10'
                      }`}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user?.profile?.firstName?.[0]}{user?.profile?.lastName?.[0]}
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">
                            {user.profile.firstName} {user.profile.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/dashboard/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/dashboard/analytics-full"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Analytics
                        </Link>
                        <Link
                          to="/revenue"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Revenue
                        </Link>
                        <Link
                          to="/dashboard/integrations"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Integrations
                        </Link>
                        <Link
                          to="/dashboard/marketing"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Email Marketing
                        </Link>
                        <Link
                          to="/dashboard/social-media"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Social Media
                        </Link>
                        <Link
                          to="/dashboard/portfolio-editor"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Portfolio Editor
                        </Link>
                        <Link
                          to="/dashboard/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-200"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      isScrolled 
                        ? 'text-gray-700 hover:text-gray-900' 
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-primary-500 to-blue-500 text-white px-4 py-2 text-sm font-medium rounded-lg hover:from-primary-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled 
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white rounded-lg mt-2 shadow-xl border border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <>
                  <div className="border-t border-gray-200 pt-2 space-y-2">
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/ai-generator"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      AI Generator
                    </Link>
                    <Link
                      to="/dashboard/analytics-full"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Analytics
                    </Link>
                    <Link
                      to="/revenue"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Revenue
                    </Link>
                    <Link
                      to="/dashboard/integrations"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Integrations
                    </Link>
                    <Link
                      to="/dashboard/marketing"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Email Marketing
                    </Link>
                    <Link
                      to="/dashboard/social-media"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Social Media
                    </Link>
                    <Link
                      to="/dashboard/portfolio-editor"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Portfolio Editor
                    </Link>
                    <Link
                      to="/dashboard/freelancing"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Freelancing
                    </Link>
                    <Link
                      to="/help"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Help
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-2 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-lg text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      
      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </header>
  )
}

export default Header