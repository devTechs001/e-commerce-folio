import FreelancingJob from '../models/FreelancingJob.js'
import User from '../models/User.js'
import { socketService } from '../socket/socketService.js'

// Get all jobs
export const getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, skills, budget } = req.query
    
    let query = { status: 'active' }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (skills) {
      query.skills = { $in: skills.split(',') }
    }
    
    if (budget) {
      const [min, max] = budget.split('-').map(Number)
      query.budgetMin = { $gte: min }
      if (max) query.budgetMax = { $lte: max }
    }
    
    const jobs = await FreelancingJob.find(query)
      .populate('postedBy', 'profile email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
    
    const total = await FreelancingJob.countDocuments(query)
    
    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get single job
export const getJob = async (req, res) => {
  try {
    const job = await FreelancingJob.findById(req.params.id)
      .populate('postedBy', 'profile email')
      .populate('proposals.freelancer', 'profile')
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }
    
    res.json(job)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Create new job
export const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user.id
    }
    
    const job = new FreelancingJob(jobData)
    await job.save()
    
    await job.populate('postedBy', 'profile email')
    
    // Emit real-time update
    socketService.broadcast('job_posted', job)
    
    res.status(201).json(job)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Update job
export const updateJob = async (req, res) => {
  try {
    const job = await FreelancingJob.findById(req.params.id)
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }
    
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' })
    }
    
    Object.assign(job, req.body)
    await job.save()
    
    await job.populate('postedBy', 'profile email')
    
    // Emit real-time update
    socketService.broadcast('job_updated', job)
    
    res.json(job)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const job = await FreelancingJob.findById(req.params.id)
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }
    
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' })
    }
    
    await job.deleteOne()
    
    // Emit real-time update
    socketService.broadcast('job_deleted', { id: req.params.id })
    
    res.json({ message: 'Job deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Submit proposal
export const submitProposal = async (req, res) => {
  try {
    const job = await FreelancingJob.findById(req.params.id)
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }
    
    // Check if user already submitted proposal
    const existingProposal = job.proposals.find(
      p => p.freelancer.toString() === req.user.id
    )
    
    if (existingProposal) {
      return res.status(400).json({ error: 'Proposal already submitted' })
    }
    
    const proposal = {
      freelancer: req.user.id,
      coverLetter: req.body.coverLetter,
      proposedRate: req.body.proposedRate,
      estimatedDuration: req.body.estimatedDuration,
      submittedAt: new Date()
    }
    
    job.proposals.push(proposal)
    await job.save()
    
    await job.populate('proposals.freelancer', 'profile')
    
    // Emit real-time update
    socketService.to(job.postedBy.toString()).emit('new_proposal', {
      jobId: job._id,
      proposal: job.proposals[job.proposals.length - 1]
    })
    
    res.status(201).json({ message: 'Proposal submitted successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Get freelancers
export const getFreelancers = async (req, res) => {
  try {
    const { page = 1, limit = 12, search, skills, minRating } = req.query
    
    let query = { role: 'user', 'profile.isFreelancer': true }
    
    if (search) {
      query.$or = [
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } },
        { 'profile.title': { $regex: search, $options: 'i' } }
      ]
    }
    
    if (skills) {
      query['profile.skills'] = { $in: skills.split(',') }
    }
    
    if (minRating) {
      query['profile.rating'] = { $gte: parseFloat(minRating) }
    }
    
    const freelancers = await User.find(query)
      .select('profile email createdAt')
      .sort({ 'profile.rating': -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
    
    const total = await User.countDocuments(query)
    
    res.json({
      freelancers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get user's jobs
export const getUserJobs = async (req, res) => {
  try {
    const { type = 'posted' } = req.query // 'posted' or 'applied'
    
    let query = {}
    
    if (type === 'posted') {
      query.postedBy = req.user.id
    } else {
      query['proposals.freelancer'] = req.user.id
    }
    
    const jobs = await FreelancingJob.find(query)
      .populate('postedBy', 'profile email')
      .populate('proposals.freelancer', 'profile')
      .sort({ createdAt: -1 })
    
    res.json(jobs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
