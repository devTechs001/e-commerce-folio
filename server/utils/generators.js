import crypto from 'crypto'
import mongoose from 'mongoose'

// Generate unique slugs for portfolios, templates, etc.
export const generateSlug = (text, existingSlugs = []) => {
  if (!text || typeof text !== 'string') {
    throw new Error('Text must be a non-empty string')
  }

  let baseSlug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
    .slice(0, 100) // Limit length

  // If base slug is empty after processing, generate random slug
  if (!baseSlug) {
    baseSlug = generateRandomSlug(8)
  }

  let slug = baseSlug
  let counter = 1

  // Ensure unique slug
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
    
    // Prevent infinite loop
    if (counter > 100) {
      slug = `${baseSlug}-${Date.now()}`
      break
    }
  }

  return slug
}

// Generate random slug for cases where text is not available
export const generateRandomSlug = (length = 8) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Generate secure API keys
export const generateAPIKey = (prefix = 'ef_') => {
  const randomPart = crypto.randomBytes(32).toString('hex')
  return `${prefix}${randomPart}`
}

// Generate secure tokens for various purposes
export const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex')
}

// Generate invitation codes for collaboration
export const generateInviteCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Generate strong passwords
export const generatePassword = (length = 12) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  const allChars = uppercase + lowercase + numbers + symbols
  let password = ''
  
  // Ensure at least one of each character type
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length))
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length))
  password += numbers.charAt(Math.floor(Math.random() * numbers.length))
  password += symbols.charAt(Math.floor(Math.random() * symbols.length))
  
  // Fill the rest with random characters
  for (let i = 4; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length))
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

// Generate color palettes based on base color
export const generateColorPalette = (baseColor = '#0ea5e9') => {
  // Validate hex color
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(baseColor)) {
    baseColor = '#0ea5e9' // Fallback to default
  }

  // Ensure 6-digit hex
  if (baseColor.length === 4) {
    baseColor = '#' + baseColor[1] + baseColor[1] + baseColor[2] + baseColor[2] + baseColor[3] + baseColor[3]
  }

  const base = baseColor.replace('#', '')
  const r = parseInt(base.substr(0, 2), 16)
  const g = parseInt(base.substr(2, 2), 16)
  const b = parseInt(base.substr(4, 2), 16)

  // Generate complementary colors
  const complementary = `#${((1 << 24) + (255 - r) + (255 - g) * 256 + (255 - b) * 65536).toString(16).slice(1)}`
  
  // Generate analogous colors (30° apart)
  const analogous1 = adjustHue(baseColor, 30)
  const analogous2 = adjustHue(baseColor, -30)
  
  // Generate triadic colors (120° apart)
  const triadic1 = adjustHue(baseColor, 120)
  const triadic2 = adjustHue(baseColor, 240)
  
  // Generate shades and tints
  const shades = generateShades(baseColor, 5)
  const tints = generateTints(baseColor, 5)

  return {
    primary: baseColor,
    secondary: complementary,
    accent: analogous1,
    analogous: [analogous1, analogous2],
    triadic: [triadic1, triadic2],
    shades,
    tints,
    background: '#ffffff',
    surface: '#f8fafc',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      disabled: '#94a3b8'
    }
  }
}

// Generate portfolio ID with prefix
export const generatePortfolioId = () => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `pf_${timestamp}_${random}`.toUpperCase()
}

// Generate template ID
export const generateTemplateId = () => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `tmpl_${timestamp}_${random}`.toUpperCase()
}

// Generate order/invoice numbers
export const generateOrderNumber = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.random().toString(36).substr(2, 6).toUpperCase()
  return `ORD-${year}${month}${day}-${random}`
}

// Generate invoice numbers
export const generateInvoiceNumber = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const sequential = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
  return `INV-${year}${month}-${sequential}`
}

// Generate default portfolio content
export const generateDefaultPortfolioContent = (user, templateType = 'professional') => {
  const firstName = user?.profile?.firstName || 'Your'
  const lastName = user?.profile?.lastName || 'Name'
  const title = user?.profile?.title || 'Professional'
  
  const templates = {
    professional: {
      hero: {
        title: `Hi, I'm ${firstName} ${lastName}`,
        subtitle: `${title} | Portfolio`,
        description: 'Welcome to my professional portfolio. I create amazing work and solve complex problems.'
      },
      about: {
        title: 'About Me',
        content: `I'm a passionate ${title.toLowerCase()} with expertise in delivering high-quality solutions. I believe in continuous learning and pushing boundaries to achieve outstanding results.`
      },
      skills: {
        title: 'Skills & Expertise',
        items: ['Project Management', 'Creative Problem Solving', 'Team Leadership', 'Technical Expertise']
      }
    },
    creative: {
      hero: {
        title: `Creative Portfolio of ${firstName} ${lastName}`,
        subtitle: 'Designer & Creative Professional',
        description: 'Exploring the intersection of design, technology, and user experience.'
      },
      about: {
        title: 'My Creative Journey',
        content: 'I blend artistic vision with technical expertise to create compelling digital experiences that resonate with audiences.'
      },
      skills: {
        title: 'Creative Skills',
        items: ['UI/UX Design', 'Brand Identity', 'Visual Design', 'Creative Direction']
      }
    },
    minimal: {
      hero: {
        title: `${firstName} ${lastName}`,
        subtitle: title,
        description: 'Clean. Simple. Effective.'
      },
      about: {
        title: 'About',
        content: 'Focused on delivering quality work with attention to detail and precision.'
      },
      skills: {
        title: 'Capabilities',
        items: ['Strategic Thinking', 'Quality Focus', 'Efficient Execution', 'Continuous Improvement']
      }
    }
  }

  return templates[templateType] || templates.professional
}

// Generate default portfolio sections
export const generateDefaultPortfolioSections = (user) => {
  const content = generateDefaultPortfolioContent(user)
  
  return [
    {
      type: 'hero',
      order: 1,
      isVisible: true,
      data: content.hero
    },
    {
      type: 'about',
      order: 2,
      isVisible: true,
      data: content.about
    },
    {
      type: 'skills',
      order: 3,
      isVisible: true,
      data: content.skills
    },
    {
      type: 'projects',
      order: 4,
      isVisible: true,
      data: {
        title: 'Projects',
        items: []
      }
    },
    {
      type: 'experience',
      order: 5,
      isVisible: true,
      data: {
        title: 'Experience',
        items: []
      }
    },
    {
      type: 'education',
      order: 6,
      isVisible: true,
      data: {
        title: 'Education',
        items: []
      }
    },
    {
      type: 'contact',
      order: 7,
      isVisible: true,
      data: {
        title: 'Get In Touch',
        email: user?.email || '',
        socialLinks: {}
      }
    }
  ]
}

// Generate sample project data
export const generateSampleProjects = (count = 3) => {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'Built a scalable e-commerce solution with React and Node.js',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      image: '/images/projects/ecommerce.jpg',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example'
    },
    {
      title: 'Mobile Application',
      description: 'Developed a cross-platform mobile app for task management',
      technologies: ['React Native', 'Firebase', 'Redux'],
      image: '/images/projects/mobile-app.jpg',
      liveUrl: 'https://example.com/app',
      githubUrl: 'https://github.com/example/app'
    },
    {
      title: 'Dashboard Design',
      description: 'Created an analytics dashboard with real-time data visualization',
      technologies: ['Vue.js', 'D3.js', 'Express', 'PostgreSQL'],
      image: '/images/projects/dashboard.jpg',
      liveUrl: 'https://example.com/dashboard',
      githubUrl: 'https://github.com/example/dashboard'
    },
    {
      title: 'API Development',
      description: 'Built a RESTful API with comprehensive documentation',
      technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
      image: '/images/projects/api.jpg',
      liveUrl: 'https://api.example.com/docs',
      githubUrl: 'https://github.com/example/api'
    },
    {
      title: 'Brand Identity',
      description: 'Designed complete brand identity for startup company',
      technologies: ['Adobe Creative Suite', 'Figma', 'Brand Strategy'],
      image: '/images/projects/branding.jpg',
      liveUrl: 'https://example.com/brand',
      githubUrl: null
    }
  ]

  return projects.slice(0, count)
}

// Generate sample skills data
export const generateSampleSkills = (category = 'technical') => {
  const skillCategories = {
    technical: [
      { name: 'JavaScript', level: 90, category: 'frontend' },
      { name: 'React', level: 85, category: 'frontend' },
      { name: 'Node.js', level: 80, category: 'backend' },
      { name: 'Python', level: 75, category: 'backend' },
      { name: 'MongoDB', level: 70, category: 'database' },
      { name: 'AWS', level: 65, category: 'devops' }
    ],
    design: [
      { name: 'UI/UX Design', level: 85, category: 'design' },
      { name: 'Figma', level: 80, category: 'tools' },
      { name: 'Adobe Creative Suite', level: 75, category: 'tools' },
      { name: 'Typography', level: 70, category: 'design' },
      { name: 'Color Theory', level: 65, category: 'design' }
    ],
    business: [
      { name: 'Project Management', level: 85, category: 'management' },
      { name: 'Agile Methodology', level: 80, category: 'methodology' },
      { name: 'Team Leadership', level: 75, category: 'management' },
      { name: 'Strategic Planning', level: 70, category: 'strategy' }
    ]
  }

  return skillCategories[category] || skillCategories.technical
}

// Generate verification codes
export const generateVerificationCode = (length = 6) => {
  const numbers = '0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }
  return code
}

// Generate unique filename for uploads
export const generateUniqueFilename = (originalname, prefix = '') => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  const extension = originalname.split('.').pop()
  const safeName = originalname
    .split('.')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  
  return `${prefix}${safeName}-${timestamp}-${random}.${extension}`
}

// Generate MongoDB ObjectId
export const generateObjectId = () => {
  return new mongoose.Types.ObjectId()
}

// Generate pagination metadata
export const generatePagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit)
  const hasNext = page < totalPages
  const hasPrev = page > 1
  
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNext,
    hasPrev,
    nextPage: hasNext ? page + 1 : null,
    prevPage: hasPrev ? page - 1 : null
  }
}

// Helper functions for color manipulation
const adjustHue = (hex, degrees) => {
  // Convert hex to HSL, adjust hue, convert back to hex
  // Simplified implementation - in production, use a proper color library
  const r = parseInt(hex.substr(1, 2), 16)
  const g = parseInt(hex.substr(3, 2), 16)
  const b = parseInt(hex.substr(5, 2), 16)
  
  // Simple hue adjustment (this is a basic approximation)
  const factor = degrees / 360
  const newR = Math.min(255, Math.max(0, Math.floor(r + (255 - r) * factor)))
  const newG = Math.min(255, Math.max(0, Math.floor(g + (255 - g) * factor)))
  const newB = Math.min(255, Math.max(0, Math.floor(b + (255 - b) * factor)))
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

const generateShades = (hex, count) => {
  const shades = []
  const base = parseInt(hex.replace('#', ''), 16)
  
  for (let i = 1; i <= count; i++) {
    const factor = i / (count + 1)
    const shade = Math.floor(base * factor)
    shades.push(`#${shade.toString(16).padStart(6, '0')}`)
  }
  
  return shades
}

const generateTints = (hex, count) => {
  const tints = []
  const base = parseInt(hex.replace('#', ''), 16)
  
  for (let i = 1; i <= count; i++) {
    const factor = 1 - (i / (count + 1))
    const tint = Math.floor(base + (0xFFFFFF - base) * factor)
    tints.push(`#${tint.toString(16).padStart(6, '0')}`)
  }
  
  return tints
}

// Export all generators as a single object for easy importing
export default {
  generateSlug,
  generateRandomSlug,
  generateAPIKey,
  generateSecureToken,
  generateInviteCode,
  generatePassword,
  generateColorPalette,
  generatePortfolioId,
  generateTemplateId,
  generateOrderNumber,
  generateInvoiceNumber,
  generateDefaultPortfolioContent,
  generateDefaultPortfolioSections,
  generateSampleProjects,
  generateSampleSkills,
  generateVerificationCode,
  generateUniqueFilename,
  generateObjectId,
  generatePagination
}