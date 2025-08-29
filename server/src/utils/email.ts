import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Create transporter with configuration from environment variables
const createTransporter = (): nodemailer.Transporter<SMTPTransport.SentMessageInfo> => {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  };

  return nodemailer.createTransport(config);
};

//password reset email 
const getPasswordResetEmailTemplate = (userName: string, resetLink: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your DYPSE Password</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background-color: #f8fafc;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                margin-top: 40px;
                margin-bottom: 40px;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 0;
                text-align: center;
            }
            .header h1 {
                color: white;
                margin: 0;
                font-size: 32px;
                font-weight: 700;
                letter-spacing: -0.5px;
            }
            .header p {
                color: rgba(255, 255, 255, 0.9);
                margin: 8px 0 0 0;
                font-size: 16px;
                font-weight: 400;
            }
            .content {
                padding: 48px 40px;
            }
            .greeting {
                font-size: 18px;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 24px;
            }
            .message {
                font-size: 16px;
                color: #4b5563;
                margin-bottom: 32px;
                line-height: 1.7;
            }
            .button-container {
                text-align: center;
                margin: 40px 0;
            }
            .reset-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                padding: 16px 32px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
            }
            .reset-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
            }
            .alternative-link {
                background-color: #f3f4f6;
                border: 2px dashed #d1d5db;
                border-radius: 8px;
                padding: 20px;
                margin: 32px 0;
                text-align: center;
            }
            .alternative-link p {
                color: #6b7280;
                font-size: 14px;
                margin: 0 0 12px 0;
            }
            .alternative-link a {
                color: #4f46e5;
                font-size: 14px;
                word-break: break-all;
                text-decoration: none;
            }
            .security-notice {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 16px 20px;
                margin: 32px 0;
                border-radius: 0 8px 8px 0;
            }
            .security-notice h3 {
                color: #92400e;
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 8px 0;
            }
            .security-notice p {
                color: #92400e;
                font-size: 14px;
                margin: 0;
            }
            .footer {
                background-color: #f9fafb;
                padding: 32px 40px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
            }
            .footer p {
                color: #6b7280;
                font-size: 14px;
                margin: 0;
            }
            .footer a {
                color: #4f46e5;
                text-decoration: none;
            }
            .expiry-info {
                background-color: #eff6ff;
                border: 1px solid #bfdbfe;
                border-radius: 8px;
                padding: 16px;
                margin: 24px 0;
            }
            .expiry-info p {
                color: #1e40af;
                font-size: 14px;
                margin: 0;
                font-weight: 500;
            }
            @media (max-width: 600px) {
                .container {
                    margin: 20px;
                    border-radius: 8px;
                }
                .content {
                    padding: 32px 24px;
                }
                .header {
                    padding: 32px 20px;
                }
                .header h1 {
                    font-size: 28px;
                }
                .footer {
                    padding: 24px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>DYPSE</h1>
                <p>Dynamic Youth Profiling System for employment and skills mapping</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Hello ${userName}! 👋
                </div>
                
                <div class="message">
                    We received a request to reset the password for your DYPSE account. If you made this request, click the button below to create a new password.
                </div>
                
                <div class="button-container">
                    <a href="${resetLink}" class="reset-button">Reset My Password</a>
                </div>
                
                <div class="expiry-info">
                    <p>⏰ This link will expire in 1 hour for security reasons.</p>
                </div>
                
                <div class="alternative-link">
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <a href="${resetLink}">${resetLink}</a>
                </div>
                
                <div class="security-notice">
                    <h3>🔐 Security Notice</h3>
                    <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged, and no further action is required.</p>
                </div>
            </div>
            
            <div class="footer">
                <p>
                    This email was sent by DYPSE.<br>
                    If you have any questions, please contact Evode our support HelpDesk!.<br>
                    <a href="mailto:${process.env.SMTP_FROM || 'evodemuyisingize@gmail.com'}">Contact Support</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Notification email for successful password reset 
const getPasswordResetSuccessTemplate = (userName: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Successfully Reseted | DYPSE</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background-color: #f8fafc;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                padding: 40px 0;
                text-align: center;
            }
            .header h1 {
                color: white;
                margin: 0;
                font-size: 32px;
                font-weight: 700;
            }
            .content {
                padding: 48px 40px;
                text-align: center;
            }
            .success-icon {
                font-size: 64px;
                margin-bottom: 24px;
            }
            .message {
                font-size: 18px;
                color: #1f2937;
                font-weight: 600;
                margin-bottom: 16px;
            }
            .sub-message {
                font-size: 16px;
                color: #4b5563;
                margin-bottom: 32px;
            }
            .footer {
                background-color: #f9fafb;
                padding: 32px 40px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>DYPSE</h1>
            </div>
            
            <div class="content">
                <div class="success-icon">✅</div>
                <div class="message">Password Reset Successful!</div>
                <div class="sub-message">
                    Hello ${userName}, your password has been successfully reset. You can now log in with your new password.
                </div>
            </div>
            
            <div class="footer">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                    This is an automated security notification from DYPSE.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  userName: string,
  resetToken: string
): Promise<void> => {
  try {
    const transporter = createTransporter();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || `"DYPSE" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Reset Your DYPSE Password',
      html: getPasswordResetEmailTemplate(userName, resetLink),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', result.messageId);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send password reset success email
export const sendPasswordResetSuccessEmail = async (
  email: string,
  userName: string
): Promise<void> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM || `"DYPSE" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Successfully Reset | DYPSE ✅',
      html: getPasswordResetSuccessTemplate(userName),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset success email sent:', result.messageId);
  } catch (error) {
    console.error('Error sending password reset success email:', error);
  }
};

// Test email configuration
export const testEmailConfig = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};
