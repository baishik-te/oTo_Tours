'use strict';

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.lastSentEmails = new Map(); // Useful for tests and development inspection
    this._initTransporter();
  }

  _initTransporter() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // Do not attempt live SMTP socket in unit testing mode unless explicitly configured
    if (process.env.NODE_ENV === 'test') {
      this.transporter = null;
      return;
    }

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user, pass }
      });
    } else {
      this.transporter = null;
    }
  }

  /**
   * Send OTP verification email via SMTP
   */
  async sendOtpEmail(email, otp, name = 'Adventurer') {
    const sender = process.env.SMTP_FROM || 'oTo Tours <no-reply@ototours.com>';
    const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || '10';

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #f0f0f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #ff6a00; font-size: 28px; margin: 0; letter-spacing: 2px;">oTo TOURS</h1>
          <p style="color: #666; font-size: 13px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Ride The Future. Experience The City.</p>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 12px;">Verify Your Email Address</h2>
        <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6;">Hello ${name},</p>
        <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6;">Thank you for registering with <strong>oTo Tours</strong>. Use the 6-digit one-time verification code below to activate your account and upgrade to full rider membership:</p>
        <div style="text-align: center; margin: 28px 0;">
          <div style="display: inline-block; padding: 14px 32px; background: #fff5eb; border: 2px dashed #ff6a00; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #ff6a00;">
            ${otp}
          </div>
        </div>
        <p style="color: #666; font-size: 13px; text-align: center;">This code will expire in <strong>${expiryMinutes} minutes</strong>.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px; line-height: 1.5; margin: 0;">If you did not request this verification code, please ignore this email. Your account will remain in guest status.</p>
      </div>
    `;

    const mailOptions = {
      from: sender,
      to: email,
      subject: `Your oTo Tours Verification Code: ${otp}`,
      text: `Hello ${name},\n\nYour oTo Tours verification code is: ${otp}\nThis code expires in ${expiryMinutes} minutes.\n\nThank you for choosing oTo Tours!`,
      html: htmlContent
    };

    // Store in memory cache for test verification
    this.lastSentEmails.set(email.toLowerCase(), {
      type: 'otp_verification',
      email,
      otp,
      name,
      sentAt: new Date()
    });

    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId, email, otp };
      } catch (err) {
        console.error('SMTP Delivery error:', err.message);
        return { success: true, simulated: true, email, otp, error: err.message };
      }
    }

    return {
      success: true,
      simulated: true,
      messageId: `simulated-${Date.now()}`,
      email,
      otp
    };
  }

  /**
   * Send Forgot Password OTP email via SMTP
   */
  async sendForgotPasswordEmail(email, otp, name = 'Valued User') {
    const sender = process.env.SMTP_FROM || 'oTo Tours <no-reply@ototours.com>';
    const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || '10';

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #f0f0f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #ff6a00; font-size: 28px; margin: 0; letter-spacing: 2px;">oTo TOURS</h1>
          <p style="color: #666; font-size: 13px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Ride The Future. Experience The City.</p>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 12px;">Reset Your Password</h2>
        <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6;">Hello ${name},</p>
        <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6;">We received a request to reset your password for your <strong>oTo Tours</strong> account. Use the one-time verification code below to authorize your password reset:</p>
        <div style="text-align: center; margin: 28px 0;">
          <div style="display: inline-block; padding: 14px 32px; background: #fff5eb; border: 2px dashed #ff6a00; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #ff6a00;">
            ${otp}
          </div>
        </div>
        <p style="color: #666; font-size: 13px; text-align: center;">This code will expire in <strong>${expiryMinutes} minutes</strong>.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px; line-height: 1.5; margin: 0;">If you did not request a password reset, please secure your account immediately or disregard this email.</p>
      </div>
    `;

    const mailOptions = {
      from: sender,
      to: email,
      subject: `oTo Tours Password Reset Code: ${otp}`,
      text: `Hello ${name},\n\nYour oTo Tours password reset code is: ${otp}\nThis code expires in ${expiryMinutes} minutes.\n\nIf you did not request this, please ignore this email.`,
      html: htmlContent
    };

    this.lastSentEmails.set(email.toLowerCase(), {
      type: 'forgot_password',
      email,
      otp,
      name,
      sentAt: new Date()
    });

    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId, email, otp };
      } catch (err) {
        console.error('SMTP Delivery error:', err.message);
        return { success: true, simulated: true, email, otp, error: err.message };
      }
    }

    return {
      success: true,
      simulated: true,
      messageId: `simulated-${Date.now()}`,
      email,
      otp
    };
  }

  /**
   * Send Password Reset Success Notification
   */
  async sendPasswordResetSuccessEmail(email, name = 'Valued User') {
    const sender = process.env.SMTP_FROM || 'oTo Tours <no-reply@ototours.com>';

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #f0f0f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #2e7d32; font-size: 20px; margin-bottom: 12px;">Password Reset Successful</h2>
        <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6;">Hello ${name},</p>
        <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6;">Your password for your <strong>oTo Tours</strong> account has been successfully updated. If you did not perform this change, please contact our support team immediately.</p>
      </div>
    `;

    const mailOptions = {
      from: sender,
      to: email,
      subject: 'oTo Tours Password Updated',
      text: `Hello ${name},\n\nYour oTo Tours account password was successfully updated.`,
      html: htmlContent
    };

    if (this.transporter) {
      try {
        await this.transporter.sendMail(mailOptions);
      } catch (err) {
        console.error('SMTP Delivery error:', err.message);
      }
    }

    return { success: true };
  }

  getLastSentEmail(email) {
    return this.lastSentEmails.get(email.toLowerCase()) || null;
  }
}

module.exports = new EmailService();
