import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Share2, 
  Eye, 
  Download, 
  Mail, 
  Linkedin, 
  Twitter,
  Globe,
  MapPin,
  Calendar,
  Award,
  BookOpen
} from 'lucide-react'
import { portfolioService } from '../../services/portfolio'
import { analyticsService } from '../../services/analytics'
import Button from '../../components/common/Button/Button'

const PortfolioView = () => {
  const { username } = useParams()
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    loadPortfolio()
    trackView()
  }, [username])

  const loadPortfolio = async () => {
    try {
      setLoading(true)
      const response = await portfolioService.getPublicPortfolio(username)
      setPortfolio(response.portfolio)
    } catch (err) {
      setError('Portfolio not found')
      console.error('Error loading portfolio:', err)
    } finally {
      setLoading(false)
    }
  }

  const trackView = async () => {
    try {
      await analyticsService.trackPortfolioView(username, {
        ip: 'user-ip', // This would be handled by the backend
        userAgent: navigator.userAgent,
        referrer: document.referrer
      })
    } catch (err) {
      console.error('Error tracking view:', err)
    }
  }

  const sharePortfolio = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: portfolio?.title,
          text: `Check out ${portfolio?.user?.profile?.firstName}'s portfolio`,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const renderSection = (section) => {
    switch (section.type) {
      case 'hero':
        return (
          <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-primary-900 text-white py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {section.data?.title || 'Welcome to My Portfolio'}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                {section.data?.subtitle || 'Professional Portfolio'}
              </p>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
                {section.data?.description || 'Creating amazing work and solving complex problems.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                  onClick={() => setActiveSection('projects')}
                >
                  View My Work
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => setActiveSection('contact')}
                >
                  Get In Touch
                </Button>
              </div>
            </div>
          </section>
        )

      case 'about':
        return (
          <section id="about" className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                {section.data?.title || 'About Me'}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p className="text-xl leading-relaxed">
                  {section.data?.content || 'I am a passionate professional dedicated to creating exceptional work and delivering outstanding results.'}
                </p>
              </div>
            </div>
          </section>
        )

      case 'skills':
        return (
          <section id="skills" className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                {section.data?.title || 'Skills & Expertise'}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(section.data?.items || ['Skill 1', 'Skill 2', 'Skill 3']).map((skill, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                    <Award className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900">{skill}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'projects':
        return (
          <section id="projects" className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                {section.data?.title || 'Projects'}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(section.data?.items || Array(3).fill({})).map((project, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-primary-100 to-blue-100"></div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {project.title || `Project ${index + 1}`}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {project.description || 'Project description goes here.'}
                      </p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'experience':
        return (
          <section id="experience" className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                {section.data?.title || 'Experience'}
              </h2>
              <div className="space-y-8">
                {(section.data?.items || Array(2).fill({})).map((exp, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {exp.position || 'Position'}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {exp.period || '2020 - Present'}
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {exp.company || 'Company Name'} • {exp.location || 'Location'}
                    </div>
                    <p className="text-gray-600">
                      {exp.description || 'Experience description goes here.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'education':
        return (
          <section id="education" className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                {section.data?.title || 'Education'}
              </h2>
              <div className="space-y-6">
                {(section.data?.items || Array(2).fill({})).map((edu, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <BookOpen className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {edu.degree || 'Degree'}
                      </h3>
                      <p className="text-gray-600">
                        {edu.institution || 'Institution'} • {edu.period || '2016 - 2020'}
                      </p>
                      {edu.description && (
                        <p className="text-gray-500 text-sm mt-1">{edu.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'contact':
        return (
          <section id="contact" className="py-20 bg-gradient-to-br from-slate-900 to-primary-900 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                {section.data?.title || 'Get In Touch'}
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                {section.data?.description || "Let's work together on your next project."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                  href={`mailto:${portfolio?.user?.email || 'email@example.com'}`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                {portfolio?.user?.socialLinks?.linkedin && (
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                    href={portfolio.user.socialLinks.linkedin}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                )}
              </div>
            </div>
          </section>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-8">The portfolio you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>

            <div className="flex items-center space-x-4">
              <button
                onClick={sharePortfolio}
                className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </button>
              <div className="flex items-center text-gray-500 text-sm">
                <Eye className="h-4 w-4 mr-1" />
                {portfolio.analytics?.views || 0} views
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Portfolio Content */}
      <main className="pt-16">
        {portfolio.sections
          .filter(section => section.isVisible)
          .sort((a, b) => a.order - b.order)
          .map((section, index) => (
            <div key={section._id || index}>
              {renderSection(section)}
            </div>
          ))}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} {portfolio.user?.profile?.firstName} {portfolio.user?.profile?.lastName}. 
            All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Portfolio created with E-Folio
          </p>
        </div>
      </footer>
    </div>
  )
}

export default PortfolioView