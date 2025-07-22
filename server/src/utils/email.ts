import nodemailer from 'nodemailer';
import { emailConfig } from '../config';
import { logger } from '../middleware/logger';

// Email template interface
interface EmailTemplate {
  subject: string;
  html: string;
}

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: emailConfig.smtp.host,
  port: emailConfig.smtp.port,
  secure: emailConfig.smtp.secure,
  auth: {
    user: emailConfig.smtp.auth.user,
    pass: emailConfig.smtp.auth.pass
  }
});

// Send email function
export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  try {
    const mailOptions = {
      from: emailConfig.from,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}`);
  } catch (error) {
    logger.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

// Email templates
export const emailTemplates = {
  // Welcome email template
  welcome: (name: string, verificationLink: string): EmailTemplate => ({
    subject: 'Welcome to PressKit Pro!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to PressKit Pro!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for joining PressKit Pro! We're excited to have you on board.</p>
        <p>To get started, please verify your email address by clicking the button below:</p>
        <p style="text-align: center;">
          <a href="${verificationLink}" style="
            background-color: #4CAF50;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
            margin: 16px 0;
          ">Verify Email</a>
        </p>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p>${verificationLink}</p>
        <p>Best regards,<br>The PressKit Pro Team</p>
      </div>
    `
  }),

  // Password reset template
  passwordReset: (resetLink: string): EmailTemplate => ({
    subject: 'Reset Your PressKit Pro Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>You've requested to reset your password.</p>
        <p>Click the button below to create a new password:</p>
        <p style="text-align: center;">
          <a href="${resetLink}" style="
            background-color: #4CAF50;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
            margin: 16px 0;
          ">Reset Password</a>
        </p>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p>${resetLink}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The PressKit Pro Team</p>
      </div>
    `
  }),

  // Contact form notification template
  contactNotification: (name: string, email: string, message: string): EmailTemplate => ({
    subject: 'New Contact Form Submission',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="background-color: #f5f5f5; padding: 16px; border-radius: 4px;">${message}</p>
      </div>
    `
  }),

  // Subscription confirmation template
  subscriptionConfirmation: (plan: string, startDate: string): EmailTemplate => ({
    subject: 'Subscription Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Subscription Confirmation</h2>
        <p>Thank you for subscribing to PressKit Pro!</p>
        <p>Your subscription details:</p>
        <ul>
          <li><strong>Plan:</strong> ${plan}</li>
          <li><strong>Start Date:</strong> ${startDate}</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>The PressKit Pro Team</p>
      </div>
    `
  })
};

// Verify email configuration
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    logger.info('Email configuration verified successfully');
    return true;
  } catch (error) {
    logger.error('Email configuration verification failed:', error);
    return false;
  }
};