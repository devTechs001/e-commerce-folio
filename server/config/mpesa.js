const mpesaConfig = {
  // Development (Sandbox)
  development: {
    consumerKey: process.env.MPESA_CONSUMER_KEY || '',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
    businessShortCode: process.env.MPESA_BUSINESS_SHORTCODE || '174379',
    passkey: process.env.MPESA_PASSKEY || '',
    callbackUrl: process.env.MPESA_CALLBACK_URL || 'http://localhost:5000/api/payments/mpesa/callback',
    baseUrl: 'https://sandbox.safaricom.co.ke',
    timeout: process.env.MPESA_TIMEOUT || '30',
    transactionType: 'CustomerPayBillOnline',
    accountReference: 'E-Folio Payment',
    transactionDesc: 'Payment for E-Folio subscription'
  },
  
  // Production
  production: {
    consumerKey: process.env.MPESA_CONSUMER_KEY || '',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
    businessShortCode: process.env.MPESA_BUSINESS_SHORTCODE || '',
    passkey: process.env.MPESA_PASSKEY || '',
    callbackUrl: process.env.MPESA_CALLBACK_URL || 'https://your-domain.com/api/payments/mpesa/callback',
    baseUrl: 'https://api.safaricom.co.ke',
    timeout: process.env.MPESA_TIMEOUT || '30',
    transactionType: 'CustomerPayBillOnline',
    accountReference: 'E-Folio Payment',
    transactionDesc: 'Payment for E-Folio subscription'
  }
}

export default mpesaConfig[process.env.NODE_ENV || 'development']