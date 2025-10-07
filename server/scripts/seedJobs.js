import mongoose from 'mongoose'
import dotenv from 'dotenv'
import FreelancingJob from '../models/FreelancingJob.js'
import User from '../models/User.js'

dotenv.config()

const seedJobs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/efolio')
    console.log('✅ Connected to MongoDB')

    // Get test users to use as job posters
    const users = await User.find({ role: 'user' }).limit(3)
    if (users.length === 0) {
      console.log('❌ No users found. Please run seedUsers.js first')
      process.exit(1)
    }

    // Clear existing jobs
    await FreelancingJob.deleteMany({})
    console.log('🗑️  Cleared existing jobs')

    const sampleJobs = [
      {
        title: 'Full Stack Developer Needed for E-Commerce Platform',
        description: 'We are looking for an experienced full-stack developer to build a modern e-commerce platform. The project involves creating a responsive web application with user authentication, product catalog, shopping cart, and payment integration. You should be proficient in React, Node.js, and have experience with payment gateways like Stripe.',
        skills: ['React', 'Node.js', 'MongoDB', 'Stripe', 'JavaScript'],
        budgetMin: 5000,
        budgetMax: 8000,
        budgetType: 'fixed',
        duration: '2-3 months',
        experienceLevel: 'expert',
        category: 'Web Development',
        postedBy: users[0]._id,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isUrgent: false,
        tags: ['ecommerce', 'fullstack', 'react', 'nodejs']
      },
      {
        title: 'UI/UX Designer for Mobile Banking App',
        description: 'Seeking a talented UI/UX designer to create intuitive and modern designs for our mobile banking application. The project includes user research, wireframing, prototyping, and final UI designs for both iOS and Android platforms. Experience with financial applications is a plus.',
        skills: ['Figma', 'UI Design', 'UX Design', 'Mobile Design', 'Prototyping'],
        budgetMin: 3000,
        budgetMax: 5000,
        budgetType: 'fixed',
        duration: '1-2 months',
        experienceLevel: 'intermediate',
        category: 'Design',
        postedBy: users[1]._id,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        isUrgent: true,
        tags: ['mobile', 'banking', 'ui', 'ux', 'figma']
      },
      {
        title: 'React Native Developer for Social Media App',
        description: 'Looking for a skilled React Native developer to build a social media application. Features include user profiles, photo/video sharing, real-time messaging, push notifications, and social interactions. The app should work seamlessly on both iOS and Android.',
        skills: ['React Native', 'JavaScript', 'Firebase', 'Push Notifications', 'Socket.io'],
        budgetMin: 4000,
        budgetMax: 7000,
        budgetType: 'fixed',
        duration: '2-4 months',
        experienceLevel: 'expert',
        category: 'Mobile Development',
        postedBy: users[2]._id,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        isUrgent: false,
        tags: ['react-native', 'social-media', 'mobile', 'firebase']
      },
      {
        title: 'WordPress Developer for Business Website',
        description: 'Need an experienced WordPress developer to create a professional business website. Requirements include custom theme development, responsive design, SEO optimization, contact forms, and content management. The site should be fast, secure, and user-friendly.',
        skills: ['WordPress', 'PHP', 'HTML', 'CSS', 'JavaScript'],
        budgetMin: 1500,
        budgetMax: 3000,
        budgetType: 'fixed',
        duration: '3-4 weeks',
        experienceLevel: 'intermediate',
        category: 'Web Development',
        postedBy: users[0]._id,
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        isUrgent: false,
        tags: ['wordpress', 'php', 'business-website', 'seo']
      },
      {
        title: 'Data Scientist for Machine Learning Project',
        description: 'Seeking a data scientist to develop machine learning models for predictive analytics. The project involves data preprocessing, feature engineering, model development, and deployment. Experience with Python, TensorFlow/PyTorch, and cloud platforms is required.',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis', 'AWS'],
        budgetMin: 6000,
        budgetMax: 10000,
        budgetType: 'fixed',
        duration: '3-5 months',
        experienceLevel: 'expert',
        category: 'Data Science',
        postedBy: users[1]._id,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        isUrgent: false,
        tags: ['machine-learning', 'python', 'data-science', 'ai']
      },
      {
        title: 'DevOps Engineer for Cloud Infrastructure',
        description: 'Looking for a DevOps engineer to set up and manage cloud infrastructure. Responsibilities include CI/CD pipeline setup, containerization with Docker, Kubernetes orchestration, monitoring, and security implementation. AWS or Azure experience preferred.',
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
        budgetMin: 4500,
        budgetMax: 7500,
        budgetType: 'fixed',
        duration: '1-3 months',
        experienceLevel: 'expert',
        category: 'DevOps',
        postedBy: users[2]._id,
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
        isUrgent: true,
        tags: ['devops', 'aws', 'docker', 'kubernetes', 'cloud']
      }
    ]

    // Create jobs
    for (const jobData of sampleJobs) {
      const job = new FreelancingJob(jobData)
      await job.save()
      console.log(`✅ Created job: ${job.title}`)
    }

    console.log('\n🎉 Sample jobs created successfully!')
    console.log(`📊 Total jobs created: ${sampleJobs.length}`)
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding jobs:', error)
    process.exit(1)
  }
}

seedJobs()
