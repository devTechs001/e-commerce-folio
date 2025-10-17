import React, { useState, useRef } from 'react'
import { Sparkles, Wand2, Download, Eye, Copy, RefreshCw, ArrowRight, Zap, TrendingUp, Upload, Image as ImageIcon, Palette, Scissors, Maximize2, Minimize2, Github, Linkedin, Mail, Phone, MapPin, Briefcase } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'

const AIPortfolioGenerator = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)
  const [uploadedImages, setUploadedImages] = useState([])
  const [processingImage, setProcessingImage] = useState(false)
  const [colorPalette, setColorPalette] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    experience: '',
    skills: '',
    projects: '',
    tone: 'professional',
    length: 'medium',
    email: '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    website: '',
    theme: 'modern'
  })
  const [generatedContent, setGeneratedContent] = useState({
    bio: '',
    about: '',
    skills: [],
    projects: []
  })

  // Image upload and processing
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files)
    setProcessingImage(true)
    
    try {
      const processedImages = await Promise.all(
        files.map(async (file) => {
          return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => {
              const img = new Image()
              img.onload = () => {
                // Create canvas for image processing
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                
                // Resize for optimization
                const maxSize = 1200
                let width = img.width
                let height = img.height
                
                if (width > height && width > maxSize) {
                  height = (height * maxSize) / width
                  width = maxSize
                } else if (height > maxSize) {
                  width = (width * maxSize) / height
                  height = maxSize
                }
                
                canvas.width = width
                canvas.height = height
                ctx.drawImage(img, 0, 0, width, height)
                
                // Extract dominant colors
                const imageData = ctx.getImageData(0, 0, width, height)
                const colors = extractColors(imageData)
                
                resolve({
                  id: Date.now() + Math.random(),
                  url: canvas.toDataURL('image/jpeg', 0.9),
                  original: e.target.result,
                  name: file.name,
                  colors: colors,
                  size: file.size,
                  dimensions: { width, height }
                })
              }
              img.src = e.target.result
            }
            reader.readAsDataURL(file)
          })
        })
      )
      
      setUploadedImages(prev => [...prev, ...processedImages])
      
      // Extract color palette from first image
      if (processedImages.length > 0 && processedImages[0].colors) {
        setColorPalette(processedImages[0].colors.slice(0, 5))
      }
      
      toast.success(`${processedImages.length} image(s) processed successfully!`)
    } catch (error) {
      console.error('Image processing error:', error)
      toast.error('Failed to process images')
    } finally {
      setProcessingImage(false)
    }
  }
  
  // Extract dominant colors from image
  const extractColors = (imageData) => {
    const pixels = imageData.data
    const colorMap = {}
    
    // Sample every 10th pixel for performance
    for (let i = 0; i < pixels.length; i += 40) {
      const r = pixels[i]
      const g = pixels[i + 1]
      const b = pixels[i + 2]
      const rgb = `${r},${g},${b}`
      colorMap[rgb] = (colorMap[rgb] || 0) + 1
    }
    
    // Sort by frequency and get top colors
    const sortedColors = Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([rgb]) => {
        const [r, g, b] = rgb.split(',').map(Number)
        return `rgb(${r}, ${g}, ${b})`
      })
    
    return sortedColors
  }
  
  // Remove image
  const removeImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id))
    toast.success('Image removed')
  }
  
  // Apply AI-powered image enhancements
  const enhanceImage = (imageId) => {
    toast.success('AI enhancement applied! (Demo)')
    // In production, this would call an AI service for image enhancement
  }

  const generateContent = async () => {
    setLoading(true)
    try {
      // Simulate AI generation with more realistic content
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const toneVariations = {
        professional: {
          bioPrefix: 'is a seasoned',
          aboutStart: 'As an accomplished',
          approach: 'My professional approach emphasizes',
          closer: 'I am committed to excellence and continuous growth in'
        },
        casual: {
          bioPrefix: 'is a friendly',
          aboutStart: "Hey! I'm a passionate",
          approach: 'I love to',
          closer: "When I'm not coding, you'll find me learning about"
        },
        creative: {
          bioPrefix: 'is an innovative',
          aboutStart: 'Creativity meets functionality in my work as a',
          approach: 'I blend artistic vision with',
          closer: 'I believe in pushing boundaries and exploring new possibilities in'
        },
        technical: {
          bioPrefix: 'is an expert',
          aboutStart: 'With a strong technical foundation as a',
          approach: 'My methodology focuses on',
          closer: 'I specialize in implementing cutting-edge solutions in'
        }
      }
      
      const tone = toneVariations[formData.tone]
      const skillsList = formData.skills.split(',').map(s => s.trim())
      const projectsList = formData.projects.split(',').map(p => p.trim())
      
      const content = {
        bio: `${formData.name} ${tone.bioPrefix} ${formData.profession} with ${formData.experience}+ years of proven experience. Specializing in ${skillsList.slice(0, 3).join(', ')}, ${formData.name.split(' ')[0]} has successfully delivered ${Math.max(parseInt(formData.experience) * 5, 10)}+ projects across various industries. Known for innovative problem-solving and client-focused solutions, they continue to drive excellence in the ${formData.profession.toLowerCase()} field.`,
        
        about: `${tone.aboutStart} ${formData.profession}, I bring ${formData.experience} years of hands-on experience crafting exceptional digital solutions that make a real impact. My journey has been driven by a genuine passion for ${skillsList[0]} and ${skillsList[1] || 'technology'}.\n\n${tone.approach} clean code, scalable architecture, and user-centric design. Every project is an opportunity to create something meaningful. Throughout my career, I've had the privilege of working on exciting projects like ${projectsList.slice(0, 2).join(' and ')}, each teaching me invaluable lessons about collaboration, innovation, and technical excellence.\n\nWhat sets me apart is my ability to bridge the gap between complex technical requirements and practical business goals. I believe in staying ahead of the curve - constantly learning new technologies, frameworks, and best practices to deliver modern solutions that stand the test of time.\n\n${tone.closer} emerging technologies and industry trends. ${formData.tone === 'casual' ? "Let's build something amazing together!" : 'I look forward to collaborating on projects that challenge the status quo and create lasting value.'}`,
        
        skills: skillsList.map((skill, index) => ({
          name: skill,
          level: Math.min(95, Math.max(70, 85 - (index * 5) + Math.floor(Math.random() * 10))),
          category: index < 3 ? 'Technical' : index < 5 ? 'Tools' : 'Soft Skills'
        })),
        
        projects: projectsList.slice(0, 3).map((project, index) => {
          const descriptions = [
            `A comprehensive ${formData.profession.toLowerCase()} solution that showcases advanced ${skillsList[index % skillsList.length]} capabilities. Successfully delivered to ${['10K+', '5K+', '15K+'][index]} active users with 99.9% uptime. This project demonstrates end-to-end development, deployment, and maintenance expertise.`,
            `An innovative platform built with ${skillsList.slice(0, 2).join(' and ')} that revolutionized ${['user engagement', 'business operations', 'customer experience'][index]}. Implemented features including real-time updates, advanced analytics, and seamless integrations, resulting in a ${[45, 60, 35][index]}% improvement in key metrics.`,
            `Enterprise-grade application leveraging ${skillsList[0]} to solve complex ${['data processing', 'workflow automation', 'communication'][index]} challenges. Collaborated with cross-functional teams to deliver a scalable solution that handles ${['1M+', '500K+', '2M+'][index]} transactions daily.`
          ]
          return {
            title: project,
            description: descriptions[index % 3],
            technologies: skillsList.slice(0, Math.min(4, skillsList.length)),
            impact: ['+45% efficiency', '+60% user engagement', '+35% revenue'][index],
            link: '#'
          }
        })
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
  
  const themes = [
    { id: 'modern', name: 'Modern', color: 'from-blue-500 to-purple-500', preview: '🎨' },
    { id: 'minimal', name: 'Minimal', color: 'from-gray-700 to-gray-900', preview: '⚪' },
    { id: 'creative', name: 'Creative', color: 'from-pink-500 to-orange-500', preview: '🌈' },
    { id: 'professional', name: 'Professional', color: 'from-indigo-600 to-blue-600', preview: '💼' },
    { id: 'dark', name: 'Dark Mode', color: 'from-slate-900 to-gray-800', preview: '🌙' },
    { id: 'vibrant', name: 'Vibrant', color: 'from-green-400 to-cyan-500', preview: '✨' }
  ]

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
              <div className="space-y-6">
                {generatedContent.projects.map((project, index) => (
                  <div key={index} className="border-l-4 border-primary-600 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">{project.title}</h4>
                    <p className="text-gray-700 text-sm mb-3 leading-relaxed">{project.description}</p>
                    {project.impact && (
                      <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
                        <TrendingUp className="w-3 h-3" />
                        <span>Impact: {project.impact}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
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
              <Link 
                to="/dashboard/portfolio-editor?aiGenerated=true"
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                <Zap className="w-5 h-5" />
                <span>Use in Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AIPortfolioGenerator
