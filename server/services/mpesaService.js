import axios from 'axios'
import mpesaConfig from '../config/mpesa.js'

class MPesaService {
  constructor() {
    this.config = mpesaConfig
    this.accessToken = null
    this.tokenExpiry = null
  }

  /**
   * Get OAuth access token from M-Pesa API
   */
  async getAccessToken() {
    try {
      // Check if we have a valid token
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken
      }

      const auth = Buffer.from(
        `${this.config.consumerKey}:${this.config.consumerSecret}`
      ).toString('base64')

      const response = await axios.get(
        `${this.config.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`
          }
        }
      )

      this.accessToken = response.data.access_token
      // Token expires in 3599 seconds, we'll refresh 1 minute early
      this.tokenExpiry = Date.now() + (3540 * 1000)

      return this.accessToken
    } catch (error) {
      console.error('M-Pesa access token error:', error.response?.data || error.message)
      throw new Error('Failed to get M-Pesa access token')
    }
  }

  /**
   * Generate password for STK Push
   */
  generatePassword(timestamp) {
    const data = `${this.config.businessShortCode}${this.config.passkey}${timestamp}`
    return Buffer.from(data).toString('base64')
  }

  /**
   * Get timestamp in format YYYYMMDD HHmmss
   */
  getTimestamp() {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${year}${month}${day}${hours}${minutes}${seconds}`
  }

  /**
   * Initiate STK Push (Lipa Na M-Pesa Online)
   * @param {string} phoneNumber - Customer phone number (format: 254712345678)
   * @param {number} amount - Amount to be paid
   * @param {string} accountReference - Account reference
   * @param {string} transactionDesc - Transaction description
   */
  async initiateSTKPush(phoneNumber, amount, accountReference = null, transactionDesc = null) {
    try {
      const accessToken = await this.getAccessToken()
      const timestamp = this.getTimestamp()
      const password = this.generatePassword(timestamp)

      // Format phone number (remove + if present, ensure it starts with 254)
      let formattedPhone = phoneNumber.replace(/\+/g, '')
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1)
      }
      if (!formattedPhone.startsWith('254')) {
        throw new Error('Invalid phone number format. Must start with 254 or 0')
      }

      const payload = {
        BusinessShortCode: this.config.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: this.config.transactionType,
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: this.config.businessShortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: this.config.callbackUrl,
        AccountReference: accountReference || this.config.accountReference,
        TransactionDesc: transactionDesc || this.config.transactionDesc
      }

      const response = await axios.post(
        `${this.config.baseUrl}/mpesa/stkpush/v1/processrequest`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        data: response.data,
        checkoutRequestID: response.data.CheckoutRequestID,
        merchantRequestID: response.data.MerchantRequestID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        customerMessage: response.data.CustomerMessage
      }
    } catch (error) {
      console.error('M-Pesa STK Push error:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to initiate M-Pesa payment'
      }
    }
  }

  /**
   * Query STK Push transaction status
   * @param {string} checkoutRequestID - Checkout Request ID from STK Push
   */
  async querySTKPushStatus(checkoutRequestID) {
    try {
      const accessToken = await this.getAccessToken()
      const timestamp = this.getTimestamp()
      const password = this.generatePassword(timestamp)

      const payload = {
        BusinessShortCode: this.config.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID
      }

      const response = await axios.post(
        `${this.config.baseUrl}/mpesa/stkpushquery/v1/query`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        data: response.data,
        resultCode: response.data.ResultCode,
        resultDesc: response.data.ResultDesc
      }
    } catch (error) {
      console.error('M-Pesa query error:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data || error.message
      }
    }
  }

  /**
   * Process M-Pesa callback
   * @param {object} callbackData - Callback data from M-Pesa
   */
  processCallback(callbackData) {
    try {
      const { Body } = callbackData

      if (!Body || !Body.stkCallback) {
        throw new Error('Invalid callback data')
      }

      const { stkCallback } = Body
      const {
        MerchantRequestID,
        CheckoutRequestID,
        ResultCode,
        ResultDesc,
        CallbackMetadata
      } = stkCallback

      // ResultCode 0 means successful payment
      const isSuccessful = ResultCode === 0

      let paymentDetails = {
        merchantRequestID: MerchantRequestID,
        checkoutRequestID: CheckoutRequestID,
        resultCode: ResultCode,
        resultDesc: ResultDesc,
        success: isSuccessful
      }

      // Extract payment metadata if successful
      if (isSuccessful && CallbackMetadata && CallbackMetadata.Item) {
        const metadata = {}
        CallbackMetadata.Item.forEach(item => {
          metadata[item.Name] = item.Value
        })

        paymentDetails = {
          ...paymentDetails,
          amount: metadata.Amount,
          mpesaReceiptNumber: metadata.MpesaReceiptNumber,
          transactionDate: metadata.TransactionDate,
          phoneNumber: metadata.PhoneNumber
        }
      }

      return paymentDetails
    } catch (error) {
      console.error('M-Pesa callback processing error:', error)
      throw error
    }
  }

  /**
   * Verify payment status
   * @param {string} checkoutRequestID - Checkout Request ID
   */
  async verifyPayment(checkoutRequestID) {
    const status = await this.querySTKPushStatus(checkoutRequestID)
    
    if (status.success) {
      return {
        success: true,
        isPaid: status.resultCode === '0',
        resultCode: status.resultCode,
        resultDesc: status.resultDesc
      }
    }

    return {
      success: false,
      isPaid: false,
      error: status.error
    }
  }
}

export const mpesaService = new MPesaService()
export default mpesaService
