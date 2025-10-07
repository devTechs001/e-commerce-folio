#!/usr/bin/env node

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '../.env') })

// Import models
import User from '../server/models/User.js'
import Portfolio from '../server/models/Portfolio.js'
import Template from '../server/models/Template.js'
import Job from '../server/models/Job.js'
import EmailCampaign from '../server/models/EmailCampaign.js'
import EmailSubscriber from '../server/models/EmailSubscriber.js'
import FreelanceProject from '../server/models/FreelanceProject.js'
import ClientReview from '../server/models/ClientReview.js'
import Revenue from '../server/models/Revenue.js'
import Analytics from '../server/models/Analytics.js'

// Comprehensive seed data
const seedData = {
  users: [
    {
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'user',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        bio: 'Full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies. Passionate about creating scalable web applications.',
        title: 'Senior Full Stack Developer',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'AWS', 'Docker'],
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
          },
          {
            title: 'Full Stack Developer',
            company: 'StartupXYZ',
            duration: '2019 - 2021',
            description: 'Built e-commerce platforms and mobile applications'
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
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        stripeCustomerId: 'cus_mock_john',
        stripeSubscriptionId: 'sub_mock_john'
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
        bio: 'Creative UI/UX designer with a passion for user-centered design and modern interfaces. Expert in Figma and design systems.',
        title: 'Senior UI/UX Designer',
        skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Design Systems'],
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
      },
      socialLinks: {
        linkedin: 'https://linkedin.com/in/janesmith',
        behance: 'https://behance.net/janesmith',
        dribbble: 'https://dribbble.com/janesmith'
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
        bio: 'Digital marketing specialist with expertise in SEO, content strategy, and performance marketing.',
        title: 'Digital Marketing Specialist',
        skills: ['SEO', 'Content Marketing', 'Google Analytics', 'Social Media', 'PPC', 'Email Marketing'],
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
    },
    {
      email: 'sarah.wilson@example.com',
      password: 'password123',
      role: 'user',
      profile: {
        firstName: 'Sarah',
        lastName: 'Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        bio: 'Startup founder and product manager looking for talented freelancers.',
        title: 'Product Manager',
        isFreelancer: false,
        location: 'Seattle, WA',
        languages: ['English']
      },
      subscription: {
        plan: 'pro',
        status: 'active'
      }
    }
  ],

  portfolios: [
    {
      title: 'John Doe - Full Stack Developer Portfolio',
      slug: 'john-doe-fullstack-developer',
      sections: [
        {
          type: 'hero',
          data: {
            name: 'John Doe',
            title: 'Senior Full Stack Developer',
            subtitle: 'Building amazing web experiences with modern technologies',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            cta: 'View My Work',
            socialLinks: {
              github: 'https://github.com/johndoe',
              linkedin: 'https://linkedin.com/in/johndoe'
            }
          },
          order: 0,
          isVisible: true
        },
        {
          type: 'about',
          data: {
            content: 'I am a passionate full-stack developer with over 5 years of experience building scalable web applications. I specialize in React, Node.js, and cloud technologies, helping businesses transform their ideas into powerful digital solutions.',
            skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'AWS'],
            image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400'
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
                description: 'Modern e-commerce solution built with React, Node.js, and Stripe integration',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
                technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
                link: 'https://github.com/johndoe/ecommerce',
                liveDemo: 'https://ecommerce-demo.johndoe.dev'
              },
              {
                title: 'Task Management App',
                description: 'Collaborative task management application with real-time updates',
                image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
                technologies: ['React', 'Socket.io', 'Express', 'PostgreSQL'],
                link: 'https://github.com/johndoe/taskmanager'
              }
            ]
          },
          order: 2,
          isVisible: true
        },
        {
          type: 'contact',
          data: {
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
            availability: 'Available for freelance projects'
          },
          order: 3,
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
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter'
        },
        spacing: 'comfortable'
      },
      settings: {
        isPublished: true,
        customDomain: 'johndoe.dev',
        seo: {
          title: 'John Doe - Senior Full Stack Developer',
          description: 'Experienced full-stack developer specializing in React, Node.js, and cloud technologies. Available for freelance projects.',
          keywords: ['full stack developer', 'react developer', 'node.js', 'freelancer']
        },
        socialSharing: {
          enabled: true,
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
        }
      },
      analytics: {
        views: 1250,
        uniqueVisitors: 890,
        lastViewed: new Date()
      }
    }
  ],

  templates: [
    {
      name: 'Modern Developer',
      description: 'Clean and modern template perfect for developers and programmers',
      category: 'developer',
      price: 0,
      isPremium: false,
      previewImage: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400',
      demoUrl: 'https://templates.example.com/modern-developer',
      sections: ['hero', 'about', 'projects', 'skills', 'contact'],
      styles: {
        theme: 'modern',
        colors: { primary: '#0ea5e9', secondary: '#64748b' }
      },
      features: ['Responsive Design', 'Dark Mode', 'Contact Form'],
      downloads: 1250,
      ratings: { average: 4.8, count: 45 }
    },
    {
      name: 'Creative Portfolio',
      description: 'Vibrant and creative template for designers and artists',
      category: 'creative',
      price: 29,
      isPremium: true,
      previewImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
      demoUrl: 'https://templates.example.com/creative-portfolio',
      sections: ['hero', 'about', 'gallery', 'testimonials', 'contact'],
      styles: {
        theme: 'creative',
        colors: { primary: '#ec4899', secondary: '#8b5cf6' }
      },
      features: ['Animation Effects', 'Gallery Lightbox', 'Social Integration'],
      downloads: 890,
      ratings: { average: 4.9, count: 32 }
    },
    {
      name: 'Business Professional',
      description: 'Professional template for consultants and business professionals',
      category: 'business',
      price: 39,
      isPremium: true,
      previewImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      sections: ['hero', 'about', 'services', 'testimonials', 'blog', 'contact'],
      styles: {
        theme: 'classic',
        colors: { primary: '#1f2937', secondary: '#6b7280' }
      },
      features: ['Blog Integration', 'Service Pages', 'Testimonial Slider'],
      downloads: 567,
      ratings: { average: 4.7, count: 28 }
    }
  ],

  jobs: [
    {
      title: 'React Developer for E-commerce Project',
      description: 'We are looking for an experienced React developer to build a modern e-commerce platform. The project involves creating a responsive web application with shopping cart functionality, payment integration, and admin dashboard.',
      category: 'Web Development',
      budgetMin: 3000,
      budgetMax: 5000,
      duration: '2-3 months',
      skills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Stripe'],
      status: 'open',
      applications: [],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      location: 'Remote',
      experienceLevel: 'intermediate',
      projectType: 'fixed_price',
      requirements: [
        '3+ years of React experience',
        'Experience with e-commerce platforms',
        'Knowledge of payment gateways',
        'Strong portfolio of web applications'
      ]
    },
    {
      title: 'UI/UX Design for Mobile App',
      description: 'Need a talented designer to create user interface designs for our fitness tracking mobile application. The project includes user research, wireframing, prototyping, and final UI designs.',
      category: 'Design',
      budgetMin: 2000,
      budgetMax: 3500,
      duration: '1-2 months',
      skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Mobile Design'],
      status: 'open',
      applications: [],
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      location: 'Remote',
      experienceLevel: 'expert',
      projectType: 'fixed_price'
    },
    {
      title: 'SEO Optimization for SaaS Platform',
      description: 'Looking for an SEO specialist to improve our SaaS platform\'s search engine rankings. The project includes keyword research, on-page optimization, content strategy, and link building.',
      category: 'Marketing',
      budgetMin: 1500,
      budgetMax: 2500,
      duration: '3-4 months',
      skills: ['SEO', 'Content Marketing', 'Google Analytics', 'Keyword Research'],
      status: 'in_progress',
      applications: [],
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      location: 'Remote',
      experienceLevel: 'intermediate',
      projectType: 'hourly'
    }
  ]
}

// Extended data for additional features
const extendedData = {
  emailCampaigns: [
    {
      name: 'Portfolio Launch Announcement',
      subject: '🚀 Check out my new portfolio!',
      content: 'I\'m excited to share my updated portfolio with you. It features my latest projects and skills. Take a look and let me know what you think!',
      status: 'sent',
      sentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      recipients: ['client1@example.com', 'client2@example.com', 'prospect1@example.com'],
      openRate: 24.5,
      clickRate: 8.2,
      type: 'announcement'
    },
    {
      name: 'Monthly Newsletter - March 2025',
      subject: '📰 Latest projects and updates',
      content: 'Here are my latest projects, achievements, and what I\'ve been working on this month.',
      status: 'draft',
      recipients: [],
      openRate: 0,
      clickRate: 0,
      type: 'newsletter'
    }
  ],

  emailSubscribers: [
    {
      email: 'client1@example.com',
      name: 'Alice Johnson',
      subscribed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      tags: ['client', 'web-development'],
      source: 'website'
    },
    {
      email: 'client2@example.com',
      name: 'Bob Wilson',
      subscribed: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      status: 'active',
      tags: ['prospect', 'design'],
      source: 'manual'
    }
  ],

  freelanceProjects: [
    {
      title: 'E-commerce Website Development',
      description: 'Built a complete e-commerce solution with React, Node.js, and Stripe integration',
      client: 'TechStart Inc.',
      status: 'completed',
      category: 'web_development',
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      budget: 5000,
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      progress: 100,
      rating: 5,
      testimonial: 'Excellent work! John delivered beyond our expectations and completed the project ahead of schedule.'
    },
    {
      title: 'Mobile App UI Design',
      description: 'Designed user interface for a fitness tracking mobile application',
      client: 'FitLife App',
      status: 'in_progress',
      category: 'design',
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      budget: 3500,
      technologies: ['Figma', 'Sketch', 'Prototyping'],
      progress: 75
    }
  ],

  clientReviews: [
    {
      clientName: 'Sarah Mitchell',
      clientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      clientEmail: 'sarah.mitchell@techstart.com',
      rating: 5,
      review: 'Outstanding developer! John completed our e-commerce project ahead of schedule and exceeded all expectations. His attention to detail and communication throughout the project was exceptional. Highly recommended!',
      projectTitle: 'E-commerce Platform Development',
      projectCategory: 'web_development',
      isVerified: true,
      verificationMethod: 'email',
      featured: true
    },
    {
      clientName: 'David Chen',
      clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      clientEmail: 'david@fitlifeapp.com',
      rating: 5,
      review: 'Jane\'s design skills are incredible. She created a beautiful and user-friendly interface for our fitness app. The user research and prototyping phase was thorough and professional.',
      projectTitle: 'Mobile App UI Design',
      projectCategory: 'design',
      isVerified: true,
      verificationMethod: 'linkedin'
    },
    {
      clientName: 'Lisa Rodriguez',
      clientAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      rating: 4,
      review: 'Great communication and solid technical skills. Mike helped us improve our SEO significantly and provided detailed reports on progress.',
      projectTitle: 'SEO Optimization Campaign',
      projectCategory: 'marketing',
      isVerified: false
    }
  ],

  revenueData: [
    {
      amount: 5000,
      source: 'freelance_project',
      description: 'E-commerce Platform Development',
      client: 'TechStart Inc.',
      status: 'paid',
      invoiceNumber: 'INV-2025-001',
      paidDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      paymentMethod: 'stripe',
      fees: { platform: 150, payment: 145, tax: 500 },
      transactionId: 'txn_mock_001'
    },
    {
      amount: 1200,
      source: 'template_sales',
      description: 'Creative Portfolio Template Sales',
      client: 'Multiple Buyers',
      status: 'paid',
      invoiceNumber: 'INV-2025-002',
      paidDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      paymentMethod: 'stripe',
      fees: { platform: 60, payment: 35 }
    },
    {
      amount: 3500,
      source: 'consulting',
      description: 'Technical Consulting - StartupXYZ',
      client: 'StartupXYZ',
      status: 'pending',
      invoiceNumber: 'INV-2025-003',
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    }
  ]
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting comprehensive database seeding...')
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-folio'
    await mongoose.connect(mongoUri)
    console.log('📦 Connected to MongoDB')
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await Promise.all([
      User.deleteMany({}),
      Portfolio.deleteMany({}),
      Template.deleteMany({}),
      Job.deleteMany({}),
      EmailCampaign.deleteMany({}),
      EmailSubscriber.deleteMany({}),
      FreelanceProject.deleteMany({}),
      ClientReview.deleteMany({}),
      Revenue.deleteMany({}),
      Analytics.deleteMany({})
    ])
    
    // Create users
    console.log('👥 Creating users...')
    const users = []
    for (const userData of seedData.users) {
      const hashedPassword = await bcrypt.hash(userData.password, 12)
      const user = await User.create({
        ...userData,
        password: hashedPassword
      })
      users.push(user)
    }
    console.log(`✅ Created ${users.length} users`)
    
    // Create portfolios
    console.log('📁 Creating portfolios...')
    const portfolios = []
    for (let i = 0; i < seedData.portfolios.length; i++) {
      const portfolio = await Portfolio.create({
        ...seedData.portfolios[i],
        userId: users[i]._id
      })
      portfolios.push(portfolio)
    }
    console.log(`✅ Created ${portfolios.length} portfolios`)
    
    // Create templates
    console.log('🎨 Creating templates...')
    const templates = []
    for (const templateData of seedData.templates) {
      const template = await Template.create({
        ...templateData,
        createdBy: users[0]._id
      })
      templates.push(template)
    }
    console.log(`✅ Created ${templates.length} templates`)
    
    // Create jobs
    console.log('💼 Creating jobs...')
    const jobs = []
    for (const jobData of seedData.jobs) {
      const job = await Job.create({
        ...jobData,
        clientId: users[3]._id // Sarah Wilson as client
      })
      jobs.push(job)
    }
    console.log(`✅ Created ${jobs.length} jobs`)
    
    // Create email campaigns
    console.log('📧 Creating email campaigns...')
    const campaigns = []
    for (const campaignData of extendedData.emailCampaigns) {
      const campaign = await EmailCampaign.create({
        ...campaignData,
        userId: users[0]._id
      })
      campaigns.push(campaign)
    }
    console.log(`✅ Created ${campaigns.length} email campaigns`)
    
    // Create email subscribers
    console.log('📮 Creating email subscribers...')
    const subscribers = []
    for (const subscriberData of extendedData.emailSubscribers) {
      const subscriber = await EmailSubscriber.create({
        ...subscriberData,
        userId: users[0]._id
      })
      subscribers.push(subscriber)
    }
    console.log(`✅ Created ${subscribers.length} email subscribers`)
    
    // Create freelance projects
    console.log('🚀 Creating freelance projects...')
    const projects = []
    for (const projectData of extendedData.freelanceProjects) {
      const project = await FreelanceProject.create({
        ...projectData,
        freelancerId: users[0]._id,
        clientId: users[3]._id
      })
      projects.push(project)
    }
    console.log(`✅ Created ${projects.length} freelance projects`)
    
    // Create client reviews
    console.log('⭐ Creating client reviews...')
    const reviews = []
    for (let i = 0; i < extendedData.clientReviews.length; i++) {
      const review = await ClientReview.create({
        ...extendedData.clientReviews[i],
        freelancerId: users[i]._id,
        projectId: projects[0]?._id
      })
      reviews.push(review)
    }
    console.log(`✅ Created ${reviews.length} client reviews`)
    
    // Create revenue data
    console.log('💰 Creating revenue data...')
    const revenues = []
    for (const revenueData of extendedData.revenueData) {
      const revenue = await Revenue.create({
        ...revenueData,
        userId: users[0]._id,
        projectId: projects[0]?._id
      })
      revenues.push(revenue)
    }
    console.log(`✅ Created ${revenues.length} revenue records`)
    
    // Create analytics data
    console.log('📊 Creating analytics data...')
    const analytics = []
    for (let i = 0; i < 7; i++) {
      const analytic = await Analytics.create({
        portfolioId: portfolios[0]._id,
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        views: Math.floor(Math.random() * 50) + 20,
        uniqueVisitors: Math.floor(Math.random() * 40) + 15,
        visitors: [
          {
            ip: '192.168.1.' + Math.floor(Math.random() * 255),
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            country: 'United States',
            city: 'San Francisco',
            referrer: 'https://google.com'
          }
        ],
        sources: {
          direct: Math.floor(Math.random() * 20),
          organic: Math.floor(Math.random() * 15),
          social: Math.floor(Math.random() * 10),
          referral: Math.floor(Math.random() * 8)
        }
      })
      analytics.push(analytic)
    }
    console.log(`✅ Created ${analytics.length} analytics records`)
    
    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\n📋 Summary:')
    console.log(`👥 Users: ${users.length}`)
    console.log(`📁 Portfolios: ${portfolios.length}`)
    console.log(`🎨 Templates: ${templates.length}`)
    console.log(`💼 Jobs: ${jobs.length}`)
    console.log(`📧 Email Campaigns: ${campaigns.length}`)
    console.log(`📮 Email Subscribers: ${subscribers.length}`)
    console.log(`🚀 Freelance Projects: ${projects.length}`)
    console.log(`⭐ Client Reviews: ${reviews.length}`)
    console.log(`💰 Revenue Records: ${revenues.length}`)
    console.log(`📊 Analytics Records: ${analytics.length}`)
    
    console.log('\n🔐 Test User Credentials:')
    console.log('Email: john.doe@example.com | Password: password123 (Premium User)')
    console.log('Email: jane.smith@example.com | Password: password123 (Enterprise User)')
    console.log('Email: mike.johnson@example.com | Password: password123 (Free User)')
    console.log('Email: sarah.wilson@example.com | Password: password123 (Client)')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('📦 Disconnected from MongoDB')
    process.exit(0)
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
}

export default seedDatabase
