import FreelancingJob from '../models/FreelancingJob.js'
import User from '../models/User.js'
import { socketService } from '../socket/socketService.js'
import { notificationService } from './notificationService.js'
import { emailService } from './emailService.js'

class FreelancingService {
  // Job matching algorithm
  async getMatchingJobs(userId, limit = 10) {
    try {
      const user = await User.findById(userId)
      if (!user || !user.profile.skills) {
        return []
      }

      const userSkills = user.profile.skills
      const jobs = await FreelancingJob.find({
        status: 'active',
        skills: { $in: userSkills },
        postedBy: { $ne: userId }
      })
      .populate('postedBy', 'profile')
      .sort({ createdAt: -1 })
      .limit(limit)

      return jobs
    } catch (error) {
      throw new Error(`Error finding matching jobs: ${error.message}`)
    }
  }

  // Freelancer recommendations
  async getRecommendedFreelancers(jobId, limit = 5) {
    try {
      const job = await FreelancingJob.findById(jobId)
      if (!job) {
        throw new Error('Job not found')
      }

      const freelancers = await User.find({
        role: 'user',
        'profile.isFreelancer': true,
        'profile.skills': { $in: job.skills },
        _id: { $ne: job.postedBy }
      })
      .select('profile email')
      .sort({ 'profile.rating': -1 })
      .limit(limit)

      return freelancers
    } catch (error) {
      throw new Error(`Error finding recommended freelancers: ${error.message}`)
    }
  }

  // Send job notifications
  async notifyMatchingFreelancers(jobId) {
    try {
      const job = await FreelancingJob.findById(jobId).populate('postedBy', 'profile')
      if (!job) return

      const matchingFreelancers = await User.find({
        role: 'user',
        'profile.isFreelancer': true,
        'profile.skills': { $in: job.skills },
        _id: { $ne: job.postedBy }
      })

      for (const freelancer of matchingFreelancers) {
        // Create notification
        await notificationService.create({
          userId: freelancer._id,
          type: 'job_match',
          title: 'New Job Match',
          message: `A new job "${job.title}" matches your skills`,
          data: { jobId: job._id }
        })

        // Send real-time notification
        socketService.to(freelancer._id.toString()).emit('job_notification', {
          type: 'match',
          job: {
            id: job._id,
            title: job.title,
            budgetRange: job.budgetRange
          }
        })

        // Send email if enabled
        if (freelancer.preferences?.emailNotifications?.jobMatches) {
          await emailService.sendJobMatchNotification(freelancer.email, job)
        }
      }
    } catch (error) {
      console.error('Error notifying matching freelancers:', error)
    }
  }

  // Update job statistics
  async updateJobStats(jobId, action) {
    try {
      const updates = {}
      
      switch (action) {
        case 'view':
          updates.$inc = { views: 1 }
          break
        case 'save':
          // This would be handled in the controller with $addToSet
          break
        case 'unsave':
          // This would be handled in the controller with $pull
          break
      }

      if (Object.keys(updates).length > 0) {
        await FreelancingJob.findByIdAndUpdate(jobId, updates)
      }
    } catch (error) {
      console.error('Error updating job stats:', error)
    }
  }

  // Get job analytics
  async getJobAnalytics(userId) {
    try {
      const jobs = await FreelancingJob.find({ postedBy: userId })

      const analytics = {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(j => j.status === 'active').length,
        completedJobs: jobs.filter(j => j.status === 'completed').length,
        totalProposals: jobs.reduce((sum, job) => sum + job.proposals.length, 0),
        totalViews: jobs.reduce((sum, job) => sum + job.views, 0),
        averageProposalsPerJob: 0
      }

      if (analytics.totalJobs > 0) {
        analytics.averageProposalsPerJob = Math.round(analytics.totalProposals / analytics.totalJobs)
      }

      return analytics
    } catch (error) {
      throw new Error(`Error getting job analytics: ${error.message}`)
    }
  }

  // Get freelancer analytics
  async getFreelancerAnalytics(userId) {
    try {
      const proposalsSubmitted = await FreelancingJob.countDocuments({
        'proposals.freelancer': userId
      })

      const acceptedProposals = await FreelancingJob.countDocuments({
        'proposals.freelancer': userId,
        'proposals.status': 'accepted'
      })

      const completedJobs = await FreelancingJob.countDocuments({
        selectedFreelancer: userId,
        status: 'completed'
      })

      const analytics = {
        proposalsSubmitted,
        acceptedProposals,
        completedJobs,
        successRate: proposalsSubmitted > 0 ? Math.round((acceptedProposals / proposalsSubmitted) * 100) : 0
      }

      return analytics
    } catch (error) {
      throw new Error(`Error getting freelancer analytics: ${error.message}`)
    }
  }

  // Search jobs with advanced filters
  async searchJobs(filters) {
    try {
      const {
        search,
        skills,
        category,
        budgetMin,
        budgetMax,
        budgetType,
        experienceLevel,
        duration,
        isUrgent,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = filters

      let query = { status: 'active' }

      // Text search
      if (search) {
        query.$text = { $search: search }
      }

      // Skills filter
      if (skills && skills.length > 0) {
        query.skills = { $in: skills }
      }

      // Category filter
      if (category) {
        query.category = category
      }

      // Budget filter
      if (budgetMin !== undefined) {
        query.budgetMin = { $gte: budgetMin }
      }
      if (budgetMax !== undefined) {
        query.budgetMax = { $lte: budgetMax }
      }

      // Budget type filter
      if (budgetType) {
        query.budgetType = budgetType
      }

      // Experience level filter
      if (experienceLevel) {
        query.experienceLevel = experienceLevel
      }

      // Duration filter
      if (duration) {
        query.duration = duration
      }

      // Urgent filter
      if (isUrgent !== undefined) {
        query.isUrgent = isUrgent
      }

      // Sort options
      const sortOptions = {}
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1

      const jobs = await FreelancingJob.find(query)
        .populate('postedBy', 'profile email')
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit)

      const total = await FreelancingJob.countDocuments(query)

      return {
        jobs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalJobs: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    } catch (error) {
      throw new Error(`Error searching jobs: ${error.message}`)
    }
  }

  // Auto-close expired jobs
  async closeExpiredJobs() {
    try {
      const expiredJobs = await FreelancingJob.find({
        status: 'active',
        deadline: { $lt: new Date() }
      })

      for (const job of expiredJobs) {
        job.status = 'cancelled'
        await job.save()

        // Notify job poster
        await notificationService.create({
          userId: job.postedBy,
          type: 'job_expired',
          title: 'Job Expired',
          message: `Your job "${job.title}" has expired and been closed`,
          data: { jobId: job._id }
        })
      }

      return expiredJobs.length
    } catch (error) {
      console.error('Error closing expired jobs:', error)
      return 0
    }
  }
}

export const freelancingService = new FreelancingService()
export default freelancingService
