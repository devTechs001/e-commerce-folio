import Stripe from 'stripe'

// Initialize Stripe only if API key is provided
let stripe = null

if (process.env.STRIPE_SECRET_KEY) {
  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })
    console.log('✅ Stripe payment service initialized')
  } catch (error) {
    console.error('❌ Failed to initialize Stripe:', error.message)
  }
} else {
  console.warn('⚠️  STRIPE_SECRET_KEY not configured. Payment features will use mock mode.')
  console.warn('   Add STRIPE_SECRET_KEY to your .env file to enable real payments.')
}

export default stripe
