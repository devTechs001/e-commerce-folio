import React, { useState, useEffect } from 'react'
import { Briefcase, MapPin, DollarSign, Calendar, ExternalLink, Upload, Download } from 'lucide-react'
import Button from '../../common/Button/Button'
import { integrationService } from '../../../services/integration'

const JobBoards = () => {
  const [jobBoards, setJobBoards] = useState([])
  const [jobListings, setJobListings] = useState([])
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)

  const supportedJobBoards = [
    {
      id: 'linkedin_jobs',
      name: 'LinkedIn Jobs',
      icon: '💼',
      connected: false,
      jobsCount: 0
    },
    {
      id: 'indeed',
      name: 'Indeed',
      icon: '🔍',
      connected: false,
      jobsCount: 0
    },
    {
      id: 'glassdoor',
      name: 'Glassdoor',
      icon: '🏢',
      connected: false,
      jobsCount: 0
    },
    {
      id: 'angel_list',
      name: 'AngelList',
      icon: '👼',
      connected: false,
      jobsCount: 0
    },
    {
      id: 'remote_ok',
      name: 'Remote OK',
      icon: '🌍',
      connected: false,
      jobsCount: 0
    },
    {
      id: 'wellfound',
      name: 'WellFound',
      icon: '⚡',
      connected: false,
      jobsCount: 0
    }
  ]

  useEffect(() => {
    loadJobBoardData()
  }, [])

  const loadJobBoardData = async () => {
    try {
      setLoading(true)
      const [boardsResponse, jobsResponse, resumeResponse] = await Promise.all([
        integrationService.getJobBoardIntegrations(),
        integrationService.getJobRecommendations(),
        integrationService.getResume()
      ])

      if (boardsResponse.success) {
        setJobBoards(boardsResponse.data)
      }

      if (jobsResponse.success) {
        setJobListings(jobsResponse.data)
      }

      if (resumeResponse.success) {
        setResume(resumeResponse.data)
      }
    } catch (error) {
      console.error('Error loading job board data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectJobBoard = async (boardId) => {
    try {
      const response = await integrationService.connectJobBoard(boardId)
      if (response.success) {
        // Update local state
        setJobBoards(prev => prev.map(board =>
          board.id === boardId ? { ...board, connected: true } : board
        ))
      }
    } catch (error) {
      console.error('Error connecting job board:', error)
    }
  }

  const handleUploadResume = async (file) => {
    try {
      const formData = new FormData()
      formData.append('resume', file)
      
      const response = await integrationService.uploadResume(formData)
      if (response.success) {
        setResume(response.data)
      }
    } catch (error) {
      console.error('Error uploading resume:', error)
    }
  }

  const handleApplyToJob = async (jobId) => {
    try {
      const response = await integrationService.applyToJob(jobId, resume?.id)
      if (response.success) {
        // Update job status
        setJobListings(prev => prev.map(job =>
          job.id === jobId ? { ...job, applied: true } : job
        ))
      }
    } catch (error) {
      console.error('Error applying to job:', error)
    }
  }

  const JobCard = ({ job }) => (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{job.title}</h4>
          <p className="text-primary-600">{job.company}</p>
        </div>
        {job.applied && (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Applied
          </span>
        )}
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {job.location}
        </div>
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-1" />
          {job.salary}
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {job.posted}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">{job.type}</span>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">{job.platform}</span>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={ExternalLink}
            onClick={() => window.open(job.url, '_blank')}
          >
            View
          </Button>
          {!job.applied && resume && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleApplyToJob(job.id)}
            >
              Apply
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Resume Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Resume Management</h3>
            <p className="text-gray-600">Upload and manage your resume for job applications</p>
          </div>
          <Briefcase className="h-6 w-6 text-primary-600" />
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {resume ? resume.name : 'No resume uploaded'}
              </h4>
              <p className="text-sm text-gray-600">
                {resume ? `Last updated: ${new Date(resume.updatedAt).toLocaleDateString()}` : 'Upload your resume to start applying'}
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            {resume && (
              <Button
                variant="outline"
                icon={Download}
                onClick={() => window.open(resume.url, '_blank')}
              >
                Download
              </Button>
            )}
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleUploadResume(e.target.files[0])}
                className="hidden"
              />
              <Button variant="primary" icon={Upload} as="span">
                {resume ? 'Update Resume' : 'Upload Resume'}
              </Button>
            </label>
          </div>
        </div>
      </div>

      {/* Job Board Integrations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Job Board Integrations</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {supportedJobBoards.map((board) => (
            <div
              key={board.id}
              className="border border-gray-200 rounded-lg p-4 text-center"
            >
              <div className="text-2xl mb-2">{board.icon}</div>
              <h4 className="font-semibold text-gray-900 mb-1">{board.name}</h4>
              <p className="text-sm text-gray-600 mb-3">
                {board.connected ? `${board.jobsCount} jobs found` : 'Connect to find jobs'}
              </p>
              
              <Button
                variant={board.connected ? "outline" : "primary"}
                size="sm"
                className="w-full"
                onClick={() => handleConnectJobBoard(board.id)}
              >
                {board.connected ? 'Connected' : 'Connect'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Job Recommendations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recommended Jobs</h3>
            <p className="text-gray-600">Jobs matching your skills and preferences</p>
          </div>
          <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
            {jobListings.length} jobs
          </span>
        </div>

        <div className="space-y-4">
          {jobListings.slice(0, 5).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}

          {jobListings.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No job recommendations yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Connect job boards and upload your resume to get personalized recommendations
              </p>
            </div>
          )}
        </div>

        {jobListings.length > 5 && (
          <div className="text-center mt-6">
            <Button variant="outline">
              View All Jobs
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobBoards