# 📦 Complete Dependencies Installation Guide

## 🎯 **REQUIRED NPM PACKAGES**

### **Server Dependencies** (Backend)

Run these commands in the `server` directory:

```bash
cd server

# Payment Processing
pnpm add stripe@14.25.0
pnpm add paypal-rest-sdk@1.8.1

# File Upload & Storage
pnpm add cloudinary@2.5.1
pnpm add multer@1.4.5-lts.1
pnpm add multer-storage-cloudinary@4.0.0

# SMS Notifications
pnpm add twilio@5.3.4
pnpm add africastalking@0.6.4

# AI Integration
pnpm add openai@4.77.3

# Utilities (if not installed)
pnpm add axios@1.7.9
pnpm add nodemailer@7.0.7
```

### **Client Dependencies** (Frontend)

Run these commands in the `client` directory:

```bash
cd client

# Payment UI Components
pnpm add @stripe/stripe-js@4.11.0
pnpm add @stripe/react-stripe-js@5.0.0

# File Upload & Image Handling
pnpm add react-dropzone@14.3.5
pnpm add react-image-crop@11.0.7

# Rich Text Editor
pnpm add @tiptap/react@2.9.1
pnpm add @tiptap/starter-kit@2.9.1
pnpm add @tiptap/extension-color@2.9.1
pnpm add @tiptap/extension-text-style@2.9.1
pnpm add @tiptap/extension-link@2.9.1
pnpm add @tiptap/extension-image@2.9.1

# Color Picker (if not installed)
pnpm add react-color@2.19.3
pnpm add @types/react-color@3.0.13 -D

# Drag and Drop
pnpm add @dnd-kit/core@6.3.1
pnpm add @dnd-kit/sortable@8.0.0
pnpm add @dnd-kit/utilities@3.2.2

# Charts & Visualization
pnpm add d3@7.9.0
pnpm add @types/d3@7.4.3 -D

# Additional UI Components
pnpm add react-toastify@11.0.3
pnpm add react-loading-skeleton@3.5.0
pnpm add react-confetti@6.1.0
```

---

## 📋 **ENVIRONMENT VARIABLES**

### **Server `.env` File**

Create `.env` in the `server` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce-folio

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

# M-Pesa Configuration
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_BUSINESS_SHORTCODE=174379
MPESA_PASSKEY=your_mpesa_passkey
MPESA_CALLBACK_URL=http://localhost:5000/api/unified-payments/mpesa/callback
MPESA_TIMEOUT=30

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRO_PRICE_ID=price_your_pro_price_id
STRIPE_ENTERPRISE_PRICE_ID=price_your_enterprise_price_id

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Twilio SMS
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Africa's Talking SMS
AFRICASTALKING_API_KEY=your_africastalking_api_key
AFRICASTALKING_USERNAME=sandbox

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_api_key
OPENAI_MODEL=gpt-4-turbo-preview

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@efolio.com

# Redis (Optional)
REDIS_URL=redis://localhost:6379
```

### **Client `.env` File**

Create `.env` in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

## 🔧 **INSTALLATION STEPS**

### **1. Install Server Dependencies**

```bash
cd server
pnpm install
```

### **2. Install Client Dependencies**

```bash
cd client
pnpm install
```

### **3. Setup Environment Variables**

- Copy the environment variables above
- Create `.env` files in both `server` and `client` directories
- Replace placeholder values with your actual credentials

### **4. Start Development Servers**

**Terminal 1 - Backend:**
```bash
cd server
pnpm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
pnpm run dev
```

---

## 🎨 **SERVICE CONFIGURATION GUIDES**

### **M-Pesa Setup (Kenya)**

1. Register at [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Create a new app (select Lipa Na M-Pesa Online)
3. Get Consumer Key and Consumer Secret
4. Get Business Shortcode (174379 for sandbox)
5. Get Passkey from the portal
6. Set up callback URL

### **Stripe Setup**

1. Sign up at [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get API keys from Developers > API keys
3. Set up products and pricing
4. Configure webhook endpoints
5. Test with test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

### **PayPal Setup**

1. Create account at [PayPal Developer](https://developer.paypal.com/)
2. Create REST API app
3. Get Client ID and Secret
4. Use sandbox mode for testing
5. Set up webhook notifications

### **Cloudinary Setup**

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get Cloud Name, API Key, and API Secret from dashboard
3. Create upload presets:
   - Go to Settings > Upload
   - Create unsigned preset for client-side uploads
   - Configure transformations and folder settings

### **Twilio SMS Setup**

1. Sign up at [Twilio Console](https://www.twilio.com/)
2. Get Account SID and Auth Token
3. Get a phone number
4. Verify phone numbers for testing

### **Africa's Talking Setup**

1. Sign up at [Africa's Talking](https://africastalking.com/)
2. Get API key from dashboard
3. Use sandbox for testing
4. Upgrade to production when ready

### **OpenAI Setup**

1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Create API key from API keys section
3. Add billing method
4. Choose GPT-4 Turbo for best results
5. Monitor usage in dashboard

---

## ✅ **VERIFICATION CHECKLIST**

### Backend Services:
- [ ] Server starts on port 5000
- [ ] MongoDB connected successfully
- [ ] All routes accessible
- [ ] Socket.io connection working
- [ ] Environment variables loaded

### Frontend:
- [ ] Client runs on port 5173
- [ ] API calls work
- [ ] Socket connection established
- [ ] Stripe elements load
- [ ] File uploads work

### Payment Systems:
- [ ] M-Pesa STK push initiates
- [ ] Stripe payment intent creates
- [ ] PayPal order creates
- [ ] Webhooks receive callbacks
- [ ] Payment records save to database

### File Uploads:
- [ ] Cloudinary uploads succeed
- [ ] Images display correctly
- [ ] File size limits enforced
- [ ] File type validation works

### AI Features:
- [ ] OpenAI API connects
- [ ] Portfolio content generates
- [ ] AI suggestions work
- [ ] Chat assistant responds

### Notifications:
- [ ] SMS sends successfully
- [ ] Email delivers
- [ ] Real-time notifications show
- [ ] Push notifications work

---

## 🚨 **COMMON ISSUES & SOLUTIONS**

### **Issue: M-Pesa timeout errors**
**Solution**: Check callback URL is publicly accessible. Use ngrok for local testing:
```bash
ngrok http 5000
# Use the https URL as callback
```

### **Issue: Stripe webhook signature verification fails**
**Solution**: Use Stripe CLI for local testing:
```bash
stripe listen --forward-to localhost:5000/api/unified-payments/stripe/webhook
```

### **Issue: Cloudinary upload fails**
**Solution**: Check upload preset is unsigned for client-side uploads

### **Issue: OpenAI rate limits**
**Solution**: Implement request queuing and caching:
```javascript
// Add rate limiting
import rateLimit from 'express-rate-limit'

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each user to 10 requests per window
})

router.post('/ai/generate', aiLimiter, generateContent)
```

### **Issue: SMS not sending**
**Solution**: Verify phone numbers in correct format and service is configured

---

## 🔄 **UPDATE EXISTING PACKAGES**

To update all packages to latest versions:

```bash
# Server
cd server
pnpm update

# Client
cd client
pnpm update
```

---

## 📊 **PACKAGE SIZES & PERFORMANCE**

### Server (Production Build):
- Total packages: ~150
- Install size: ~80MB
- Dependencies size: ~50MB

### Client (Production Build):
- Total packages: ~200
- Build size: ~2.5MB (gzipped)
- Dependencies size: ~120MB

---

## 🎯 **OPTIONAL PACKAGES** (For Future Enhancement)

```bash
# Redis for caching
pnpm add redis ioredis

# Rate limiting
pnpm add express-rate-limit

# Security
pnpm add helmet cors express-mongo-sanitize

# Testing
pnpm add -D jest @testing-library/react vitest

# Monitoring
pnpm add @sentry/node @sentry/react

# Analytics
pnpm add mixpanel-browser google-analytics
```

---

## 💡 **TIPS FOR PRODUCTION**

1. **Use environment-specific configs**: Separate dev/staging/prod .env files
2. **Secure your keys**: Never commit .env files to git
3. **Enable CORS properly**: Configure allowed origins
4. **Set up SSL**: Use Let's Encrypt for free SSL certificates
5. **Monitor usage**: Set up billing alerts for all services
6. **Implement caching**: Use Redis for frequently accessed data
7. **Rate limiting**: Protect APIs from abuse
8. **Error tracking**: Use Sentry or similar service
9. **Backup strategy**: Regular database backups
10. **Load testing**: Test with production-like traffic

---

## 🎉 **SUCCESS!**

Once all dependencies are installed and configured:

1. ✅ All payment methods work
2. ✅ File uploads function properly
3. ✅ SMS notifications send
4. ✅ AI features generate content
5. ✅ Real-time updates work
6. ✅ Platform is production-ready

**Next**: Test each feature thoroughly before deploying to production!
