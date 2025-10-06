import nodemailer from 'nodemailer'

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Generic email sending function
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: `"E-Folio" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

export const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: 'Welcome to E-Folio!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0ea5e9;">Welcome to E-Folio!</h1>
        <p>Hi ${user.profile.firstName},</p>
        <p>Thank you for joining E-Folio! We're excited to help you create an amazing portfolio.</p>
        <p>Get started by:</p>
        <ul>
          <li>Choosing a template from our gallery</li>
          <li>Customizing your portfolio with our drag-and-drop builder</li>
          <li>Publishing your portfolio to share with the world</li>
        </ul>
        <p>If you have any questions, feel free to reply to this email.</p>
        <p>Best regards,<br>The E-Folio Team</p>
      </div>
    `,
  })
}

export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`

  return sendEmail({
    to: user.email,
    subject: 'Reset Your E-Folio Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0ea5e9;">Reset Your Password</h1>
        <p>Hi ${user.profile.firstName},</p>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The E-Folio Team</p>
      </div>
    `,
  })
}