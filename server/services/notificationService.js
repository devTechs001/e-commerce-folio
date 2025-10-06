import User from '../models/User.js'
import { sendEmail } from './emailService.js'

export const sendCollaborationInvite = async (inviter, invitee, portfolio) => {
  try {
    await sendEmail({
      to: invitee.email,
      subject: `You've been invited to collaborate on a portfolio`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0ea5e9;">Collaboration Invitation</h1>
          <p>Hi ${invitee.profile.firstName},</p>
          <p>
            <strong>${inviter.profile.firstName} ${inviter.profile.lastName}</strong> 
            has invited you to collaborate on their portfolio: 
            <strong>"${portfolio.title}"</strong>
          </p>
          <p>You can now view and edit this portfolio in your E-Folio dashboard.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/dashboard" 
               style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Portfolio
            </a>
          </div>
          <p>Best regards,<br>The E-Folio Team</p>
        </div>
      `
    })
  } catch (error) {
    console.error('Error sending collaboration invite:', error)
  }
}

export const sendPortfolioPublishedNotification = async (user, portfolio) => {
  try {
    await sendEmail({
      to: user.email,
      subject: 'Your portfolio is now live!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0ea5e9;">Portfolio Published Successfully!</h1>
          <p>Hi ${user.profile.firstName},</p>
          <p>Great news! Your portfolio <strong>"${portfolio.title}"</strong> is now live and accessible to the public.</p>
          <p>Share your portfolio with this link:</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <code style="color: #0ea5e9; font-size: 16px;">
              ${process.env.CLIENT_URL}/portfolio/${portfolio.slug}
            </code>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/portfolio/${portfolio.slug}" 
               style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Live Portfolio
            </a>
          </div>
          <p>Best regards,<br>The E-Folio Team</p>
        </div>
      `
    })
  } catch (error) {
    console.error('Error sending portfolio published notification:', error)
  }
}

export const sendWeeklyAnalytics = async (user, portfolio, analytics) => {
  try {
    await sendEmail({
      to: user.email,
      subject: `Weekly Analytics for "${portfolio.title}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0ea5e9;">Weekly Portfolio Analytics</h1>
          <p>Hi ${user.profile.firstName},</p>
          <p>Here's how your portfolio <strong>"${portfolio.title}"</strong> performed this week:</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e293b;">Performance Summary</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #0ea5e9;">${analytics.views}</div>
                <div style="color: #64748b; font-size: 14px;">Total Views</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #0ea5e9;">${analytics.uniqueVisitors}</div>
                <div style="color: #64748b; font-size: 14px;">Unique Visitors</div>
              </div>
            </div>
          </div>

          <p>Keep up the great work! Continue sharing your portfolio to reach more people.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/dashboard/analytics" 
               style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Detailed Analytics
            </a>
          </div>
          
          <p>Best regards,<br>The E-Folio Team</p>
        </div>
      `
    })
  } catch (error) {
    console.error('Error sending weekly analytics:', error)
  }
}