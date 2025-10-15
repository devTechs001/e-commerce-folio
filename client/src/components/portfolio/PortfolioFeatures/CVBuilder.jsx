import React, { useState } from 'react'
import { 
  User, Briefcase, GraduationCap, Award, Code, Languages,
  Download, Eye, Save, Plus, Trash2, Edit, FileText, Crown,
  MapPin, Mail, Phone, Globe, Linkedin, Github
} from 'lucide-react'
import Button from '../../common/Button/Button'
import { subscriptionService } from '../../../services/subscription'

const CVBuilder = ({ onSave, initialData = null }) => {
  const [cvData, setCvData] = useState(initialData || {
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    template: 'professional' // professional, modern, creative, minimal
  })

  const [activeSection, setActiveSection] = useState('personal')
  const [preview, setPreview] = useState(false)
  const [userTier, setUserTier] = useState('free')

  React.useEffect(() => {
    const checkTier = async () => {
      const tier = await subscriptionService.getUserTier()
      setUserTier(tier)
    }
    checkTier()
  }, [])

  const isPremium = ['premium', 'professional', 'enterprise'].includes(userTier)

  const templates = [
    { id: 'professional', name: 'Professional', icon: Briefcase, premium: false },
    { id: 'modern', name: 'Modern', icon: FileText, premium: false },
    { id: 'creative', name: 'Creative', icon: Award, premium: true },
    { id: 'minimal', name: 'Minimal', icon: User, premium: true }
  ]

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'skills', name: 'Skills', icon: Code },
    { id: 'certifications', name: 'Certifications', icon: Award },
    { id: 'languages', name: 'Languages', icon: Languages }
  ]

  const addExperience = () => {
    setCvData({
      ...cvData,
      experience: [...cvData.experience, {
        id: Date.now(),
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    })
  }

  const addEducation = () => {
    setCvData({
      ...cvData,
      education: [...cvData.education, {
        id: Date.now(),
        school: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: ''
      }]
    })
  }

  const addSkill = () => {
    setCvData({
      ...cvData,
      skills: [...cvData.skills, {
        id: Date.now(),
        name: '',
        level: 'intermediate', // beginner, intermediate, advanced, expert
        category: 'technical' // technical, soft, other
      }]
    })
  }

  const addCertification = () => {
    setCvData({
      ...cvData,
      certifications: [...cvData.certifications, {
        id: Date.now(),
        name: '',
        issuer: '',
        date: '',
        url: ''
      }]
    })
  }

  const addLanguage = () => {
    setCvData({
      ...cvData,
      languages: [...cvData.languages, {
        id: Date.now(),
        language: '',
        proficiency: 'intermediate' // basic, intermediate, advanced, native
      }]
    })
  }

  const deleteItem = (section, id) => {
    setCvData({
      ...cvData,
      [section]: cvData[section].filter(item => item.id !== id)
    })
  }

  const updateItem = (section, id, updates) => {
    setCvData({
      ...cvData,
      [section]: cvData[section].map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    })
  }

  const handleDownload = () => {
    // Generate PDF or download CV
    alert('CV download functionality would be implemented here')
  }

  const handleSave = () => {
    if (onSave) {
      onSave(cvData)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CV / Resume Builder</h2>
          <p className="text-gray-600">Create a professional CV for download</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setPreview(!preview)}
            icon={Eye}
            variant="outline"
          >
            {preview ? 'Edit' : 'Preview'}
          </Button>
          <Button onClick={handleDownload} icon={Download} variant="outline">
            Download PDF
          </Button>
          <Button onClick={handleSave} icon={Save}>
            Save CV
          </Button>
        </div>
      </div>

      {/* Template Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Template</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((template) => {
            const Icon = template.icon
            const canUse = !template.premium || isPremium

            return (
              <button
                key={template.id}
                onClick={() => canUse && setCvData({ ...cvData, template: template.id })}
                disabled={!canUse}
                className={`relative p-6 rounded-xl border-2 transition-all ${
                  cvData.template === template.id
                    ? 'border-primary-500 bg-primary-50'
                    : canUse
                    ? 'border-gray-200 hover:border-primary-300'
                    : 'border-gray-200 opacity-50 cursor-not-allowed'
                }`}
              >
                <Icon className="h-8 w-8 mx-auto mb-2 text-gray-700" />
                <div className="text-sm font-medium text-gray-900">{template.name}</div>
                {template.premium && !isPremium && (
                  <Crown className="absolute top-2 right-2 h-4 w-4 text-yellow-500" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {preview ? (
        /* Preview Mode */
        <div className="bg-white rounded-xl shadow-2xl p-12 max-w-4xl mx-auto">
          {/* Personal Info */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {cvData.personalInfo.fullName || 'Your Name'}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {cvData.personalInfo.title || 'Professional Title'}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              {cvData.personalInfo.email && (
                <span className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{cvData.personalInfo.email}</span>
                </span>
              )}
              {cvData.personalInfo.phone && (
                <span className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{cvData.personalInfo.phone}</span>
                </span>
              )}
              {cvData.personalInfo.location && (
                <span className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{cvData.personalInfo.location}</span>
                </span>
              )}
            </div>
          </div>

          {/* Summary */}
          {cvData.personalInfo.summary && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b-2 border-primary-600 pb-2">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{cvData.personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {cvData.experience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-primary-600 pb-2">
                Work Experience
              </h2>
              <div className="space-y-6">
                {cvData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-gray-700">{exp.company} • {exp.location}</p>
                      </div>
                      <span className="text-sm text-gray-600">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {cvData.education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-primary-600 pb-2">
                Education
              </h2>
              <div className="space-y-4">
                {cvData.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-gray-700">{edu.school} • {edu.field}</p>
                        {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                      </div>
                      <span className="text-sm text-gray-600">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {cvData.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-primary-600 pb-2">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-4 py-2 bg-primary-100 text-primary-800 rounded-lg text-sm font-medium"
                  >
                    {skill.name} • {skill.level}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {cvData.certifications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-primary-600 pb-2">
                Certifications
              </h2>
              <div className="space-y-2">
                {cvData.certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{cert.name}</span>
                      <span className="text-gray-600"> - {cert.issuer}</span>
                    </div>
                    <span className="text-sm text-gray-600">{cert.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {cvData.languages.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-primary-600 pb-2">
                Languages
              </h2>
              <div className="flex flex-wrap gap-4">
                {cvData.languages.map((lang) => (
                  <span key={lang.id} className="text-gray-700">
                    <span className="font-medium">{lang.language}</span> - {lang.proficiency}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Editor Mode */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 sticky top-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Sections</h3>
              <div className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeSection === section.id
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{section.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              {activeSection === 'personal' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={cvData.personalInfo.fullName}
                      onChange={(e) => setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, fullName: e.target.value }
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="text"
                      placeholder="Professional Title"
                      value={cvData.personalInfo.title}
                      onChange={(e) => setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, title: e.target.value }
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder="Email"
                      value={cvData.personalInfo.email}
                      onChange={(e) => setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, email: e.target.value }
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={cvData.personalInfo.phone}
                      onChange={(e) => setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, phone: e.target.value }
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Location"
                    value={cvData.personalInfo.location}
                    onChange={(e) => setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, location: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="url"
                      placeholder="Website"
                      value={cvData.personalInfo.website}
                      onChange={(e) => setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, website: e.target.value }
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="url"
                      placeholder="LinkedIn"
                      value={cvData.personalInfo.linkedin}
                      onChange={(e) => setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, linkedin: e.target.value }
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="url"
                      placeholder="GitHub"
                      value={cvData.personalInfo.github}
                      onChange={(e) => setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, github: e.target.value }
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <textarea
                    placeholder="Professional Summary"
                    value={cvData.personalInfo.summary}
                    onChange={(e) => setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, summary: e.target.value }
                    })}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}

              {activeSection === 'experience' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                    <Button onClick={addExperience} icon={Plus} size="sm">
                      Add Experience
                    </Button>
                  </div>

                  {cvData.experience.map((exp) => (
                    <div key={exp.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900">Experience Entry</h4>
                        <button
                          onClick={() => deleteItem('experience', exp.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => updateItem('experience', exp.id, { company: e.target.value })}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                        <input
                          type="text"
                          placeholder="Position"
                          value={exp.position}
                          onChange={(e) => updateItem('experience', exp.id, { position: e.target.value })}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="Location"
                        value={exp.location}
                        onChange={(e) => updateItem('experience', exp.id, { location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Start Date"
                          value={exp.startDate}
                          onChange={(e) => updateItem('experience', exp.id, { startDate: e.target.value })}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                        <input
                          type="text"
                          placeholder="End Date"
                          value={exp.endDate}
                          onChange={(e) => updateItem('experience', exp.id, { endDate: e.target.value })}
                          disabled={exp.current}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                        />
                      </div>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateItem('experience', exp.id, { current: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700">Currently working here</span>
                      </label>

                      <textarea
                        placeholder="Job Description"
                        value={exp.description}
                        onChange={(e) => updateItem('experience', exp.id, { description: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Similar sections for education, skills, certifications, languages */}
              {/* (Implementation continues with similar patterns) */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CVBuilder
