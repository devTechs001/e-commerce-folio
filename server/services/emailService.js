import nodemailer from 'nodemailer'

class EmailService {
  constructor() {
    // Use console logging if no SMTP configured
    if (!process.env.SMTP_HOST) {
      this.transporter = {
        sendMail: (options) => {
          console.log('📧 Email would be sent:')
          console.log('To:', options.to)
          console.log('Subject:', options.subject)
          console.log('Content:', options.text || options.html)
          return Promise.resolve({ messageId: 'mock-' + Date.now() })
        }
      }
    } else {
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      })
    }
  }

  async sendWelcomeEmail(email, userData) {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@efolio.com',
      to: email,
      subject: 'Welcome to E-Folio!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3B82F6;">Welcome ${userData.name}!</h1>
          <p>Thank you for joining E-Folio. We're excited to help you build an amazing portfolio.</p>
          <p>Get started by creating your first portfolio section.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" 
               style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Get Started
            </a>
          </div>
          <p>Best regards,<br>The E-Folio Team</p>
        </div>
      `
    }

    return this.transporter.sendMail(mailOptions)
  }

  async sendPasswordResetEmail(email, data) {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@efolio.com',
      to: email,
      subject: 'Reset Your E-Folio Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3B82F6;">Reset Your Password</h1>
          <p>Hi ${data.name},</p>
          <p>You requested to reset your password for your E-Folio account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="margin: 30px 0;">
            <a href="${data.resetUrl}" 
               style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The E-Folio Team</p>
        </div>
      `
    }

    return this.transporter.sendMail(mailOptions)
  }

  async sendPasswordChangeConfirmation(email, data) {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@efolio.com',
      to: email,
      subject: 'Password Changed Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10B981;">Password Changed</h1>
          <p>Hi ${data.name},</p>
          <p>Your E-Folio password has been successfully changed.</p>
          <p>If you didn't make this change, please contact our support team immediately.</p>
          <p>Best regards,<br>The E-Folio Team</p>
        </div>
      `
    }

    return this.transporter.sendMail(mailOptions)
  }

  async sendJobMatchNotification(email, job) {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@efolio.com',
      to: email,
      subject: 'New Job Matches Your Skills!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3B82F6;">New Job Match!</h1>
          <p>A new job has been posted that matches your skills:</p>
          <div style="border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #1F2937; margin-top: 0;">${job.title}</h2>
            <p>${job.description}</p>
            <p><strong>Budget:</strong> ${job.budgetRange}</p>
            <p><strong>Skills:</strong> ${job.skills.join(', ')}</p>
          </div>
          <div style="margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard/freelancing" 
               style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              View Job
            </a>
          </div>
          <p>Best regards,<br>The E-Folio Team</p>
        </div>
      `
    }

    return this.transporter.sendMail(mailOptions)
  }
}

export const emailService = new EmailService()
export default emailService