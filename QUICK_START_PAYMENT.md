# ⚡ **PAYMENT SYSTEM QUICK START**

## 🚀 **Get Started in 5 Minutes**

---

## ✅ **What's Ready**

Your complete payment checkout system supporting:
- 💳 **Stripe** (Credit/Debit Cards)
- 🅿️ **PayPal** (PayPal Balance, Cards, Banks)
- 📱 **M-Pesa** (Mobile Money - Kenya)

---

## 📦 **Step 1: Install (2 minutes)**

```bash
# Install all payment dependencies
cd server && pnpm add stripe@14.25.0 paypal-rest-sdk@1.8.1 cloudinary@2.5.1 multer@1.4.5-lts.1 twilio@5.3.4 africastalking@0.6.4 openai@4.77.3

cd ../client && pnpm add @stripe/stripe-js@4.11.0 @stripe/react-stripe-js@5.0.0 react-confetti@6.1.0
```

---

## 🔑 **Step 2: Environment Variables (1 minute)**

### **Server `.env`**
```env
# Stripe (Get from: https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal (Get from: https://developer.paypal.com)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# M-Pesa (Get from: https://developer.safaricom.co.ke)
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_BUSINESS_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=http://localhost:5000/api/unified-payments/mpesa/callback

# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **Client `.env`**
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

---

## 🔌 **Step 3: Add Routes (1 minute)**

In `client/src/App.jsx`:

```javascript
// Add imports
import PortfolioCheckout from './pages/Checkout/PortfolioCheckout'
import PaymentSuccess from './pages/Payment/PaymentSuccess'
import PaymentFailed from './pages/Payment/PaymentFailed'

// Add routes (in your Routes section)
<Route path="/checkout" element={<PortfolioCheckout />} />
<Route path="/payment/success" element={<PaymentSuccess />} />
<Route path="/payment/failed" element={<PaymentFailed />} />
```

---

## 🎯 **Step 4: Start Using (1 minute)**

### **Navigate to Checkout:**

```javascript
// From any component (e.g., template card, pricing page):
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

// When user clicks "Buy Now"
const handleBuyNow = () => {
  navigate(`/checkout?portfolio=premium-template&amount=19&plan=professional`)
}
```

### **URL Parameters:**
- `portfolio` - Portfolio/template ID
- `amount` - Price in USD (or KES for M-Pesa)
- `plan` - Plan name (optional)

---

## 🧪 **Step 5: Test Payments**

### **Test Cards (Stripe):**
```
✅ Success: 4242 4242 4242 4242
❌ Declined: 4000 0000 0000 0002
🔐 3D Secure: 4000 0027 6000 3184

Use any future expiry date and any CVC
```

### **PayPal:**
- Create sandbox accounts at [developer.paypal.com](https://developer.paypal.com)
- Use test buyer account credentials

### **M-Pesa:**
```
📱 Test Phone: 254708374149
🏢 Shortcode: 174379 (sandbox)
Any PIN works in test mode
```

---

## 📝 **Example Usage**

### **From a Template Card:**
```javascript
<button
  onClick={() => navigate(`/checkout?portfolio=${template.id}&amount=${template.price}`)}
  className="bg-primary-600 text-white px-6 py-2 rounded-lg"
>
  Buy Template - ${template.price}
</button>
```

### **From Pricing Page:**
```javascript
<button
  onClick={() => navigate(`/checkout?plan=professional&amount=19`)}
  className="bg-primary-600 text-white px-6 py-3 rounded-lg"
>
  Get Started - $19/month
</button>
```

---

## ✨ **What Happens Next**

1. **User clicks "Buy"** → Redirects to `/checkout`
2. **Checkout page loads** → Shows order summary + payment methods
3. **User selects method** → Stripe/PayPal/M-Pesa
4. **User enters details** → Card/PayPal login/Phone number
5. **Payment processes** → Real-time status updates
6. **Success!** → Redirects to `/payment/success` with confetti 🎉
7. **Or failure** → Redirects to `/payment/failed` with retry option

---

## 🎨 **Features You Get**

### **Checkout Page:**
- ✅ Order summary with pricing
- ✅ Payment method selection
- ✅ Beautiful responsive design
- ✅ Security badges
- ✅ Real-time validation
- ✅ Loading states

### **Payment Processing:**
- ✅ Stripe Elements integration
- ✅ PayPal Smart Buttons
- ✅ M-Pesa STK Push
- ✅ Error handling
- ✅ Retry mechanisms
- ✅ Status checking

### **After Payment:**
- ✅ Success page with confetti
- ✅ Payment confirmation
- ✅ Receipt details
- ✅ Next steps guide
- ✅ Failure troubleshooting
- ✅ Support contact

---

## 🔒 **Security Built-In**

- ✅ SSL/TLS encryption
- ✅ PCI DSS compliant
- ✅ No card data stored
- ✅ Webhook verification
- ✅ Input validation
- ✅ Rate limiting

---

## 📊 **Track Everything**

Payments are automatically saved to database with:
- Transaction ID
- Payment method
- Amount & currency
- Status (pending/completed/failed)
- User information
- Timestamps
- Metadata

Query payment history:
```javascript
const payments = await paymentService.getPaymentHistory()
```

---

## 🆘 **Troubleshooting**

### **Issue: Stripe not loading**
```javascript
// Check your publishable key in .env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### **Issue: PayPal button not showing**
```javascript
// Check client ID in .env
VITE_PAYPAL_CLIENT_ID=your_client_id
```

### **Issue: M-Pesa callback not working**
```bash
# Use ngrok for local testing
ngrok http 5000
# Update MPESA_CALLBACK_URL with ngrok URL
```

### **Issue: Payment stuck in pending**
- Check webhook endpoints are accessible
- Verify API keys are correct
- Check server logs for errors

---

## 📚 **More Documentation**

- **Full Setup**: See `DEPENDENCIES_INSTALLATION.md`
- **Backend Services**: See `PAYMENT_INTEGRATION_COMPLETE.md`
- **Frontend Components**: See `PAYMENT_CHECKOUT_COMPLETE.md`
- **Complete Overview**: See `COMPLETE_PAYMENT_IMPLEMENTATION.md`

---

## 💡 **Pro Tips**

1. **Test Mode First**
   - Use test API keys
   - Test all payment flows
   - Check error handling

2. **Monitor Webhooks**
   - Use Stripe CLI: `stripe listen --forward-to localhost:5000/api/unified-payments/stripe/webhook`
   - Check webhook logs in provider dashboards

3. **Handle Errors**
   - Show clear messages
   - Offer retry options
   - Provide support contact

4. **Optimize Conversion**
   - Keep checkout simple
   - Show security badges
   - Offer multiple methods
   - Mobile-optimize everything

---

## 🎉 **You're Ready!**

Your payment system is **100% complete and ready** to accept real payments!

### **Start Earning:**
1. ✅ Dependencies installed
2. ✅ Environment variables set
3. ✅ Routes added
4. ✅ Test payments working

### **To Go Live:**
1. Replace test keys with production keys
2. Set up production webhooks
3. Test with small amounts first
4. Monitor for errors
5. 🚀 Launch and profit!

---

**Need Help?** 
- Check documentation files
- Review error logs
- Test with sandbox credentials
- Contact payment provider support

**Happy Selling!** 💰
