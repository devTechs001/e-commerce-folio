import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Sparkles, Upload, Image as ImageIcon, Download, 
  Eye, Save, RefreshCw, Zap, Palette, Type, Layout,
  BarChart3, TrendingUp, Globe, Search, Check, X
} from 'lucide-react'
import * as d3 from 'd3'
import { aiPortfolioService } from '../../services/aiPortfolio'
import { uploadService } from '../../services/upload'
import Button from '../../components/common/Button/Button'

const EnhancedAIBuilder = () => {
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    bio: '',
    skills: [],
    experience: 3,
    style: 'modern',
    colorScheme: 'blue',
    imageUrl: null,
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      website: ''
    }
  })
  
  // Skills input
  const [skillInput, setSkillInput] = useState('')
  
  // Generated portfolio
  const [generatedPortfolio, setGeneratedPortfolio] = useState(null)
  
  // D3 Visualization data
  const [skillsData, setSkillsData] = useState([])
  const [experienceData, setExperienceData] = useState([])

  // Available styles and color schemes
  const styles = [
    { id: 'modern', name: 'Modern', icon: Layout, color: '#3B82F6' },
    { id: 'minimal', name: 'Minimal', icon: Layout, color: '#000000' },
    { id: 'creative', name: 'Creative', icon: Palette, color: '#EC4899' },
    { id: 'professional', name: 'Professional', icon: Type, color: '#1F2937' }
  ]

  const colorSchemes = [
    { id: 'blue', name: 'Ocean Blue', primary: '#3B82F6', secondary: '#1E40AF' },
    { id: 'purple', name: 'Royal Purple', primary: '#8B5CF6', secondary: '#6D28D9' },
    { id: 'green', name: 'Fresh Green', primary: '#10B981', secondary: '#047857' },
    { id: 'orange', name: 'Vibrant Orange', primary: '#F59E0B', secondary: '#D97706' },
    { id: 'pink', name: 'Bold Pink', primary: '#EC4899', secondary: '#BE185D' }
  ]

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const result = await uploadService.uploadImage(file)
      if (result.success) {
        setFormData({ ...formData, imageUrl: result.url })
      }
    } catch (error) {
      console.error('Image upload failed:', error)
      alert('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  // Add skill
  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      })
      setSkillInput('')
    }
  }

  // Remove skill
  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    })
  }

  // Generate portfolio with AI
  const generatePortfolio = async () => {
    setGenerating(true)
    try {
      const result = await aiPortfolioService.generatePortfolioContent(formData)
      
      if (result.success) {
        setGeneratedPortfolio(result.portfolio)
        setStep(3)
        
        // Prepare data for D3 visualizations
        prepareVisualizationData(result.portfolio)
      }
    } catch (error) {
      console.error('Portfolio generation failed:', error)
      alert('Failed to generate portfolio')
    } finally {
      setGenerating(false)
    }
  }

  // Prepare D3 visualization data
  const prepareVisualizationData = (portfolio) => {
    // Skills data for bar chart
    if (portfolio.skills) {
      const skillsArray = portfolio.skills.map(skill => ({
        name: skill.name || skill,
        level: skill.level || Math.floor(Math.random() * 30) + 70
      }))
      setSkillsData(skillsArray)
    }

    // Experience timeline data
    if (portfolio.experience) {
      setExperienceData(portfolio.experience)
    }
  }

  // D3 Skills Chart
  useEffect(() => {
    if (skillsData.length > 0 && step === 3) {
      createSkillsChart()
    }
  }, [skillsData, step])

  const createSkillsChart = () => {
    // Clear existing chart
    d3.select('#skills-chart').selectAll('*').remove()

    const margin = { top: 20, right: 30, bottom: 40, left: 120 }
    const width = 600 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    const svg = d3.select('#skills-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // X scale
    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width])

    // Y scale
    const y = d3.scaleBand()
      .domain(skillsData.map(d => d.name))
      .range([0, height])
      .padding(0.2)

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(skillsData.map(d => d.name))
      .range(d3.schemeCategory10)

    // Add bars
    svg.selectAll('.bar')
      .data(skillsData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', d => y(d.name))
      .attr('height', y.bandwidth())
      .attr('fill', d => color(d.name))
      .attr('opacity', 0.8)
      .attr('width', 0)
      .transition()
      .duration(1000)
      .attr('width', d => x(d.level))

    // Add labels
    svg.selectAll('.label')
      .data(skillsData)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', -5)
      .attr('y', d => y(d.name) + y.bandwidth() / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .text(d => d.name)
      .style('font-size', '12px')
      .style('fill', '#374151')

    // Add percentage labels
    svg.selectAll('.value')
      .data(skillsData)
      .enter()
      .append('text')
      .attr('class', 'value')
      .attr('x', d => x(d.level) + 5)
      .attr('y', d => y(d.name) + y.bandwidth() / 2)
      .attr('dy', '.35em')
      .text(d => `${d.level}%`)
      .style('font-size', '11px')
      .style('fill', '#6B7280')
      .style('opacity', 0)
      .transition()
      .delay(1000)
      .duration(500)
      .style('opacity', 1)

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
  }

  // Save generated portfolio
  const savePortfolio = async () => {
    try {
      // TODO: Save to backend
      console.log('Saving portfolio:', generatedPortfolio)
      alert('Portfolio saved successfully!')
      navigate('/dashboard/portfolios')
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save portfolio')
    }
  }

  // Download portfolio as JSON
  const downloadPortfolio = () => {
    const dataStr = JSON.stringify(generatedPortfolio, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portfolio-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white px-6 py-3 rounded-full mb-4">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">AI Portfolio Builder</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Portfolio with AI
          </h1>
          <p className="text-xl text-gray-600">
            Let AI generate a stunning portfolio tailored to your skills and experience
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[
            { num: 1, label: 'Basic Info' },
            { num: 2, label: 'Customize' },
            { num: 3, label: 'Preview & Save' }
          ].map((s, index) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  step >= s.num 
                    ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.num ? <Check className="h-6 w-6" /> : s.num}
                </div>
                <span className="text-sm font-medium text-gray-700 mt-2">{s.label}</span>
              </div>
              {index < 2 && (
                <div className={`w-24 h-1 mx-4 ${
                  step > s.num ? 'bg-primary-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell Us About Yourself</h2>
            
            <div className="space-y-6">
              {/* Profile Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                <div className="flex items-center space-x-4">
                  {formData.imageUrl ? (
                    <div className="relative">
                      <img
                        src={formData.imageUrl}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                      />
                      <button
                        onClick={() => setFormData({ ...formData, imageUrl: null })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-primary-500 transition-colors">
                      {uploadingImage ? (
                        <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
                      ) : (
                        <>
                          <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500">Upload</span>
                        </>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Profession */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profession *
                </label>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Full Stack Developer"
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="4"
                  placeholder="Tell us about yourself and your passion..."
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills *
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Add a skill and press Enter"
                  />
                  <Button onClick={addSkill} variant="primary">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(skill)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience: {formData.experience}
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 years</span>
                  <span>20+ years</span>
                </div>
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setStep(2)}
                  variant="primary"
                  size="lg"
                  disabled={!formData.name || !formData.profession || formData.skills.length === 0}
                >
                  Next Step
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Customize Style */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Style</h2>
            
            <div className="space-y-8">
              {/* Template Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Template Style
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {styles.map((style) => {
                    const Icon = style.icon
                    return (
                      <button
                        key={style.id}
                        onClick={() => setFormData({ ...formData, style: style.id })}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          formData.style === style.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-8 w-8 mx-auto mb-3" style={{ color: style.color }} />
                        <div className="text-sm font-medium text-gray-900">{style.name}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Color Scheme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Color Scheme
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {colorSchemes.map((scheme) => (
                    <button
                      key={scheme.id}
                      onClick={() => setFormData({ ...formData, colorScheme: scheme.id })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.colorScheme === scheme.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex space-x-2 mb-2">
                        <div
                          className="w-8 h-8 rounded-lg"
                          style={{ backgroundColor: scheme.primary }}
                        />
                        <div
                          className="w-8 h-8 rounded-lg"
                          style={{ backgroundColor: scheme.secondary }}
                        />
                      </div>
                      <div className="text-xs font-medium text-gray-900">{scheme.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Social Links (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData.socialLinks).map(([platform, value]) => (
                    <div key={platform}>
                      <label className="block text-xs text-gray-600 mb-1 capitalize">
                        {platform}
                      </label>
                      <input
                        type="url"
                        value={value}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialLinks: {
                            ...formData.socialLinks,
                            [platform]: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        placeholder={`https://${platform}.com/yourprofile`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  size="lg"
                >
                  Back
                </Button>
                <Button
                  onClick={generatePortfolio}
                  variant="primary"
                  size="lg"
                  loading={generating}
                  icon={Zap}
                >
                  {generating ? 'Generating...' : 'Generate with AI'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preview & Save */}
        {step === 3 && generatedPortfolio && (
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your AI-Generated Portfolio</h2>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => setStep(2)}
                    variant="outline"
                    size="sm"
                    icon={RefreshCw}
                  >
                    Regenerate
                  </Button>
                  <Button
                    onClick={downloadPortfolio}
                    variant="outline"
                    size="sm"
                    icon={Download}
                  >
                    Download
                  </Button>
                  <Button
                    onClick={savePortfolio}
                    variant="primary"
                    size="sm"
                    icon={Save}
                  >
                    Save Portfolio
                  </Button>
                </div>
              </div>

              {/* Portfolio Preview */}
              <div className="border border-gray-200 rounded-xl p-6 mb-6">
                <div className="text-center mb-8">
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt={formData.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                  )}
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{formData.name}</h1>
                  <p className="text-xl text-primary-600 mb-4">{formData.profession}</p>
                  <p className="text-gray-600 max-w-2xl mx-auto">{generatedPortfolio.intro}</p>
                </div>

                {/* Generated Sections */}
                {generatedPortfolio.sections && generatedPortfolio.sections.map((section, index) => (
                  <div key={index} className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
                  </div>
                ))}
              </div>
            </div>

            {/* D3 Visualization - Skills Chart */}
            {skillsData.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <BarChart3 className="h-6 w-6 mr-2 text-primary-600" />
                  Skills Proficiency Analysis
                </h3>
                <div id="skills-chart" className="overflow-x-auto"></div>
              </div>
            )}

            {/* Analytics Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-primary-600" />
                Portfolio Analytics Preview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-600 font-medium">Estimated Views</span>
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">2.5K+</div>
                  <div className="text-xs text-blue-600 mt-1">Per month average</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-600 font-medium">SEO Score</span>
                    <Search className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">92/100</div>
                  <div className="text-xs text-green-600 mt-1">Excellent optimization</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-purple-600 font-medium">Global Reach</span>
                    <Globe className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">45+</div>
                  <div className="text-xs text-purple-600 mt-1">Countries</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EnhancedAIBuilder
