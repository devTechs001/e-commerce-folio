import React, { useState, useEffect } from 'react'
import { Bell, BellOff, Briefcase, DollarSign, MapPin, Clock, TrendingUp, X, Check, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { socketService } from '../../services/socket'
import { useAuth } from '../../context/AuthContext'
import jobMatchingService from '../../services/jobMatching'
import toast from 'react-hot-toast'

const JobNotifications = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showPanel, setShowPanel] = useState(false)

  useEffect(() => {
    // Listen for new job matches
    socketService.on('job_match', handleJobMatch)
    socketService.on('new_job_posted', handleNewJob)

    // Load existing notifications
    loadNotifications()

    return () => {
      socketService.off('job_match')
      socketService.off('new_job_posted')
    }
  }, [])

  const handleJobMatch = (data) => {
    const { job, matchPercentage } = data
    
    const notification = {
      id: Date.now(),
      type: 'job_match',
      job,
      matchPercentage,
      read: false,
      timestamp: new Date()
    }

    setNotifications(prev => [notification, ...prev])
    setUnreadCount(prev => prev + 1)

    // Show toast notification
    const message = jobMatchingService.getNotificationMessage(job, matchPercentage)
    toast.success(message, {
      duration: 5000,
      icon: matchPercentage >= 90 ? '🎯' : matchPercentage >= 80 ? '⭐' : '💼',
      action: {
        label: 'View',
        onClick: () => window.open(`/dashboard/freelancing/job/${job.id}`, '_blank')
      }
    })

    // Play notification sound (optional)
    playNotificationSound()
  }

  const handleNewJob = (job) => {
    // Calculate match percentage with user profile
    const userProfile = getUserProfile()
    const matchPercentage = jobMatchingService.calculateMatchPercentage(userProfile, job)

    if (matchPercentage >= 60) {
      handleJobMatch({ job, matchPercentage })
    }
  }

  const getUserProfile = () => {
    // Get user profile from context or localStorage
    return {
      skills: user?.skills || [],
      experienceYears: user?.experienceYears || 0,
      hourlyRate: user?.hourlyRate || 0,
      location: user?.location || '',
      availability: user?.availability || 'full-time'
    }
  }

  const loadNotifications = () => {
    // Load from localStorage or API
    const saved = localStorage.getItem('jobNotifications')
    if (saved) {
      const parsed = JSON.parse(saved)
      setNotifications(parsed)
      setUnreadCount(parsed.filter(n => !n.read).length)
    }
  }

  const saveNotifications = (notifs) => {
    localStorage.setItem('jobNotifications', JSON.stringify(notifs))
  }

  const markAsRead = (notificationId) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
      saveNotifications(updated)
      return updated
    })
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }))
      saveNotifications(updated)
      return updated
    })
    setUnreadCount(0)
  }

  const deleteNotification = (notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId)
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1))
      }
      const updated = prev.filter(n => n.id !== notificationId)
      saveNotifications(updated)
      return updated
    })
  }

  const clearAll = () => {
    setNotifications([])
    setUnreadCount(0)
    localStorage.removeItem('jobNotifications')
  }

  const playNotificationSound = () => {
    // Optional: Play notification sound
    try {
      const audio = new Audio('/notification.mp3')
      audio.volume = 0.3
      audio.play().catch(() => {
        // Ignore if audio playback fails
      })
    } catch (error) {
      // Ignore audio errors
    }
  }

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100'
    if (percentage >= 80) return 'text-blue-600 bg-blue-100'
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  const formatTimestamp = (date) => {
    const now = new Date()
    const diff = now - new Date(date)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString()
  }

  return (
    <>
      {/* Notification Bell Button */}
      <div className="relative">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Panel */}
        {showPanel && (
          <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">Job Notifications</h3>
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              {notifications.length > 0 && (
                <div className="flex items-center space-x-2 text-sm">
                  <button
                    onClick={markAllAsRead}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Mark all read
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={clearAll}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <BellOff className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-center">No job notifications yet</p>
                  <p className="text-sm text-gray-400 text-center mt-1">
                    We'll notify you when we find matching jobs
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-primary-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex-1">
                              <Link
                                to={`/dashboard/freelancing/job/${notification.job.id}`}
                                className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                                onClick={() => markAsRead(notification.id)}
                              >
                                {notification.job.title}
                              </Link>
                              <p className="text-sm text-gray-600 mt-0.5">
                                {notification.job.company}
                              </p>
                            </div>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors ml-2"
                            >
                              <X className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>

                          {/* Match Badge */}
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getMatchColor(notification.matchPercentage)}`}>
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {notification.matchPercentage}% Match
                            </span>
                          </div>

                          {/* Job Details */}
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                            {notification.job.budget && (
                              <span className="flex items-center">
                                <DollarSign className="w-3 h-3 mr-1" />
                                ${notification.job.budget.min}-${notification.job.budget.max}/hr
                              </span>
                            )}
                            {notification.job.location && (
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {notification.job.location}
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            <div className="flex items-center space-x-2">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center"
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Mark read
                                </button>
                              )}
                              <Link
                                to={`/dashboard/freelancing/job/${notification.job.id}`}
                                className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center"
                              >
                                View Job
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <Link
                  to="/dashboard/freelancing/notifications"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium text-center block"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default JobNotifications
