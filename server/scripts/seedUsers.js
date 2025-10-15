import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

const testUsers = [
  {
    email: 'admin@efolio.com',
    password: 'Admin123!',
    role: 'admin',
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      bio: 'System Administrator',
      title: 'Platform Administrator'
    },
    subscription: {
      plan: 'enterprise',
      status: 'active'
    }
  },
  {
    email: 'owner@efolio.com',
    password: 'Owner123!',
    role: 'owner',
    profile: {
      firstName: 'Owner',
      lastName: 'User',
      bio: 'Platform Owner',
      title: 'CEO & Founder'
    },
    subscription: {
      plan: 'enterprise',
      status: 'active'
    }
  },
  {
    email: 'pro@efolio.com',
    password: 'Pro123!',
    role: 'user',
    profile: {
      firstName: 'Pro',
      lastName: 'User',
      bio: 'Professional Developer',
      title: 'Full Stack Developer'
    },
    subscription: {
      plan: 'pro',
      status: 'active'
    }
  },
  {
    email: 'free@efolio.com',
    password: 'Free123!',
    role: 'user',
    profile: {
      firstName: 'Free',
      lastName: 'User',
      bio: 'Aspiring Developer',
      title: 'Junior Developer'
    },
    subscription: {
      plan: 'free',
      status: 'active'
    }
  },
  {
    email: 'freelancer@efolio.com',
    password: 'Freelancer123!',
    role: 'user',
    profile: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      bio: 'Experienced freelance developer with 5+ years in web development',
      title: 'Freelance Full Stack Developer',
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
      hourlyRate: 85,
      isFreelancer: true,
      rating: 4.9,
      reviewCount: 156,
      completedJobs: 89,
      responseTime: '2 hours',
      location: 'New York, USA',
      languages: ['English', 'Spanish'],
      portfolio: [
        {
          title: 'E-Commerce Platform',
          description: 'Full-stack e-commerce solution with React and Node.js',
          technologies: ['React', 'Node.js', 'MongoDB'],
          link: '#'
        }
      ],
      experience: [
        {
          title: 'Senior Full Stack Developer',
          company: 'Tech Solutions Inc.',
          duration: '2019-2023',
          description: 'Led development of multiple web applications'
        }
      ]
    },
    subscription: {
      plan: 'pro',
      status: 'active'
    }
  },
  {
    email: 'designer@efolio.com',
    password: 'Designer123!',
    role: 'user',
    profile: {
      firstName: 'Mike',
      lastName: 'Chen',
      bio: 'Creative UI/UX designer specializing in mobile and web design',
      title: 'UI/UX Designer',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator'],
      hourlyRate: 75,
      isFreelancer: true,
      rating: 4.8,
      reviewCount: 203,
      completedJobs: 124,
      responseTime: '1 hour',
      location: 'San Francisco, USA',
      languages: ['English', 'Mandarin'],
      portfolio: [
        {
          title: 'Mobile Banking App',
          description: 'Complete UI/UX design for iOS and Android banking application',
          technologies: ['Figma', 'Principle', 'Sketch'],
          link: '#'
        }
      ]
    },
    subscription: {
      plan: 'pro',
      status: 'active'
    }
  }
]

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-folio')
    console.log('✅ Connected to MongoDB')

    // Clear existing test users
    await User.deleteMany({ email: { $in: testUsers.map(u => u.email) } })
    console.log('🗑️  Cleared existing test users')

    // Create test users
    for (const userData of testUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      
      const user = new User({
        ...userData,
        password: hashedPassword
      })

      await user.save()
      console.log(`✅ Created ${userData.role} user: ${userData.email}`)
    }

    console.log('\n🎉 Test users created successfully!\n')
    console.log('Login Credentials:')
    console.log('==================')
    testUsers.forEach(u => {
      console.log(`${u.role.toUpperCase().padEnd(10)} - Email: ${u.email.padEnd(25)} Password: ${u.password}`)
    })
    console.log('\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding users:', error)
    process.exit(1)
  }
}

seedUsers()
