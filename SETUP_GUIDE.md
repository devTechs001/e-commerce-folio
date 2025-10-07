# E-Commerce Folio - Complete Setup Guide

## 🎉 What's Been Completed

### ✅ Fixed Issues
1. **React Console Errors** - Fixed `rightIcon` and `onRightIconClick` prop warnings in Input component
2. **Authentication Flow** - Fixed registration and login API response handling
3. **User Model** - Added role field (`user`, `admin`, `owner`) for role-based access control

### ✅ New Features Added

#### 1. **Onboarding Experience** (`client/src/components/onboarding/Onboarding.jsx`)
- Beautiful 4-step onboarding flow for new users
- Goal selection (Freelancing, Job Hunting, Business)
- Animated transitions with Framer Motion
- Progress tracking
- Skip option available

#### 2. **Payment Integration** (`client/src/components/dashboard/billing/Billing.jsx`)
- Full Stripe integration for subscriptions
- Three pricing tiers: Free, Pro ($12/month), Enterprise ($49/month)
- Billing history display
- Payment method management
- Upgrade/downgrade functionality
- Stripe Customer Portal integration

#### 3. **Real-Time Sync** (`client/src/services/socket.js` & `client/src/hooks/useRealTimeSync.js`)
- Socket.io integration for real-time collaboration
- Live user presence tracking
- Content synchronization across users
- Cursor position sharing
- Typing indicators
- Real-time notifications

#### 4. **Template Samples** (`client/src/data/templateSamples.js`)
- 8 professional templates:
  - Minimal Developer
  - Creative Designer (Pro)
  - Business Professional (Pro)
  - Photographer (Pro)
  - Freelancer
  - Startup Landing (Pro)
  - Writer & Blogger
  - Digital Agency (Pro)
- Category filtering
- Free vs Pro template distinction

#### 5. **Role-Based Navigation** (`client/src/components/dashboard/SideNavbar.jsx`)
- Dynamic menu based on user role
- Admin-only section with:
  - Admin Panel
  - All Users
  - All Portfolios
  - Template Manager
- Pro feature badges for free users
- Visual distinction for admin items

#### 6. **Enhanced Styling** (`client/src/index.css`)
- Consistent design system
- Smooth transitions and animations
- Custom scrollbar
- Focus styles for accessibility
- Responsive utilities
- Badge components
- Card hover effects
- Loading states (spinner, skeleton)
- Dark mode support

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+ installed
- MongoDB running locally or connection string
- Stripe account (for payments)
- pnpm v10+ (specified in root package.json)

### Environment Variables

#### Server (`.env` in `server/` directory)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/efolio

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PRO_PRICE_ID=price_your_pro_price_id
STRIPE_ENTERPRISE_PRICE_ID=price_your_enterprise_price_id
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Client URL
CLIENT_URL=http://localhost:5173

# Optional: Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: AWS S3 (for file storage)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your_bucket_name

# Optional: Redis (for caching)
REDIS_URL=redis://localhost:6379
```

#### Client (`.env` in `client/` directory)
```env
VITE_API_URL=http://localhost:5000
```

### Installation Steps

1. **Install Dependencies**
   ```bash
   # Root dependencies (if any)
   pnpm install

   # Server dependencies
   cd server
   pnpm install

   # Client dependencies
   cd ../client
   pnpm install
   ```

2. **Setup Database**
   ```bash
   # Make sure MongoDB is running
   # Windows: Start MongoDB service
   # Mac/Linux: mongod

   # Optional: Run database initialization
   cd database
   node init.js
   ```

3. **Setup Stripe**
   - Create a Stripe account at https://stripe.com
   - Get your test API keys from Dashboard
   - Create products and prices in Stripe Dashboard:
     - Pro Plan: $12/month
     - Enterprise Plan: $49/month
   - Copy the price IDs to your `.env`
   - Setup webhook endpoint: `http://localhost:5000/api/payments/webhook`
   - Copy webhook secret to `.env`

4. **Start Development Servers**

   **Terminal 1 - Server:**
   ```bash
   cd server
   pnpm dev
   ```

   **Terminal 2 - Client:**
   ```bash
   cd client
   pnpm dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Health: http://localhost:5000/api/health

---

## 📁 Project Structure

```
ecommerce-folio/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/               # Login, Register
│   │   │   ├── common/             # Reusable components (Button, Input)
│   │   │   ├── dashboard/          # Dashboard components
│   │   │   │   ├── billing/        # ✨ NEW: Billing page
│   │   │   │   ├── analytics/      # Analytics charts
│   │   │   │   └── ...
│   │   │   ├── layout/             # Layout components
│   │   │   └── onboarding/         # ✨ NEW: Onboarding flow
│   │   ├── context/                # React contexts (Auth, Portfolio, etc.)
│   │   ├── data/                   # ✨ NEW: Template samples data
│   │   ├── hooks/                  # ✨ NEW: useRealTimeSync hook
│   │   ├── pages/                  # Page components (Home, About, etc.)
│   │   ├── routes/                 # Route guards
│   │   ├── services/               # API services, Socket.io
│   │   ├── styles/                 # CSS files
│   │   ├── utils/                  # Utility functions
│   │   ├── App.jsx                 # ✨ UPDATED: Added billing route
│   │   └── index.css               # ✨ ENHANCED: Global styles
│   └── package.json
│
├── server/                          # Express backend
│   ├── config/                     # Configuration files
│   ├── controllers/                # Route controllers
│   │   └── paymentController.js    # ✨ UPDATED: Stripe integration
│   ├── middleware/                 # Custom middleware
│   ├── models/
│   │   └── User.js                 # ✨ UPDATED: Added role field
│   ├── routes/
│   │   ├── auth.js                 # ✨ UPDATED: Include role in responses
│   │   └── payments.js             # Payment routes
│   ├── services/                   # Business logic
│   ├── socket/                     # Socket.io handlers
│   ├── utils/                      # Utility functions
│   └── server.js                   # Main server file
│
├── database/                        # Database scripts
├── docs/                           # Documentation
├── infrastructure/                 # Infrastructure configs
├── scripts/                        # Utility scripts
└── SETUP_GUIDE.md                  # ✨ NEW: This file
```

---

## 🎯 Key Features & Usage

### 1. **User Registration & Onboarding**
- New users see a 4-step onboarding flow
- Can skip or complete the tour
- Goal selection helps personalize experience
- Automatically redirects to template selection

### 2. **Role-Based Access**
- **User**: Standard features, can upgrade to Pro
- **Admin**: Access to admin panel, user management, template management
- **Owner**: Full system access (future implementation)

To test admin features:
```javascript
// In MongoDB
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

### 3. **Payment & Billing**
- Navigate to `/dashboard/billing`
- View current plan and usage
- Upgrade/downgrade plans
- Manage payment methods via Stripe Portal
- View billing history

### 4. **Real-Time Collaboration**
```javascript
// In any component
import { useRealTimeSync } from '@/hooks/useRealTimeSync'

function MyComponent() {
  const { isConnected, onlineUsers, updateContent } = useRealTimeSync(portfolioId)
  
  // Update content in real-time
  const handleChange = (content) => {
    updateContent(sectionId, content)
  }
  
  return (
    <div>
      <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
      <p>Online Users: {onlineUsers.length}</p>
    </div>
  )
}
```

### 5. **Template System**
```javascript
import { templateSamples, getTemplatesByCategory } from '@/data/templateSamples'

// Get all templates
const allTemplates = templateSamples

// Filter by category
const developerTemplates = getTemplatesByCategory('developer')

// Get free templates only
const freeTemplates = getFreeTemplates()
```

---

## 🎨 Styling Guidelines

### Using Utility Classes
```jsx
// Card with hover effect
<div className="card-hover bg-white rounded-xl p-6">
  Content
</div>

// Gradient text
<h1 className="gradient-text text-4xl font-bold">
  Title
</h1>

// Loading spinner
<div className="spinner w-8 h-8" />

// Skeleton loading
<div className="skeleton h-4 w-full" />

// Badges
<span className="badge-primary">Pro</span>
<span className="badge-success">Active</span>
```

### Custom Components
All components follow consistent patterns:
- Proper TypeScript-like prop validation
- Accessibility features (ARIA labels, keyboard navigation)
- Responsive design (mobile-first)
- Dark mode support where applicable

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Payments
- `POST /api/payments/create-checkout-session` - Start Stripe checkout
- `POST /api/payments/create-portal-session` - Open billing portal
- `GET /api/payments/subscription-status` - Get subscription info
- `POST /api/payments/webhook` - Stripe webhook handler

### Portfolios
- `GET /api/portfolios` - Get user portfolios
- `POST /api/portfolios` - Create portfolio
- `PUT /api/portfolios/:id` - Update portfolio
- `DELETE /api/portfolios/:id` - Delete portfolio

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get template by ID
- `POST /api/templates` - Create template (admin only)

---

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Solution: Make sure MongoDB is running
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**2. Stripe Webhook Not Working**
- Use Stripe CLI for local testing:
```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```
- Copy the webhook signing secret to `.env`

**3. Socket.io Connection Issues**
- Check CORS settings in `server/server.js`
- Verify `VITE_API_URL` in client `.env`
- Check browser console for connection errors

**4. Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
pnpm install

# Clear build cache
rm -rf .vite dist
```

---

## 🚢 Deployment

### Environment Setup
1. Set `NODE_ENV=production` in server
2. Update `CLIENT_URL` to production domain
3. Use production Stripe keys
4. Setup MongoDB Atlas or production database
5. Configure Redis for production (optional)

### Recommended Hosting
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: Railway, Render, Heroku, or AWS EC2
- **Database**: MongoDB Atlas
- **Redis**: Redis Cloud or AWS ElastiCache

### Build Commands
```bash
# Client
cd client
pnpm build

# Server (if using TypeScript)
cd server
pnpm build
```

---

## 📝 Next Steps

### Recommended Enhancements
1. **Email Integration** - Add email notifications (SendGrid, AWS SES)
2. **Portfolio Builder** - Drag-and-drop editor for portfolios
3. **Analytics Dashboard** - Detailed visitor analytics
4. **SEO Optimization** - Meta tags, sitemaps, structured data
5. **Testing** - Unit tests, integration tests, E2E tests
6. **CI/CD** - GitHub Actions or GitLab CI
7. **Documentation** - API documentation with Swagger
8. **Monitoring** - Error tracking (Sentry), performance monitoring

### Security Checklist
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using Mongoose)
- [ ] XSS protection (helmet middleware)
- [ ] CSRF protection
- [ ] Secure headers configured
- [ ] Environment variables secured
- [ ] API keys not exposed in client
- [ ] HTTPS in production
- [ ] Regular dependency updates

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review error logs in terminal
3. Check browser console for client errors
4. Review MongoDB logs for database issues
5. Test API endpoints with Postman/Thunder Client

---

## 🎉 Summary

Your E-Commerce Folio application now includes:
- ✅ Fixed authentication and form issues
- ✅ Beautiful onboarding experience
- ✅ Complete payment integration with Stripe
- ✅ Real-time collaboration features
- ✅ Professional template library
- ✅ Role-based access control
- ✅ Enhanced UI/UX with consistent styling
- ✅ Responsive design across all pages
- ✅ Accessibility features
- ✅ Production-ready architecture

**The application is ready for development and testing!**
