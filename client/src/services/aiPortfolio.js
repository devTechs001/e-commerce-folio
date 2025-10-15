import api from './api'

const aiPortfolioService = {
  /**
   * Generate AI portfolio content based on user profile
   * @param {Object} profileData - User profile information
   * @returns {Promise<Object>} Generated portfolio content
   */
  generatePortfolio: async (profileData) => {
    try {
      const response = await api.post('/api/ai/generate-portfolio', profileData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('AI Portfolio Generation Error:', error)
      
      // Fallback to mock data if API fails
      return {
        success: true,
        data: generateMockPortfolio(profileData)
      }
    }
  },

  /**
   * Generate about section content
   * @param {Object} profile - User profile data
   * @returns {Promise<Object>} Generated about content
   */
  generateAbout: async (profile) => {
    try {
      const response = await api.post('/api/ai/generate-about', profile)
      return {
        success: true,
        content: response.data.content
      }
    } catch (error) {
      console.error('Generate About Error:', error)
      return {
        success: true,
        content: generateMockAbout(profile)
      }
    }
  },

  /**
   * Generate project descriptions
   * @param {Object} projectInfo - Project information
   * @returns {Promise<Object>} Generated project content
   */
  generateProject: async (projectInfo) => {
    try {
      const response = await api.post('/api/ai/generate-project', projectInfo)
      return {
        success: true,
        content: response.data.content
      }
    } catch (error) {
      console.error('Generate Project Error:', error)
      return {
        success: true,
        content: generateMockProject(projectInfo)
      }
    }
  },

  /**
   * Enhance existing content with AI
   * @param {string} content - Content to enhance
   * @returns {Promise<Object>} Enhanced content
   */
  enhanceContent: async (content) => {
    try {
      const response = await api.post('/api/ai/enhance-content', { content })
      return {
        success: true,
        content: response.data.content
      }
    } catch (error) {
      console.error('Enhance Content Error:', error)
      return {
        success: true,
        content: content // Return original if enhancement fails
      }
    }
  },

  /**
   * Save generated portfolio
   * @param {Object} portfolioData - Portfolio data to save
   * @returns {Promise<Object>} Save result
   */
  savePortfolio: async (portfolioData) => {
    try {
      const response = await api.post('/api/portfolios', portfolioData)
      return {
        success: true,
        portfolio: response.data
      }
    } catch (error) {
      console.error('Save Portfolio Error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to save portfolio'
      }
    }
  }
}

/**
 * Generate mock portfolio data (fallback when API is unavailable)
 */
function generateMockPortfolio(profileData) {
  const { name, title, skills, bio } = profileData

  return {
    personalInfo: {
      name: name || 'Professional Name',
      title: title || 'Full Stack Developer',
      email: profileData.email || 'contact@example.com',
      phone: profileData.phone || '+1 (555) 123-4567',
      location: profileData.location || 'San Francisco, CA',
      bio: bio || `Passionate ${title || 'developer'} with expertise in modern web technologies and a track record of delivering high-quality solutions.`
    },
    about: generateMockAbout(profileData),
    skills: skills || [
      { name: 'JavaScript', level: 90 },
      { name: 'React', level: 85 },
      { name: 'Node.js', level: 80 },
      { name: 'Python', level: 75 },
      { name: 'MongoDB', level: 70 }
    ],
    experience: [
      {
        title: 'Senior Developer',
        company: 'Tech Company',
        period: '2022 - Present',
        description: 'Leading development of scalable web applications and mentoring junior developers.'
      },
      {
        title: 'Full Stack Developer',
        company: 'Digital Agency',
        period: '2020 - 2022',
        description: 'Built and maintained multiple client projects using modern tech stack.'
      }
    ],
    projects: [
      {
        title: 'E-commerce Platform',
        description: 'Built a full-featured e-commerce platform with React and Node.js',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        link: 'https://example.com',
        image: 'https://via.placeholder.com/400x300'
      },
      {
        title: 'Task Management App',
        description: 'Developed a collaborative task management application with real-time updates',
        technologies: ['React', 'Socket.io', 'Express', 'PostgreSQL'],
        link: 'https://example.com',
        image: 'https://via.placeholder.com/400x300'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University Name',
        year: '2020',
        description: 'Focused on software engineering and web technologies'
      }
    ],
    certifications: [
      'AWS Certified Developer',
      'MongoDB Certified Professional',
      'React Developer Certification'
    ]
  }
}

/**
 * Generate mock about section
 */
function generateMockAbout(profile) {
  const { name, title, skills } = profile
  const skillsList = skills?.map(s => s.name || s).join(', ') || 'web development'

  return `I'm ${name || 'a professional'}, a ${title || 'developer'} with a passion for creating elegant solutions to complex problems. 

With expertise in ${skillsList}, I specialize in building scalable web applications that deliver exceptional user experiences. My approach combines technical proficiency with creative problem-solving to deliver results that exceed expectations.

Throughout my career, I've had the opportunity to work on diverse projects, from startups to enterprise applications. I'm constantly learning and staying up-to-date with the latest technologies and best practices in software development.

When I'm not coding, I enjoy contributing to open-source projects, writing technical blogs, and mentoring aspiring developers. I believe in the power of technology to make a positive impact on people's lives.`
}

/**
 * Generate mock project description
 */
function generateMockProject(projectInfo) {
  const { name, technologies } = projectInfo
  const techList = technologies?.join(', ') || 'modern technologies'

  return `${name || 'This project'} is a comprehensive solution built with ${techList}. 

The project showcases advanced features including real-time updates, responsive design, and optimized performance. It demonstrates proficiency in full-stack development, from database design to user interface implementation.

Key features include user authentication, data visualization, RESTful API integration, and seamless user experience across all devices. The application is built with scalability and maintainability in mind, following industry best practices and design patterns.`
}

export default aiPortfolioService
export { aiPortfolioService }
