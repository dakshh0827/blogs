import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import { render } from '@react-email/render'
import VerificationEmail from '@/mails/VerificationMail'

// OAuth2 configuration
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
)

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
})

export async function sendVerificationMail(
  email: string,
  username: string | null,
  verifyCode: string
): Promise<any> {
  try {
    console.log('=== EMAIL SENDING DEBUG ===')
    console.log('Recipient email:', email)
    console.log('Username:', username)
    console.log('Verification code:', verifyCode)

    // Get access token
    const accessToken = await oAuth2Client.getAccessToken()
    
    if (!accessToken.token) {
      throw new Error('Failed to get access token')
    }

    console.log('Access token obtained successfully')

    // Create transporter with OAuth2
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    })

    console.log('OAuth2 transporter configured')

    // Render email using @react-email/render
    const htmlContent = await render(
      VerificationEmail({ username, otp: verifyCode })
    )

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification Code',
      html: htmlContent,
      text: `Hello ${username || 'User'},\n\nYour verification code is: ${verifyCode}\n\nThis code will expire in 15 minutes.\n\nThank you!`,
    }

    console.log('Email payload:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    })

    // Send email
    const response = await transporter.sendMail(mailOptions)

    console.log('Nodemailer response:', response)
    console.log('Email sent successfully to:', email)

    return {
      success: true,
      message: 'Verification email sent successfully.',
      messageId: response.messageId,
    }
  } catch (error) {
    console.error('=== EMAIL ERROR ===')
    console.error('Error details:', error)

    return {
      success: false,
      message: 'Failed to send verification email. Please try again later.',
      error: error,
    }
  }
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
