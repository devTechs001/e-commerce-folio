export const templateSamples = [
  {
    id: 'minimal-dev',
    name: 'Minimal Developer',
    category: 'developer',
    description: 'Clean and minimal portfolio for developers',
    thumbnail: '/templates/minimal-dev.jpg',
    preview: 'https://minimal-dev-demo.efolio.com',
    isPro: false,
    features: ['Responsive', 'Dark Mode', 'Project Showcase'],
    colors: {
      primary: '#3b82f6',
      secondary: '#1e293b',
      accent: '#0ea5e9'
    },
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Full Stack Developer',
        subtitle: 'Building scalable web applications',
        cta: 'View My Work'
      },
      {
        id: 'about',
        type: 'about',
        title: 'About Me',
        content: 'Passionate developer with 5+ years of experience...'
      },
      {
        id: 'projects',
        type: 'projects',
        title: 'Featured Projects',
        items: []
      },
      {
        id: 'skills',
        type: 'skills',
        title: 'Technical Skills',
        items: ['React', 'Node.js', 'TypeScript', 'MongoDB']
      },
      {
        id: 'contact',
        type: 'contact',
        title: 'Get In Touch'
      }
    ]
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    category: 'designer',
    description: 'Bold and creative portfolio for designers',
    thumbnail: '/templates/creative-designer.jpg',
    preview: 'https://creative-designer-demo.efolio.com',
    isPro: true,
    features: ['Animations', 'Gallery', 'Case Studies'],
    colors: {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      accent: '#f59e0b'
    },
    sections: [
      {
        id: 'hero',
        type: 'hero-creative',
        title: 'Creative Designer',
        subtitle: 'Crafting beautiful digital experiences'
      },
      {
        id: 'portfolio',
        type: 'gallery',
        title: 'My Work',
        layout: 'masonry'
      },
      {
        id: 'services',
        type: 'services',
        title: 'What I Do',
        items: ['UI/UX Design', 'Branding', 'Illustration']
      },
      {
        id: 'testimonials',
        type: 'testimonials',
        title: 'Client Feedback'
      },
      {
        id: 'contact',
        type: 'contact',
        title: 'Let\'s Work Together'
      }
    ]
  },
  {
    id: 'business-pro',
    name: 'Business Professional',
    category: 'business',
    description: 'Professional portfolio for consultants and executives',
    thumbnail: '/templates/business-pro.jpg',
    preview: 'https://business-pro-demo.efolio.com',
    isPro: true,
    features: ['Corporate', 'Blog', 'Testimonials'],
    colors: {
      primary: '#0f172a',
      secondary: '#475569',
      accent: '#3b82f6'
    },
    sections: [
      {
        id: 'hero',
        type: 'hero-professional',
        title: 'Business Consultant',
        subtitle: 'Helping businesses grow and scale'
      },
      {
        id: 'services',
        type: 'services-detailed',
        title: 'Services'
      },
      {
        id: 'experience',
        type: 'timeline',
        title: 'Professional Experience'
      },
      {
        id: 'testimonials',
        type: 'testimonials-carousel',
        title: 'What Clients Say'
      },
      {
        id: 'blog',
        type: 'blog',
        title: 'Latest Insights'
      },
      {
        id: 'contact',
        type: 'contact-form',
        title: 'Schedule a Consultation'
      }
    ]
  },
  {
    id: 'photographer',
    name: 'Photographer',
    category: 'creative',
    description: 'Stunning portfolio for photographers',
    thumbnail: '/templates/photographer.jpg',
    preview: 'https://photographer-demo.efolio.com',
    isPro: true,
    features: ['Full-screen Gallery', 'Lightbox', 'Albums'],
    colors: {
      primary: '#000000',
      secondary: '#ffffff',
      accent: '#ef4444'
    },
    sections: [
      {
        id: 'hero',
        type: 'hero-fullscreen',
        title: 'Visual Storyteller'
      },
      {
        id: 'gallery',
        type: 'gallery-grid',
        title: 'Portfolio',
        layout: 'grid'
      },
      {
        id: 'about',
        type: 'about-split',
        title: 'About Me'
      },
      {
        id: 'services',
        type: 'services',
        title: 'Photography Services'
      },
      {
        id: 'contact',
        type: 'contact',
        title: 'Book a Session'
      }
    ]
  },
  {
    id: 'freelancer',
    name: 'Freelancer',
    category: 'freelance',
    description: 'Versatile portfolio for freelancers',
    thumbnail: '/templates/freelancer.jpg',
    preview: 'https://freelancer-demo.efolio.com',
    isPro: false,
    features: ['Multi-purpose', 'Pricing Tables', 'FAQ'],
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#f59e0b'
    },
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Freelance Expert',
        subtitle: 'Available for your next project'
      },
      {
        id: 'services',
        type: 'services-cards',
        title: 'What I Offer'
      },
      {
        id: 'portfolio',
        type: 'projects',
        title: 'Recent Work'
      },
      {
        id: 'pricing',
        type: 'pricing',
        title: 'Pricing Plans'
      },
      {
        id: 'faq',
        type: 'faq',
        title: 'Frequently Asked Questions'
      },
      {
        id: 'contact',
        type: 'contact',
        title: 'Hire Me'
      }
    ]
  },
  {
    id: 'startup',
    name: 'Startup Landing',
    category: 'business',
    description: 'Modern landing page for startups',
    thumbnail: '/templates/startup.jpg',
    preview: 'https://startup-demo.efolio.com',
    isPro: true,
    features: ['SaaS Ready', 'CTA Focused', 'Metrics'],
    colors: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#ec4899'
    },
    sections: [
      {
        id: 'hero',
        type: 'hero-saas',
        title: 'Revolutionary Product',
        subtitle: 'Transform your workflow'
      },
      {
        id: 'features',
        type: 'features-grid',
        title: 'Key Features'
      },
      {
        id: 'metrics',
        type: 'stats',
        title: 'By The Numbers'
      },
      {
        id: 'testimonials',
        type: 'testimonials',
        title: 'Loved by Users'
      },
      {
        id: 'pricing',
        type: 'pricing-comparison',
        title: 'Choose Your Plan'
      },
      {
        id: 'cta',
        type: 'cta',
        title: 'Ready to Get Started?'
      }
    ]
  },
  {
    id: 'writer',
    name: 'Writer & Blogger',
    category: 'creative',
    description: 'Elegant portfolio for writers and bloggers',
    thumbnail: '/templates/writer.jpg',
    preview: 'https://writer-demo.efolio.com',
    isPro: false,
    features: ['Blog Integration', 'Reading Time', 'Categories'],
    colors: {
      primary: '#1f2937',
      secondary: '#6b7280',
      accent: '#f59e0b'
    },
    sections: [
      {
        id: 'hero',
        type: 'hero-writer',
        title: 'Content Creator',
        subtitle: 'Words that inspire and inform'
      },
      {
        id: 'blog',
        type: 'blog-featured',
        title: 'Latest Articles'
      },
      {
        id: 'about',
        type: 'about',
        title: 'About Me'
      },
      {
        id: 'portfolio',
        type: 'writing-samples',
        title: 'Published Work'
      },
      {
        id: 'newsletter',
        type: 'newsletter',
        title: 'Subscribe to My Newsletter'
      },
      {
        id: 'contact',
        type: 'contact',
        title: 'Get In Touch'
      }
    ]
  },
  {
    id: 'agency',
    name: 'Digital Agency',
    category: 'business',
    description: 'Professional portfolio for agencies',
    thumbnail: '/templates/agency.jpg',
    preview: 'https://agency-demo.efolio.com',
    isPro: true,
    features: ['Team Showcase', 'Case Studies', 'Process'],
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#f97316'
    },
    sections: [
      {
        id: 'hero',
        type: 'hero-agency',
        title: 'Digital Agency',
        subtitle: 'We create digital experiences'
      },
      {
        id: 'services',
        type: 'services-detailed',
        title: 'Our Services'
      },
      {
        id: 'portfolio',
        type: 'case-studies',
        title: 'Case Studies'
      },
      {
        id: 'process',
        type: 'process',
        title: 'Our Process'
      },
      {
        id: 'team',
        type: 'team',
        title: 'Meet The Team'
      },
      {
        id: 'clients',
        type: 'clients-logo',
        title: 'Trusted By'
      },
      {
        id: 'contact',
        type: 'contact-agency',
        title: 'Start a Project'
      }
    ]
  }
]

export const getTemplatesByCategory = (category) => {
  if (!category || category === 'all') return templateSamples
  return templateSamples.filter(t => t.category === category)
}

export const getTemplateById = (id) => {
  return templateSamples.find(t => t.id === id)
}

export const getFreeTemplates = () => {
  return templateSamples.filter(t => !t.isPro)
}

export const getProTemplates = () => {
  return templateSamples.filter(t => t.isPro)
}

export const templateCategories = [
  { id: 'all', name: 'All Templates', count: templateSamples.length },
  { id: 'developer', name: 'Developer', count: templateSamples.filter(t => t.category === 'developer').length },
  { id: 'designer', name: 'Designer', count: templateSamples.filter(t => t.category === 'designer').length },
  { id: 'business', name: 'Business', count: templateSamples.filter(t => t.category === 'business').length },
  { id: 'creative', name: 'Creative', count: templateSamples.filter(t => t.category === 'creative').length },
  { id: 'freelance', name: 'Freelance', count: templateSamples.filter(t => t.category === 'freelance').length }
]
