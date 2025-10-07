import { socketService } from './socket'
import { realTimeService } from './realtime'
import toast from 'react-hot-toast'

class UpdateService {
  constructor() {
    this.updateCallbacks = new Map()
    this.isInitialized = false
  }

  // Initialize automatic updates
  init(user) {
    if (this.isInitialized) return
    
    if (!user || !user.email) {
      console.warn('UpdateService: User data is invalid', user)
      return
    }
    
    this.user = user
    this.userEmail = user.email
    this.setupUpdateListeners()
    this.startPeriodicUpdates()
    this.isInitialized = true
    
    console.log('✅ Update service initialized for user:', user.email)
  }

  // Setup real-time update listeners
  setupUpdateListeners() {
    // Job updates
    socketService.on('job_posted', (job) => {
      this.handleJobUpdate('posted', job)
      this.notifySubscribers('job_posted', job)
    })

    socketService.on('job_updated', (job) => {
      this.handleJobUpdate('updated', job)
      this.notifySubscribers('job_updated', job)
    })

    // User updates
    socketService.on('user_online', (userId) => {
      this.notifySubscribers('user_online', userId)
    })

    socketService.on('user_offline', (userId) => {
      this.notifySubscribers('user_offline', userId)
    })

    // Analytics updates
    socketService.on('analytics_updated', (data) => {
      this.notifySubscribers('analytics_updated', data)
    })

    socketService.on('visitor_tracked', (data) => {
      this.notifySubscribers('visitor_tracked', data)
    })

    // Message updates
    socketService.on('private_message', (message) => {
      this.handleNewMessage(message)
      this.notifySubscribers('private_message', message)
    })

    // Proposal updates
    socketService.on('new_proposal', (data) => {
      this.handleNewProposal(data)
      this.notifySubscribers('new_proposal', data)
    })
  }

  // Handle job updates with notifications
  handleJobUpdate(type, job) {
    if (!this.user) return

    // Check if job matches user's skills
    const userSkills = this.user.profile?.skills || []
    const jobSkills = job.skills || []
    const hasMatchingSkills = jobSkills.some(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    )

    if (hasMatchingSkills && type === 'posted') {
      toast.success(`New job matches your skills: ${job.title}`, {
        duration: 5000,
        action: {
          label: 'View',
          onClick: () => window.location.href = `/dashboard/freelancing`
        }
      })
    }
  }

  // Handle new messages
  handleNewMessage(message) {
    if (!this.user || message.senderId === this.user.id) return

    // Show notification for new message
    toast(`New message from ${message.senderName}`, {
      icon: '💬',
      duration: 4000,
      action: {
        label: 'Reply',
        onClick: () => window.location.href = `/dashboard/messages/${message.senderId}`
      }
    })
  }

  // Handle new proposals
  handleNewProposal(data) {
    if (!this.user || data.jobOwnerId !== this.user.id) return

    toast.success(`New proposal received for "${data.jobTitle}"`, {
      duration: 5000,
      action: {
        label: 'View',
        onClick: () => window.location.href = `/dashboard/freelancing/job/${data.jobId}`
      }
    })
  }

  // Start periodic updates for data that doesn't have real-time events
  startPeriodicUpdates() {
    // Update analytics every 5 minutes
    setInterval(() => {
      this.updateAnalytics()
    }, 5 * 60 * 1000)

    // Update user status every 2 minutes
    setInterval(() => {
      this.updateUserStatus()
    }, 2 * 60 * 1000)

    // Sync user data every 10 minutes
    setInterval(() => {
      this.syncUserData()
    }, 10 * 60 * 1000)
  }

  // Update analytics data
  async updateAnalytics() {
    try {
      const data = await realTimeService.getAnalytics()
      this.notifySubscribers('analytics_periodic_update', data)
    } catch (error) {
      console.error('Failed to update analytics:', error)
    }
  }

  // Update user online status
  updateUserStatus() {
    if (socketService.isConnected) {
      socketService.emit('user_heartbeat', {
        userId: this.user?.id,
        timestamp: Date.now()
      })
    }
  }

  // Sync user data from server
  async syncUserData() {
    try {
      // This would fetch latest user data from server
      // and update local storage/context if needed
      console.log('Syncing user data...')
    } catch (error) {
      console.error('Failed to sync user data:', error)
    }
  }

  // Subscribe to updates
  subscribe(event, callback) {
    if (!this.updateCallbacks.has(event)) {
      this.updateCallbacks.set(event, new Set())
    }
    this.updateCallbacks.get(event).add(callback)
  }

  // Unsubscribe from updates
  unsubscribe(event, callback) {
    if (this.updateCallbacks.has(event)) {
      this.updateCallbacks.get(event).delete(callback)
    }
  }

  // Notify subscribers
  notifySubscribers(event, data) {
    if (this.updateCallbacks.has(event)) {
      this.updateCallbacks.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in update callback for ${event}:`, error)
        }
      })
    }
  }

  // Force refresh data
  async refreshAll() {
    try {
      // Refresh analytics
      const analytics = await realTimeService.getAnalytics()
      this.notifySubscribers('analytics_refreshed', analytics)

      // Refresh jobs if user is on freelancing page
      if (window.location.pathname.includes('/freelancing')) {
        const jobs = await realTimeService.getFreelancingJobs()
        this.notifySubscribers('jobs_refreshed', jobs)
      }

      // Refresh messages if user is on messages page
      if (window.location.pathname.includes('/messages')) {
        // Would refresh conversations
        this.notifySubscribers('messages_refreshed', {})
      }

      toast.success('Data refreshed successfully!')
    } catch (error) {
      toast.error('Failed to refresh data')
      console.error('Refresh error:', error)
    }
  }

  // Check for app updates
  async checkForAppUpdates() {
    try {
      // This would check for new app version
      const response = await fetch('/api/version')
      const { version, hasUpdate } = await response.json()
      
      if (hasUpdate) {
        toast('New app version available!', {
          duration: 0, // Don't auto-dismiss
          action: {
            label: 'Refresh',
            onClick: () => window.location.reload()
          }
        })
      }
    } catch (error) {
      console.error('Failed to check for updates:', error)
    }
  }

  // Cleanup
  destroy() {
    this.updateCallbacks.clear()
    this.isInitialized = false
  }
}

export const updateService = new UpdateService()
export default updateService
