// Database initialization script
db = db.getSiblingDB('efolio')

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.portfolios.createIndex({ "slug": 1 }, { unique: true })
db.portfolios.createIndex({ "userId": 1 })
db.templates.createIndex({ "category": 1 })
db.analytics.createIndex({ "portfolioId": 1, "date": 1 })

// Insert default templates
db.templates.insertMany([
  {
    name: "Modern Professional",
    description: "Clean and professional template perfect for corporate portfolios",
    category: "professional",
    price: 0,
    isPremium: false,
    previewImage: "/images/templates/modern-professional.jpg",
    features: [
      { name: "Responsive Design", included: true },
      { name: "Contact Form", included: true },
      { name: "Social Links", included: true }
    ],
    styles: {
      colors: ["#0ea5e9", "#64748b", "#1e293b"],
      fonts: ["Inter", "Roboto", "Arial"],
      layouts: ["Single Column", "Grid"]
    },
    ratings: { average: 4.5, count: 120 },
    downloads: 850,
    creator: null,
    isActive: true,
    tags: ["professional", "modern", "clean"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Creative Showcase",
    description: "Bold and creative template for designers and artists",
    category: "creative",
    price: 19.99,
    isPremium: true,
    previewImage: "/images/templates/creative-showcase.jpg",
    features: [
      { name: "Portfolio Gallery", included: true },
      { name: "Animation Effects", included: true },
      { name: "Custom Colors", included: true }
    ],
    styles: {
      colors: ["#8b5cf6", "#ec4899", "#f59e0b"],
      fonts: ["Poppins", "Montserrat", "Playfair Display"],
      layouts: ["Masonry", "Fullscreen"]
    },
    ratings: { average: 4.8, count: 89 },
    downloads: 420,
    creator: null,
    isActive: true,
    tags: ["creative", "bold", "showcase"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

print("Database initialized successfully!")