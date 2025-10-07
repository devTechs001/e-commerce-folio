# Database Seeding Guide

This directory contains comprehensive sample data for seeding the E-Commerce Portfolio Platform database with realistic test data across all categories.

## 🗂️ Files Overview

### Core Seeding Files
- **`seed.js`** - Main seeding script that populates all database collections
- **`seedData.js`** - Basic seed data (users, portfolios, templates, jobs)
- **`extendedSeedData.js`** - Extended data for advanced features
- **`init.js`** - Database initialization script
- **`schema.sql`** - Database schema definitions

### Sample Data Categories

#### 👥 **Users (4 sample users)**
- **John Doe** - Premium Full Stack Developer
- **Jane Smith** - Enterprise UI/UX Designer  
- **Mike Johnson** - Free Digital Marketing Specialist
- **Sarah Wilson** - Pro Product Manager (Client)

#### 📁 **Portfolios**
- Complete portfolio with hero, about, projects, and contact sections
- Modern styling and professional content
- SEO optimized with custom domain
- Analytics tracking enabled

#### 🎨 **Templates (3 templates)**
- **Modern Developer** - Free template for developers
- **Creative Portfolio** - Premium template for designers ($29)
- **Business Professional** - Premium template for consultants ($39)

#### 💼 **Jobs (3 job listings)**
- React Developer position (Web Development)
- UI/UX Designer role (Design)
- SEO Specialist opportunity (Marketing)

#### 📧 **Email Marketing**
- **Campaigns**: Portfolio announcements, newsletters
- **Subscribers**: Client and prospect email lists
- **Analytics**: Open rates, click rates, engagement metrics

#### 🚀 **Freelance Projects**
- Completed e-commerce development project
- In-progress mobile app design project
- Client testimonials and ratings

#### ⭐ **Client Reviews**
- Verified client testimonials
- 5-star ratings with detailed feedback
- Project-specific reviews

#### 💰 **Revenue Data**
- Freelance project payments
- Template sales revenue
- Consulting income
- Invoice tracking with payment status

#### 📊 **Analytics Data**
- Portfolio view statistics
- Visitor tracking data
- Traffic source analysis
- Performance metrics

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have:
- Node.js installed
- MongoDB running (local or cloud)
- Environment variables configured

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce-folio
NODE_ENV=development
```

### 3. Run Seeding
```bash
# Basic seeding
npm run seed

# Development environment
npm run seed:dev

# Production environment  
npm run seed:prod

# Or run directly
node database/seed.js
```

### 4. Verify Data
The script will output a summary of created records:
```
🎉 Database seeding completed successfully!

📋 Summary:
👥 Users: 4
📁 Portfolios: 1
🎨 Templates: 3
💼 Jobs: 3
📧 Email Campaigns: 2
📮 Email Subscribers: 2
🚀 Freelance Projects: 2
⭐ Client Reviews: 3
💰 Revenue Records: 3
📊 Analytics Records: 7
```

## 🔐 Test User Credentials

| User | Email | Password | Subscription | Role |
|------|-------|----------|--------------|------|
| John Doe | john.doe@example.com | password123 | Premium | Developer |
| Jane Smith | jane.smith@example.com | password123 | Enterprise | Designer |
| Mike Johnson | mike.johnson@example.com | password123 | Free | Marketer |
| Sarah Wilson | sarah.wilson@example.com | password123 | Pro | Client |

## 📊 Data Structure

### User Features by Tier

#### **Free Tier (Mike Johnson)**
- ✅ Basic portfolio sections
- ✅ Standard templates
- ✅ Basic social media links
- ✅ Community support
- ❌ Advanced features locked

#### **Premium Tier (John Doe)**
- ✅ All portfolio sections
- ✅ Advanced templates
- ✅ Custom domain (johndoe.dev)
- ✅ Social media integration
- ✅ Email marketing
- ✅ Advanced analytics
- ✅ Priority support

#### **Enterprise Tier (Jane Smith)**
- ✅ All Premium features
- ✅ Team collaboration
- ✅ White-label options
- ✅ API access
- ✅ Custom integrations

### Sample Portfolio Structure
```javascript
{
  title: "John Doe - Full Stack Developer Portfolio",
  slug: "john-doe-fullstack-developer",
  sections: [
    { type: "hero", data: { name, title, image, cta } },
    { type: "about", data: { content, skills, image } },
    { type: "projects", data: { projects: [...] } },
    { type: "contact", data: { email, phone, location } }
  ],
  styles: { theme: "modern", colors: {...}, fonts: {...} },
  settings: { 
    isPublished: true,
    customDomain: "johndoe.dev",
    seo: { title, description, keywords }
  }
}
```

### Sample Revenue Data
```javascript
{
  amount: 5000,
  source: "freelance_project",
  client: "TechStart Inc.",
  status: "paid",
  invoiceNumber: "INV-2025-001",
  fees: { platform: 150, payment: 145, tax: 500 },
  netAmount: 4205
}
```

## 🛠️ Customization

### Adding More Data
1. **Edit seed files**: Modify `seedData.js` or `extendedSeedData.js`
2. **Add new categories**: Create additional data arrays
3. **Update models**: Ensure model schemas match your data structure

### Custom Seeding
```javascript
// Create custom seed function
import seedDatabase from './database/seed.js'

async function customSeed() {
  // Add your custom data here
  await seedDatabase()
}
```

### Partial Seeding
```javascript
// Seed only specific collections
await User.deleteMany({})
await User.create(userData)
```

## 🔧 Troubleshooting

### Common Issues

#### **MongoDB Connection Error**
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
# Start MongoDB (Windows)
net start mongodb

# Start MongoDB (macOS/Linux)
sudo systemctl start mongod
```

#### **Permission Errors**
```bash
Error: EACCES: permission denied
```
**Solution**: Run with appropriate permissions or check file ownership

#### **Missing Dependencies**
```bash
Error: Cannot find module 'bcryptjs'
```
**Solution**: Install dependencies
```bash
npm install bcryptjs mongoose dotenv
```

#### **Validation Errors**
```bash
ValidationError: Path `email` is required
```
**Solution**: Check data structure matches model schemas

### Clearing Data
```javascript
// Clear all collections
await Promise.all([
  User.deleteMany({}),
  Portfolio.deleteMany({}),
  Template.deleteMany({}),
  // ... other collections
])
```

## 📈 Analytics & Metrics

The seeded data includes realistic analytics:
- **Portfolio Views**: 20-70 daily views
- **Unique Visitors**: 15-50 daily visitors  
- **Traffic Sources**: Direct, organic, social, referral
- **Revenue Tracking**: $1,500 - $5,000 per project
- **Email Metrics**: 24.5% open rate, 8.2% click rate

## 🔄 Re-seeding

To refresh data:
```bash
# Clear and re-seed
npm run seed

# The script automatically clears existing data
# before creating new records
```

## 📝 Notes

- All passwords are hashed using bcrypt
- Email addresses are validated
- Dates are relative to current time
- Images use Unsplash URLs for realistic photos
- All data is production-safe (no sensitive information)

## 🆘 Support

If you encounter issues:
1. Check MongoDB connection
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check console output for specific errors
5. Review model schemas for validation requirements

The seeding process should complete in under 30 seconds with a comprehensive dataset ready for development and testing!
