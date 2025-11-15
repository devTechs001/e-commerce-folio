# 🚀 E-Commerce Portfolio Platform - Deployment Guide

This guide covers multiple deployment options for the E-Commerce Portfolio Platform, including GitHub Pages, Netlify, Render, and Docker.

## 📋 Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Git repository
- MongoDB database (local or cloud)
- Environment variables configured

## 🌐 Deployment Options

### 1. 📄 GitHub Pages (Frontend Only)

GitHub Pages is perfect for deploying the frontend as a static site.

#### Setup Steps:

1. **Enable GitHub Pages**
   ```bash
   # In your GitHub repository settings:
   # Settings > Pages > Source: GitHub Actions
   ```

2. **Configure Environment Variables**
   ```bash
   # In GitHub repository settings:
   # Settings > Secrets and variables > Actions
   
   # Add these secrets:
   VITE_API_URL=https://your-api-domain.com
   VITE_APP_URL=https://username.github.io/ecommerce-folio
   ```

3. **Deploy**
   ```bash
   # Push to main branch - GitHub Actions will automatically deploy
   git push origin main
   ```

#### GitHub Actions Workflow:
- **File**: `.github/workflows/deploy-github-pages.yml`
- **Triggers**: Push to main/master branch
- **Build**: Installs dependencies, builds client, deploys to GitHub Pages
- **URL**: `https://username.github.io/ecommerce-folio`

---

### 2. 🌊 Netlify (Frontend + Serverless Functions)

Netlify provides excellent frontend hosting with optional serverless functions.

#### Setup Steps:

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```toml
   # netlify.toml (already configured)
   [build]
     base = "client"
     publish = "client/dist"
     command = "pnpm install && pnpm run build"
   ```

3. **Environment Variables**
   ```bash
   # In Netlify dashboard: Site settings > Environment variables
   VITE_API_URL=https://your-api-domain.com
   VITE_APP_URL=https://your-site.netlify.app
   NODE_VERSION=18
   PNPM_VERSION=8
   ```

4. **Deploy**
   ```bash
   # Option 1: Automatic deployment on git push
   git push origin main
   
   # Option 2: Manual deployment
   cd client
   pnpm run build:netlify
   pnpm run deploy:netlify
   ```

#### Netlify Features:
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Branch previews
- ✅ Form handling
- ✅ Edge functions
- ✅ Analytics

---

### 3. 🎯 Render (Full-Stack Deployment)

Render is perfect for deploying both frontend and backend with databases.

#### Setup Steps:

1. **Connect Repository**
   - Go to [Render](https://render.com)
   - Click "New +" > "Blueprint"
   - Connect your GitHub repository

2. **Configure render.yaml**
   ```yaml
   # render.yaml (already configured)
   # Includes frontend, backend, and database services
   ```

3. **Environment Variables**
   ```bash
   # Set in Render dashboard for each service:
   
   # Backend Service:
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
   JWT_SECRET=your-super-secret-key
   STRIPE_SECRET_KEY=sk_live_your_stripe_key
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   
   # Frontend Service:
   VITE_API_URL=https://your-api.onrender.com
   VITE_APP_URL=https://your-app.onrender.com
   ```

4. **Deploy**
   ```bash
   # Automatic deployment on git push
   git push origin main
   ```

#### Render Services:
- **Frontend**: Static site hosting
- **Backend**: Node.js web service
- **Database**: PostgreSQL/MongoDB
- **Redis**: Caching service

---

### 4. 🐳 Docker Deployment

Docker provides containerized deployment for any cloud provider.

#### Setup Steps:

1. **Build Images**
   ```bash
   # Build production image
   docker build -t ecommerce-folio .
   
   # Or use docker-compose
   docker-compose up --build
   ```

2. **Environment Configuration**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit environment variables
   nano .env
   ```

3. **Run Containers**
   ```bash
   # Development
   docker-compose up
   
   # Production
   docker-compose -f docker-compose.prod.yml up -d
   ```

#### Docker Services:
- **MongoDB**: Database container
- **Redis**: Caching container
- **API**: Backend Node.js container
- **Nginx**: Reverse proxy container

---

## 🔧 Environment Variables

### Client (.env)
```bash
VITE_API_URL=http://localhost:5000
VITE_APP_URL=http://localhost:5173
VITE_NODE_ENV=development
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
VITE_SOCKET_URL=http://localhost:5000
```

### Server (.env)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce_folio
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
CLIENT_URL=http://localhost:5173

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 🚀 Quick Deployment Commands

### GitHub Pages
```bash
# Automatic on push to main
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
cd client
pnpm run build
netlify deploy --prod --dir=dist
```

### Render
```bash
# Automatic on push to main
git add .
git commit -m "Deploy to Render"
git push origin main
```

### Docker
```bash
# Local deployment
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔍 Health Checks & Monitoring

### Health Endpoints
- **API Health**: `/api/health`
- **Readiness**: `/api/ready`
- **Liveness**: `/api/live`

### Monitoring Setup
```bash
# Check API health
curl https://your-api-domain.com/api/health

# Check frontend
curl https://your-frontend-domain.com

# Docker health check
docker ps --format "table {{.Names}}\t{{.Status}}"
```

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. **Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
pnpm install

# Check Node.js version
node --version  # Should be 18+
```

#### 2. **Environment Variables**
```bash
# Verify environment variables are loaded
echo $VITE_API_URL
echo $NODE_ENV

# Check .env file exists
ls -la .env*
```

#### 3. **CORS Issues**
```javascript
// Update CORS_ORIGIN in server .env
CORS_ORIGIN=https://your-frontend-domain.com,https://another-domain.com
```

#### 4. **Database Connection**
```bash
# Test MongoDB connection
mongosh "mongodb://localhost:27017/ecommerce_folio"

# Check connection string
echo $MONGODB_URI
```

### Debug Commands
```bash
# Check server logs
docker-compose logs api

# Check client build
cd client && pnpm run build

# Test API endpoints
curl -X GET https://your-api-domain.com/api/health

# Verify environment
printenv | grep VITE_
```

---

## 📊 Performance Optimization

### Frontend Optimization
- ✅ Code splitting implemented
- ✅ Lazy loading for routes
- ✅ Image optimization
- ✅ Bundle analysis
- ✅ Caching strategies

### Backend Optimization
- ✅ Database indexing
- ✅ Redis caching
- ✅ Rate limiting
- ✅ Compression
- ✅ Security headers

### CDN & Caching
```bash
# Netlify: Automatic CDN
# Render: Built-in CDN
# GitHub Pages: GitHub CDN
# Custom: Cloudflare CDN
```

---

## 🔒 Security Checklist

- ✅ Environment variables secured
- ✅ HTTPS enabled
- ✅ CORS configured
- ✅ Rate limiting active
- ✅ Input validation
- ✅ SQL injection protection
- ✅ XSS protection
- ✅ Security headers

---

## 📈 Scaling Considerations

### Horizontal Scaling
- Load balancers
- Multiple API instances
- Database clustering
- Redis clustering

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching layers
- Use CDN for static assets

---

## 🎯 Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates ready
- [ ] Domain DNS configured
- [ ] Monitoring setup

### Post-Deployment
- [ ] Health checks passing
- [ ] API endpoints working
- [ ] Frontend loading correctly
- [ ] Database connected
- [ ] Email service working
- [ ] Payment system functional

### Production Readiness
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Monitoring (Uptime checks)
- [ ] Backup strategy
- [ ] Disaster recovery plan

---

## 🆘 Support & Resources

### Documentation
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Netlify Docs](https://docs.netlify.com/)
- [Render Docs](https://render.com/docs)
- [Docker Docs](https://docs.docker.com/)

### Community
- GitHub Issues
- Discord Community
- Stack Overflow
- Reddit r/webdev

---

## 🎉 Success!

Your E-Commerce Portfolio Platform is now deployed and ready for users! 

**Live URLs:**
- **GitHub Pages**: `https://username.github.io/ecommerce-folio`
- **Netlify**: `https://your-site.netlify.app`
- **Render**: `https://your-app.onrender.com`
- **Custom Domain**: `https://your-domain.com`

Remember to monitor your deployment and keep dependencies updated for security and performance!
