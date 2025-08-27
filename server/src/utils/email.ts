import nodemailer from 'nodemailer';
import { env } from '../config/env';
import auth from '../routes/auth';

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
}

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: false, // Use STARTTLS instead of direct SSL
  requireTLS: true, // Force STARTTLS
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
  tls: {
    // Do not fail on invalid certs in development
    rejectUnauthorized: env.nodeEnv === 'production',
    // Additional security options
    minVersion: 'TLSv1.2'
  },
  logger: true, // Enable debug logging
  debug: true   // Show debug output
});

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const mailOptions = {
      from: options.from || `"${env.appName}" <${env.smtp.from}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text, // Fallback to text if HTML not provided
    };

    // In development, log the email instead of sending it
    if (env.nodeEnv === 'development') {
      console.log('\n--- EMAIL NOTIFICATION ---');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('Text:', mailOptions.text);
      if (mailOptions.html) {
        console.log('HTML:', mailOptions.html);
      }
      console.log('-------------------------\n');
      return true;
    }

    // In production, send the actual email
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  const verificationUrl = `${env.frontendUrl}/verify-email?token=${token}`;
  const currentYear = new Date().getFullYear();
  
  return sendEmail({
    to: email,
    subject: 'Verify Your DYPSM Account',
    text: `Welcome to DYPSM! Please verify your email address by clicking the following link: ${verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, you can safely ignore this email.`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - DYPSM</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1a56db; padding: 20px; text-align: center; }
        .logo { color: white; font-size: 24px; font-weight: 700; text-decoration: none; }
        .content { padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none; }
        .button {
          display: inline-block; 
          padding: 12px 24px; 
          background-color: #10b981; 
          color: white; 
          text-decoration: none; 
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer { 
          text-align: center; 
          padding: 20px; 
          font-size: 14px; 
          color: #6b7280;
          background-color: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }
        .code-box {
          background-color: #f3f4f6;
          padding: 15px;
          border-radius: 6px;
          word-break: break-all;
          margin: 15px 0;
          font-family: monospace;
          font-size: 14px;
        }
      </style>
    </head>
    <body style="background-color: #f3f4f6; padding: 20px 0;">
      <div class="container">
        <!-- Header -->
        <div class="header">
          <a href="${env.frontendUrl}" class="logo">DYPSM</a>
        </div>
        
        <!-- Main Content -->
        <div class="content">
          <h2 style="color: #111827; margin-top: 0;">Welcome to DYPSM!</h2>
          <p>Hello,</p>
          <p>Thank you for creating a DYPSM account. To get started, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <div class="code-box">
            ${verificationUrl}
          </div>
          
          <p>This verification link will expire in <strong>24 hours</strong> for security reasons.</p>
          
          <p>If you didn't create a DYPSM account, you can safely ignore this email.</p>
          
          <p>Best regards,<br>The DYPSM Team</p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p>© ${currentYear} DYPSM. All rights reserved.</p>
          <p>This email was sent to ${email} as part of your DYPSM account registration.</p>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
            DYPSM, 123 Education St, Kigali, Rwanda
          </p>
        </div>
      </div>
    </body>
    </html>
    `
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const resetUrl = `${env.frontendUrl}/reset-password?token=${token}`;
  const currentYear = new Date().getFullYear();
  
  return sendEmail({
    to: email,
    subject: 'Reset Your DYPSM Account Password',
    text: `You requested to reset your DYPSM account password. Please use the following link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - DYPSM</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1a56db; padding: 20px; text-align: center; }
        .logo { color: white; font-size: 24px; font-weight: 700; text-decoration: none; }
        .content { padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none; }
        .button {
          display: inline-block; 
          padding: 12px 24px; 
          background-color: #1a56db; 
          color: white; 
          text-decoration: none; 
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer { 
          text-align: center; 
          padding: 20px; 
          font-size: 14px; 
          color: #6b7280;
          background-color: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }
        .code-box {
          background-color: #f3f4f6;
          padding: 15px;
          border-radius: 6px;
          word-break: break-all;
          margin: 15px 0;
          font-family: monospace;
          font-size: 14px;
        }
      </style>
    </head>
    <body style="background-color: #f3f4f6; padding: 20px 0;">
      <div class="container">
        <!-- Header -->
        <div class="header">
          <a href="${env.frontendUrl}" class="logo">DYPSM</a>
        </div>
        
        <!-- Main Content -->
        <div class="content">
          <h2 style="color: #111827; margin-top: 0;">Reset Your Password</h2>
          <p>Hello, {{profile.firstName}}</p>
          <p>We received a request to reset the password for your DYPSM account. Click the button below to set a new password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <div class="code-box">
            ${resetUrl}
          </div>
          
          <p>This link will expire in <strong>1 hour</strong> for security reasons.</p>
          
          <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          
          <p>Best regards,<br>The DYPSM Team</p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p>© ${currentYear} DYPSM. All rights reserved.</p>
          <p>This email was sent to ${email} as part of your DYPSM account.</p>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
            YOUTH PROFILING SYSTEM, Kigali, Rwanda
          </p>
        </div>
      </div>
    </body>
    </html>
    `
  });
}
