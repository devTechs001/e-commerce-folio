/**
 * Job Matching Service
 * Matches jobs with user profiles and calculates compatibility scores
 */

class JobMatchingService {
  /**
   * Calculate match percentage between user profile and job
   * @param {Object} profile - User profile with skills, experience, preferences
   * @param {Object} job - Job listing details
   * @returns {number} Match percentage (0-100)
   */
  calculateMatchPercentage(profile, job) {
    let score = 0
    let maxScore = 100

    // Skills matching (40 points)
    if (profile.skills && job.requiredSkills) {
      const userSkills = profile.skills.map(s => s.toLowerCase())
      const jobSkills = job.requiredSkills.map(s => s.toLowerCase())
      const matchedSkills = jobSkills.filter(skill => 
        userSkills.some(us => us.includes(skill) || skill.includes(us))
      )
      score += (matchedSkills.length / jobSkills.length) * 40
    }

    // Experience level matching (20 points)
    if (profile.experienceYears && job.experienceRequired) {
      const expDiff = Math.abs(profile.experienceYears - job.experienceRequired)
      if (expDiff === 0) score += 20
      else if (expDiff <= 1) score += 15
      else if (expDiff <= 2) score += 10
      else if (expDiff <= 3) score += 5
    }

    // Budget matching (20 points)
    if (profile.hourlyRate && job.budget) {
      const budgetMin = job.budget.min || 0
      const budgetMax = job.budget.max || Infinity
      if (profile.hourlyRate >= budgetMin && profile.hourlyRate <= budgetMax) {
        score += 20
      } else if (Math.abs(profile.hourlyRate - budgetMin) / budgetMin < 0.2) {
        score += 10
      }
    }

    // Location matching (10 points)
    if (profile.location && job.location) {
      if (job.location.toLowerCase() === 'remote' || 
          profile.location.toLowerCase() === job.location.toLowerCase()) {
        score += 10
      }
    }

    // Availability matching (10 points)
    if (profile.availability && job.availability) {
      if (profile.availability === job.availability) {
        score += 10
      } else if (
        (profile.availability === 'full-time' && job.availability === 'part-time') ||
        (profile.availability === 'part-time' && job.availability === 'full-time')
      ) {
        score += 5
      }
    }

    return Math.round(Math.min(score, 100))
  }

  /**
   * Match jobs for a user profile
   * @param {Object} profile - User profile
   * @param {Array} jobs - Available jobs
   * @param {number} minMatchPercentage - Minimum match percentage to include
   * @returns {Array} Matched jobs with scores
   */
  matchJobs(profile, jobs, minMatchPercentage = 60) {
    if (!profile || !jobs || jobs.length === 0) return []

    const matchedJobs = jobs.map(job => ({
      ...job,
      matchPercentage: this.calculateMatchPercentage(profile, job)
    }))

    return matchedJobs
      .filter(job => job.matchPercentage >= minMatchPercentage)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
  }

  /**
   * Get notification message for job match
   * @param {Object} job - Matched job
   * @param {number} matchPercentage - Match percentage
   * @returns {string} Notification message
   */
  getNotificationMessage(job, matchPercentage) {
    if (matchPercentage >= 90) {
      return `🎯 Perfect match! ${job.title} - ${matchPercentage}% compatibility`
    } else if (matchPercentage >= 80) {
      return `⭐ Great match! ${job.title} - ${matchPercentage}% compatibility`
    } else if (matchPercentage >= 70) {
      return `👍 Good match: ${job.title} - ${matchPercentage}% compatibility`
    } else {
      return `💼 New opportunity: ${job.title} - ${matchPercentage}% match`
    }
  }

  /**
   * Check if job matches user preferences
   * @param {Object} job - Job listing
   * @param {Object} preferences - User notification preferences
   * @returns {boolean} Should notify user
   */
  shouldNotify(job, preferences) {
    if (!preferences) return true

    // Check job category filter
    if (preferences.categories && preferences.categories.length > 0) {
      if (!preferences.categories.includes(job.category)) return false
    }

    // Check salary range filter
    if (preferences.minSalary && job.budget && job.budget.max < preferences.minSalary) {
      return false
    }

    // Check location filter
    if (preferences.locations && preferences.locations.length > 0) {
      if (!preferences.locations.includes(job.location) && job.location !== 'remote') {
        return false
      }
    }

    // Check job type filter
    if (preferences.jobTypes && preferences.jobTypes.length > 0) {
      if (!preferences.jobTypes.includes(job.type)) return false
    }

    return true
  }
}

const jobMatchingService = new JobMatchingService()
export default jobMatchingService
export { jobMatchingService }
