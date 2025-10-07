import mongoose from 'mongoose'

// Extended sample data for additional categories
export const extendedSeedData = {
  // Email Marketing Campaigns
  emailCampaigns: [
    {
      name: 'Portfolio Launch Announcement',
      subject: 'Check out my new portfolio!',
      content: 'I\'m excited to share my updated portfolio with you...',
      status: 'sent',
      sentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      recipients: ['client1@example.com', 'client2@example.com'],
      openRate: 24.5,
      clickRate: 8.2,
      type: 'announcement'
    },
    {
      name: 'Monthly Newsletter - March',
      subject: 'Latest projects and updates',
      content: 'Here are my latest projects and achievements...',
      status: 'draft',
      recipients: [],
      openRate: 0,
      clickRate: 0,
      type: 'newsletter'
    },
    {
      name: 'Client Testimonial Showcase',
      subject: 'What clients are saying about my work',
      content: 'I wanted to share some amazing feedback...',
      status: 'scheduled',
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      recipients: ['subscriber1@example.com', 'subscriber2@example.com'],
      type: 'testimonial'
    }
  ],

  // Email Subscribers
  emailSubscribers: [
    {
      email: 'client1@example.com',
      name: 'Alice Johnson',
      subscribed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      tags: ['client', 'web-development']
    },
    {
      email: 'client2@example.com',
      name: 'Bob Wilson',
      subscribed: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      status: 'active',
      tags: ['prospect', 'design']
    },
    {
      email: 'subscriber1@example.com',
      name: 'Carol Davis',
      subscribed: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      status: 'active',
      tags: ['newsletter']
    }
  ],

  // Social Media Connections
  socialConnections: [
    {
      platform: 'linkedin',
      connected: true,
      accessToken: 'mock_linkedin_token',
      refreshToken: 'mock_linkedin_refresh',
      connectedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      settings: {
        autoPost: true,
        postTypes: ['portfolio_update', 'new_project']
      }
    },
    {
      platform: 'github',
      connected: true,
      accessToken: 'mock_github_token',
      connectedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      settings: {
        syncRepositories: true,
        showContributions: true
      }
    },
    {
      platform: 'twitter',
      connected: false,
      settings: {
        autoPost: false
      }
    }
  ],

  // Freelancing Projects
  freelanceProjects: [
    {
      title: 'E-commerce Website Development',
      description: 'Built a complete e-commerce solution with React and Node.js',
      client: 'TechStart Inc.',
      status: 'completed',
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      budget: 5000,
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      rating: 5,
      testimonial: 'Excellent work! John delivered beyond our expectations.'
    },
    {
      title: 'Mobile App UI Design',
      description: 'Designed user interface for a fitness tracking mobile application',
      client: 'FitLife App',
      status: 'in_progress',
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      budget: 3500,
      technologies: ['Figma', 'Sketch', 'Prototyping'],
      progress: 75
    }
  ],

  // Client Reviews
  clientReviews: [
    {
      clientName: 'Sarah Mitchell',
      clientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      rating: 5,
      review: 'Outstanding developer! John completed our project ahead of schedule and exceeded all expectations. Highly recommended!',
      projectTitle: 'E-commerce Platform',
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
    },
    {
      clientName: 'David Chen',
      clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      rating: 5,
      review: 'Jane\'s design skills are incredible. She created a beautiful and user-friendly interface for our app.',
      projectTitle: 'Mobile App Design',
      date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000)
    },
    {
      clientName: 'Lisa Rodriguez',
      clientAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      rating: 4,
      review: 'Great communication and solid technical skills. Mike helped us improve our SEO significantly.',
      projectTitle: 'SEO Optimization',
      date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000)
    }
  ],

  // Analytics Data
  analyticsData: [
    {
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      portfolioViews: 42,
      uniqueVisitors: 35,
      pageViews: 128,
      bounceRate: 0.25,
      avgSessionDuration: 180,
      topPages: [
        { page: '/portfolio', views: 45 },
        { page: '/about', views: 32 },
        { page: '/contact', views: 28 }
      ],
      trafficSources: [
        { source: 'Direct', visitors: 15 },
        { source: 'Google', visitors: 12 },
        { source: 'LinkedIn', visitors: 8 }
      ]
    },
    {
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      portfolioViews: 38,
      uniqueVisitors: 31,
      pageViews: 115,
      bounceRate: 0.22,
      avgSessionDuration: 195
    },
    {
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      portfolioViews: 51,
      uniqueVisitors: 43,
      pageViews: 156,
      bounceRate: 0.18,
      avgSessionDuration: 210
    }
  ],

  // Revenue Data
  revenueData: [
    {
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      amount: 2500,
      source: 'Freelance Project',
      client: 'TechStart Inc.',
      status: 'paid',
      invoiceNumber: 'INV-001'
    },
    {
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      amount: 1800,
      source: 'Template Sales',
      client: 'Multiple Buyers',
      status: 'paid',
      invoiceNumber: 'INV-002'
    },
    {
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      amount: 3200,
      source: 'Consulting',
      client: 'StartupXYZ',
      status: 'pending',
      invoiceNumber: 'INV-003'
    }
  ],

  // Blog Posts
  blogPosts: [
    {
      title: 'Building Modern Web Applications with React',
      slug: 'building-modern-web-apps-react',
      excerpt: 'Learn the best practices for building scalable React applications...',
      content: 'React has revolutionized the way we build web applications...',
      author: 'John Doe',
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      tags: ['React', 'JavaScript', 'Web Development'],
      featured: true,
      readTime: 8,
      views: 1250
    },
    {
      title: 'The Future of UI/UX Design',
      slug: 'future-of-ui-ux-design',
      excerpt: 'Exploring upcoming trends in user interface and experience design...',
      content: 'The design landscape is constantly evolving...',
      author: 'Jane Smith',
      publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      tags: ['UI/UX', 'Design', 'Trends'],
      featured: false,
      readTime: 6,
      views: 890
    }
  ],

  // Integrations
  integrations: [
    {
      name: 'Google Analytics',
      type: 'analytics',
      connected: true,
      apiKey: 'mock_ga_key',
      settings: {
        trackingId: 'UA-123456789-1',
        enableEcommerce: true
      }
    },
    {
      name: 'Stripe',
      type: 'payment',
      connected: true,
      apiKey: 'mock_stripe_key',
      settings: {
        currency: 'USD',
        webhookUrl: 'https://yoursite.com/webhook/stripe'
      }
    },
    {
      name: 'Mailchimp',
      type: 'email',
      connected: false,
      settings: {}
    }
  ],

  // Skills & Certifications
  skills: [
    {
      name: 'JavaScript',
      level: 'Expert',
      yearsOfExperience: 5,
      category: 'Programming'
    },
    {
      name: 'React',
      level: 'Expert',
      yearsOfExperience: 4,
      category: 'Framework'
    },
    {
      name: 'Node.js',
      level: 'Advanced',
      yearsOfExperience: 3,
      category: 'Backend'
    },
    {
      name: 'UI/UX Design',
      level: 'Intermediate',
      yearsOfExperience: 2,
      category: 'Design'
    }
  ],

  certifications: [
    {
      name: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      issueDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 545 * 24 * 60 * 60 * 1000),
      credentialId: 'AWS-DEV-123456',
      verified: true
    },
    {
      name: 'Google Analytics Certified',
      issuer: 'Google',
      issueDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000),
      credentialId: 'GA-CERT-789012',
      verified: true
    }
  ]
}

// Function to seed extended data
export const seedExtendedData = async (users) => {
  try {
    console.log('🌱 Seeding extended data...')
    
    // Create email campaigns for first user
    const EmailCampaign = (await import('../server/models/EmailCampaign.js')).default
    const campaigns = []
    for (const campaignData of extendedSeedData.emailCampaigns) {
      const campaign = await EmailCampaign.create({
        ...campaignData,
        userId: users[0]._id
      })
      campaigns.push(campaign)
    }
    console.log(`📧 Created ${campaigns.length} email campaigns`)
    
    // Create email subscribers
    const EmailSubscriber = (await import('../server/models/EmailSubscriber.js')).default
    const subscribers = []
    for (const subscriberData of extendedSeedData.emailSubscribers) {
      const subscriber = await EmailSubscriber.create({
        ...subscriberData,
        userId: users[0]._id
      })
      subscribers.push(subscriber)
    }
    console.log(`👥 Created ${subscribers.length} email subscribers`)
    
    // Create freelance projects
    const FreelanceProject = (await import('../server/models/FreelanceProject.js')).default
    const projects = []
    for (const projectData of extendedSeedData.freelanceProjects) {
      const project = await FreelanceProject.create({
        ...projectData,
        freelancerId: users[0]._id
      })
      projects.push(project)
    }
    console.log(`💼 Created ${projects.length} freelance projects`)
    
    // Create client reviews
    const Review = (await import('../server/models/Review.js')).default
    const reviews = []
    for (const reviewData of extendedSeedData.clientReviews) {
      const review = await Review.create({
        ...reviewData,
        freelancerId: users[Math.floor(Math.random() * users.length)]._id
      })
      reviews.push(review)
    }
    console.log(`⭐ Created ${reviews.length} client reviews`)
    
    // Create analytics data
    const Analytics = (await import('../server/models/Analytics.js')).default
    const analytics = []
    for (const analyticsItem of extendedSeedData.analyticsData) {
      const analytic = await Analytics.create({
        ...analyticsItem,
        userId: users[0]._id
      })
      analytics.push(analytic)
    }
    console.log(`📊 Created ${analytics.length} analytics records`)
    
    // Create revenue data
    const Revenue = (await import('../server/models/Revenue.js')).default
    const revenues = []
    for (const revenueItem of extendedSeedData.revenueData) {
      const revenue = await Revenue.create({
        ...revenueItem,
        userId: users[0]._id
      })
      revenues.push(revenue)
    }
    console.log(`💰 Created ${revenues.length} revenue records`)
    
    console.log('✅ Extended data seeding completed!')
    
    return {
      campaigns,
      subscribers,
      projects,
      reviews,
      analytics,
      revenues
    }
    
  } catch (error) {
    console.error('❌ Error seeding extended data:', error)
    // Continue even if some models don't exist yet
    console.log('⚠️  Some models may not exist yet, skipping...')
    return {}
  }
}
