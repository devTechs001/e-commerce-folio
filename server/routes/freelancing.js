import express from 'express'
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  submitProposal,
  getFreelancers,
  getUserJobs
} from '../controllers/freelancingController.js'
import { authenticateToken } from '../middleware/auth.js'
import { validateJob, validateProposal } from '../middleware/validation.js'

const router = express.Router()

// Public routes
router.get('/jobs', getJobs)
router.get('/jobs/:id', getJob)
router.get('/freelancers', getFreelancers)

// Protected routes
router.use(authenticateToken)

// Job management
router.post('/jobs', validateJob, createJob)
router.put('/jobs/:id', validateJob, updateJob)
router.delete('/jobs/:id', deleteJob)

// Proposals
router.post('/jobs/:id/proposals', validateProposal, submitProposal)

// User's jobs
router.get('/my-jobs', getUserJobs)

export default router
