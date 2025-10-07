import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Sample data for seeding the database
export const seedData = {
  users: [
    {
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'user',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        bio: 'Full-stack developer with 5 years of experience in React and Node.js',
        title: 'Senior Full Stack Developer',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python'],
        hourlyRate: 75,
        isFreelancer: true,
        rating: 4.8,
        reviewCount: 23,
        completedJobs: 45,
        responseTime: '2 hours',
        location: 'San Francisco, CA',
        languages: ['English', 'Spanish'],
        experience: [
          {
            title: 'Senior Developer',
            company: 'Tech Corp',
            duration: '2021 - Present',
            description: 'Lead development of web applications using React and Node.js'
          }
        ],
        education: [
          {
            degree: 'BS Computer Science',
            school: 'Stanford University',
            year: '2018'
          }
        ]
      },
      subscription: {
        plan: 'pro',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      socialLinks: {
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        twitter: 'https://twitter.com/johndoe',
        website: 'https://johndoe.dev'
      }
    },
    {
      email: 'jane.smith@example.com',
      password: 'password123',
      role: 'user',
      profile: {
        firstName: 'Jane',
        lastName: 'Smith',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        bio: 'Creative UI/UX designer passionate about user-centered design',
        title: 'UI/UX Designer',
        skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
        hourlyRate: 65,
        isFreelancer: true,
        rating: 4.9,
        reviewCount: 31,
        completedJobs: 67,
        responseTime: '1 hour',
        location: 'New York, NY',
        languages: ['English', 'French']
      },
      subscription: {
        plan: 'enterprise',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    },
    {
      email: 'mike.johnson@example.com',
      password: 'password123',
      role: 'user',
      profile: {
        firstName: 'Mike',
        lastName: 'Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        bio: 'Digital marketing specialist with expertise in SEO and content strategy',
        title: 'Digital Marketing Specialist',
        skills: ['SEO', 'Content Marketing', 'Google Analytics', 'Social Media', 'PPC'],
        hourlyRate: 55,
        isFreelancer: true,
        rating: 4.7,
        reviewCount: 18,
        completedJobs: 29,
        responseTime: '4 hours',
        location: 'Austin, TX',
        languages: ['English']
      },
      subscription: {
        plan: 'free',
        status: 'active'
      }
    }
  ],

  portfolios: [
    {
      title: 'John Doe - Full Stack Developer',
      slug: 'john-doe-fullstack',
      sections: [
        {
          type: 'hero',
          data: {
            name: 'John Doe',
            title: 'Full Stack Developer',
            subtitle: 'Building amazing web experiences',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            cta: 'View My Work'
          },
          order: 0,
          isVisible: true
        },
        {
          type: 'about',
          data: {
            content: 'I am a passionate full-stack developer with 5 years of experience...',
            skills: ['JavaScript', 'React', 'Node.js', 'MongoDB']
          },
          order: 1,
          isVisible: true
        },
        {
          type: 'projects',
          data: {
            projects: [
              {
                title: 'E-commerce Platform',
                description: 'Modern e-commerce solution built with React and Node.js',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
                technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
                link: 'https://github.com/johndoe/ecommerce'
              }
            ]
          },
          order: 2,
          isVisible: true
        }
      ],
      styles: {
        theme: 'modern',
        colors: {
          primary: '#0ea5e9',
          secondary: '#64748b',
          background: '#ffffff',
          text: '#1e293b'
        }
      },
      settings: {
        isPublished: true,
        seo: {
          title: 'John Doe - Full Stack Developer Portfolio',
          description: 'Professional portfolio showcasing web development projects'
        }
      }
    }
  ],

  templates: [
    {
      name: 'Modern Developer',
      description: 'Clean and modern template for developers',
      category: 'developer',
      price: 0,
      isPremium: false,
      previewImage: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400',
      sections: ['hero', 'about', 'projects', 'skills', 'contact'],
      styles: {
        theme: 'modern',
        colors: { primary: '#0ea5e9', secondary: '#64748b' }
      }
    },
    {
      name: 'Creative Portfolio',
      description: 'Vibrant template for creative professionals',
      category: 'creative',
      price: 29,
      isPremium: true,
      previewImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
      sections: ['hero', 'about', 'gallery', 'testimonials', 'contact'],
      styles: {
        theme: 'creative',
        colors: { primary: '#ec4899', secondary: '#8b5cf6' }
      }
    }
  ],

  jobs: [
    {
      title: 'React Developer for E-commerce Project',
      description: 'Looking for an experienced React developer to build a modern e-commerce platform...',
      category: 'Web Development',
      budgetMin: 3000,
      budgetMax: 5000,
      duration: '2-3 months',
      skills: ['React', 'JavaScript', 'Node.js', 'MongoDB'],
      clientId: null, // Will be set during seeding
      status: 'open',
      applications: [],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      location: 'Remote',
      experienceLevel: 'intermediate'
    },
    {
      title: 'UI/UX Design for Mobile App',
      description: 'Need a talented designer to create user interface designs for our mobile application...',
      category: 'Design',
      budgetMin: 2000,
      budgetMax: 3500,
      duration: '1-2 months',
      skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
      status: 'open',
      applications: [],
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      location: 'Remote',
      experienceLevel: 'expert'
    }
  ],

  messages: [
    {
      content: 'Hi, I saw your portfolio and I\'m interested in discussing a project with you.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false
    },
    {
      content: 'Thank you for your interest! I\'d be happy to discuss the project details.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isRead: true
    }
  ],

  notifications: [
    {
      title: 'New Job Match',
      message: 'A new React Developer job matches your skills',
      type: 'job_match',
      isRead: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      title: 'Portfolio View',
      message: 'Your portfolio was viewed 5 times today',
      type: 'portfolio_view',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ],

  analytics: [
    {
      date: new Date(),
      portfolioViews: 45,
      uniqueVisitors: 32,
      revenue: 1250,
      conversions: 3
    }
  ]
}

// Seeding function
export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Import models
    const User = (await import('../server/models/User.js')).default
    const Portfolio = (await import('../server/models/Portfolio.js')).default
    const Template = (await import('../server/models/Template.js')).default
    const Job = (await import('../server/models/Job.js')).default
    
    // Clear existing data
    await User.deleteMany({})
    await Portfolio.deleteMany({})
    await Template.deleteMany({})
    await Job.deleteMany({})
    
    console.log('🗑️  Cleared existing data')
    
    // Hash passwords and create users
    const users = []
    for (const userData of seedData.users) {
      const hashedPassword = await bcrypt.hash(userData.password, 12)
      const user = await User.create({
        ...userData,
        password: hashedPassword
      })
      users.push(user)
    }
    console.log(`👥 Created ${users.length} users`)
    
    // Create portfolios
    const portfolios = []
    for (let i = 0; i < seedData.portfolios.length; i++) {
      const portfolio = await Portfolio.create({
        ...seedData.portfolios[i],
        userId: users[i]._id
      })
      portfolios.push(portfolio)
    }
    console.log(`📁 Created ${portfolios.length} portfolios`)
    
    // Create templates
    const templates = []
    for (const templateData of seedData.templates) {
      const template = await Template.create({
        ...templateData,
        createdBy: users[0]._id
      })
      templates.push(template)
    }
    console.log(`🎨 Created ${templates.length} templates`)
    
    // Create jobs
    const jobs = []
    for (const jobData of seedData.jobs) {
      const job = await Job.create({
        ...jobData,
        clientId: users[Math.floor(Math.random() * users.length)]._id
      })
      jobs.push(job)
    }
    console.log(`💼 Created ${jobs.length} jobs`)
    
    console.log('✅ Database seeding completed successfully!')
    
    return {
      users,
      portfolios,
      templates,
      jobs
    }
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}
