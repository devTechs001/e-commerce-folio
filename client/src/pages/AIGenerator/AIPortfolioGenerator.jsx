import React, { useState } from 'react'
import { Sparkles, Wand2, Download, Eye, Copy, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import axios from 'axios'

const AIPortfolioGenerator = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    experience: '',
    skills: '',
    projects: '',
    tone: 'professional',
    length: 'medium'
  })
  const [generatedContent, setGeneratedContent] = useState({
    bio: '',
    about: '',
    skills: [],
    projects: []
  })

  const generateContent = async () => {
    setLoading(true)
    try {
      // Simulate AI generation (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const content = {
        bio: `${formData.name} is a ${formData.profession} with ${formData.experience} years of experience. Specializing in ${formData.skills}, they have successfully delivered numerous projects and continue to push the boundaries of innovation in their field.`,
        
        about: `As a passionate ${formData.profession}, I bring ${formData.experience} years of hands-on experience in creating exceptional digital solutions. My expertise spans across ${formData.skills}, allowing me to tackle complex challenges with creative and efficient approaches.\n\nThroughout my career, I've had the privilege of working on diverse projects including ${formData.projects}. Each project has strengthened my commitment to delivering high-quality work that exceeds client expectations.\n\nI believe in continuous learning and staying updated with the latest industry trends. My approach combines technical excellence with strong communication skills, ensuring successful project outcomes and satisfied clients.`,
        
        skills: formData.skills.split(',').map(skill => ({
          name: skill.trim(),
          level: Math.floor(Math.random() * 30) + 70,
          category: 'Technical'
        })),
        
        projects: formData.projects.split(',').slice(0, 3).map((project, index) => ({
          title: project.trim(),
          description: `A comprehensive ${formData.profession.toLowerCase()} project that showcases advanced ${formData.skills.split(',')[0]} capabilities. This project demonstrates problem-solving skills and technical expertise.`,
          technologies: formData.skills.split(',').slice(0, 3).map(s => s.trim()),
          link: '#'
        }))
      }
      
      setGeneratedContent(content)
      setStep(3)
      toast.success('Portfolio content generated successfully!')
    } catch (error) {
      toast.error('Failed to generate content')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const regenerate = () => {
    setStep(1)
    setGeneratedContent({ bio: '', about: '', skills: [], projects: [] })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Portfolio Generator</h1>
          <p className="text-lg text-gray-600">Create professional portfolio content in seconds with AI</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-20 h-1 ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Input Form */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about yourself</h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Full Stack Developer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="React, Node.js, TypeScript, MongoDB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key Projects (comma-separated)</label>
                <textarea
                  value={formData.projects}
                  onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="E-commerce Platform, Social Media App, Portfolio Builder"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                  <select
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="creative">Creative</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Length</label>
                  <select
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.profession}
                className="flex items-center space-x-2 bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Continue</span>
                <Wand2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Generate */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-xl text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Review & Generate</h2>
            <p className="text-gray-600 mb-8">Review your information and generate AI-powered portfolio content</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{formData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Profession</p>
                  <p className="font-medium text-gray-900">{formData.profession}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-medium text-gray-900">{formData.experience} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tone</p>
                  <p className="font-medium text-gray-900 capitalize">{formData.tone}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={generateContent}
                disabled={loading}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Bio */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Professional Bio</h3>
                <button
                  onClick={() => copyToClipboard(generatedContent.bio)}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Copy</span>
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed">{generatedContent.bio}</p>
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">About Section</h3>
                <button
                  onClick={() => copyToClipboard(generatedContent.about)}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Copy</span>
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{generatedContent.about}</p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Skills</h3>
              <div className="space-y-3">
                {generatedContent.skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                      <span className="text-sm text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Project Descriptions</h3>
              <div className="space-y-4">
                {generatedContent.projects.map((project, index) => (
                  <div key={index} className="border-l-4 border-primary-600 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                    <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={regenerate}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Generate Again</span>
              </button>
              <button className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                <Download className="w-5 h-5" />
                <span>Download as PDF</span>
              </button>
              <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors">
                <Eye className="w-5 h-5" />
                <span>Use in Portfolio</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AIPortfolioGenerator
