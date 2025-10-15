import twilio from 'twilio'
import africastalking from 'africastalking'

class SMSService {
  constructor() {
    // Twilio configuration
    this.twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
      ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
      : null
    this.twilioPhone = process.env.TWILIO_PHONE_NUMBER

    // Africa's Talking configuration
    this.africasTalking = process.env.AFRICASTALKING_API_KEY
      ? africastalking({
          apiKey: process.env.AFRICASTALKING_API_KEY,
          username: process.env.AFRICASTALKING_USERNAME || 'sandbox'
        })
      : null
  }

  /**
   * Send SMS via Twilio
   * @param {string} to - Recipient phone number
   * @param {string} message - SMS message
   */
  async sendViaTwilio(to, message) {
    try {
      if (!this.twilioClient) {
        throw new Error('Twilio is not configured')
      }

      const result = await this.twilioClient.messages.create({
        body: message,
        from: this.twilioPhone,
        to
      })

      return {
        success: true,
        provider: 'twilio',
        messageId: result.sid,
        status: result.status
      }
    } catch (error) {
      console.error('Twilio SMS error:', error)
      return {
        success: false,
        provider: 'twilio',
        error: error.message
      }
    }
  }

  /**
   * Send SMS via Africa's Talking
   * @param {string|array} to - Recipient phone number(s)
   * @param {string} message - SMS message
   * @param {string} from - Sender ID (optional)
   */
  async sendViaAfricasTalking(to, message, from = null) {
    try {
      if (!this.africasTalking) {
        throw new Error('Africa\'s Talking is not configured')
      }

      const sms = this.africasTalking.SMS
      const recipients = Array.isArray(to) ? to : [to]

      const options = {
        to: recipients,
        message
      }

      if (from) {
        options.from = from
      }

      const result = await sms.send(options)

      return {
        success: true,
        provider: 'africastalking',
        recipients: result.SMSMessageData.Recipients,
        message: result.SMSMessageData.Message
      }
    } catch (error) {
      console.error('Africa\'s Talking SMS error:', error)
      return {
        success: false,
        provider: 'africastalking',
        error: error.message
      }
    }
  }

  /**
   * Send SMS (automatically chooses provider based on phone number)
   * @param {string} to - Recipient phone number
   * @param {string} message - SMS message
   * @param {object} options - Additional options
   */
  async sendSMS(to, message, options = {}) {
    try {
      // Format phone number
      let phone = to.replace(/\s+/g, '')
      if (phone.startsWith('0')) {
        phone = '254' + phone.substring(1) // Assume Kenya
      }
      if (!phone.startsWith('+')) {
        phone = '+' + phone
      }

      // Determine provider based on phone number or preference
      const isAfricanNumber = phone.startsWith('+254') || phone.startsWith('+255') || phone.startsWith('+256')
      
      if (options.provider === 'twilio' || (!isAfricanNumber && this.twilioClient)) {
        return await this.sendViaTwilio(phone, message)
      } else if (options.provider === 'africastalking' || (isAfricanNumber && this.africasTalking)) {
        return await this.sendViaAfricasTalking(phone, message, options.from)
      } else if (this.twilioClient) {
        return await this.sendViaTwilio(phone, message)
      } else if (this.africasTalking) {
        return await this.sendViaAfricasTalking(phone, message, options.from)
      }

      // If no provider is configured, log to console
      console.log('📱 SMS would be sent:')
      console.log('To:', phone)
      console.log('Message:', message)
      
      return {
        success: true,
        provider: 'mock',
        message: 'SMS logged to console (no provider configured)'
      }
    } catch (error) {
      console.error('Send SMS error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Send bulk SMS
   * @param {array} recipients - Array of {phone, message} objects
   * @param {object} options - Additional options
   */
  async sendBulkSMS(recipients, options = {}) {
    try {
      const results = await Promise.all(
        recipients.map(({ phone, message }) => 
          this.sendSMS(phone, message, options)
        )
      )

      const successful = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length

      return {
        success: true,
        total: recipients.length,
        successful,
        failed,
        results
      }
    } catch (error) {
      console.error('Bulk SMS error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Send OTP (One-Time Password)
   * @param {string} phone - Recipient phone number
   * @param {string} otp - OTP code
   */
  async sendOTP(phone, otp) {
    const message = `Your E-Folio verification code is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`
    return await this.sendSMS(phone, message)
  }

  /**
   * Send payment notification
   * @param {string} phone - Recipient phone number
   * @param {object} paymentDetails - Payment details
   */
  async sendPaymentNotification(phone, paymentDetails) {
    const { amount, currency, transactionId, status } = paymentDetails
    const message = `Payment ${status}: ${currency} ${amount}. Transaction ID: ${transactionId}. Thank you for using E-Folio!`
    return await this.sendSMS(phone, message)
  }

  /**
   * Send subscription notification
   * @param {string} phone - Recipient phone number
   * @param {object} subscriptionDetails - Subscription details
   */
  async sendSubscriptionNotification(phone, subscriptionDetails) {
    const { plan, status, expiryDate } = subscriptionDetails
    let message = ''

    if (status === 'active') {
      message = `Your E-Folio ${plan} subscription is now active! Expires: ${expiryDate}. Enjoy premium features!`
    } else if (status === 'expiring_soon') {
      message = `Your E-Folio ${plan} subscription expires on ${expiryDate}. Renew now to keep premium features!`
    } else if (status === 'expired') {
      message = `Your E-Folio ${plan} subscription has expired. Renew now to regain access to premium features.`
    } else if (status === 'cancelled') {
      message = `Your E-Folio subscription has been cancelled. You'll have access until ${expiryDate}.`
    }

    return await this.sendSMS(phone, message)
  }

  /**
   * Send welcome message
   * @param {string} phone - Recipient phone number
   * @param {string} name - User name
   */
  async sendWelcomeMessage(phone, name) {
    const message = `Welcome to E-Folio, ${name}! Start building your professional portfolio today. Visit your dashboard to get started.`
    return await this.sendSMS(phone, message)
  }

  /**
   * Send job application notification
   * @param {string} phone - Recipient phone number
   * @param {object} jobDetails - Job details
   */
  async sendJobNotification(phone, jobDetails) {
    const { title, client, action } = jobDetails
    let message = ''

    if (action === 'new_application') {
      message = `New application for "${title}" from ${client}. Check your E-Folio dashboard for details.`
    } else if (action === 'accepted') {
      message = `Congratulations! Your application for "${title}" has been accepted. Contact: ${client}.`
    } else if (action === 'rejected') {
      message = `Your application for "${title}" was not successful. Keep applying - you'll find the right match!`
    }

    return await this.sendSMS(phone, message)
  }

  /**
   * Send reminder notification
   * @param {string} phone - Recipient phone number
   * @param {string} reminder - Reminder message
   */
  async sendReminder(phone, reminder) {
    const message = `Reminder from E-Folio: ${reminder}`
    return await this.sendSMS(phone, message)
  }

  /**
   * Send security alert
   * @param {string} phone - Recipient phone number
   * @param {string} alertType - Type of security alert
   * @param {object} details - Alert details
   */
  async sendSecurityAlert(phone, alertType, details = {}) {
    let message = ''

    switch (alertType) {
      case 'login':
        message = `New login to your E-Folio account from ${details.location || 'unknown location'}. If this wasn't you, secure your account immediately.`
        break
      case 'password_change':
        message = `Your E-Folio password was changed. If you didn't make this change, contact support immediately.`
        break
      case 'payment_method_added':
        message = `A new payment method was added to your E-Folio account. If you didn't add this, contact support.`
        break
      default:
        message = `Security alert for your E-Folio account. Please review your recent activity.`
    }

    return await this.sendSMS(phone, message)
  }

  /**
   * Verify phone number with OTP
   * @param {string} phone - Phone number to verify
   */
  async initiatePhoneVerification(phone) {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Send OTP
    const result = await this.sendOTP(phone, otp)

    if (result.success) {
      // Store OTP in cache/database with expiry (implement based on your caching strategy)
      return {
        success: true,
        otp, // In production, don't return OTP, store it server-side
        expiresIn: 600 // 10 minutes
      }
    }

    return result
  }
}

export const smsService = new SMSService()
export default smsService
