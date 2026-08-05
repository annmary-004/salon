import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.initTransporter();
  }

  private async initTransporter() {
    try {
      const emailUser = process.env.EMAIL_USER;
      const emailPass = process.env.EMAIL_PASS;

      if (emailUser && emailPass) {
        this.transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.EMAIL_PORT || '587'),
          secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });
        this.logger.log(`Real SMTP Email Transporter initialized with account: ${emailUser}`);
      } else {
        // Fallback to Ethereal test account for local development
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        this.logger.log(`Ethereal Test Email Transporter initialized (No real SMTP configured in .env). User: ${testAccount.user}`);
      }
    } catch (err) {
      this.logger.error('Failed to initialize Email Transporter', err);
    }
  }

  async sendWelcomeEmail(email: string, name: string) {
    if (!this.transporter) return;
    try {
      const fromAddr = process.env.EMAIL_FROM || '"Salon Studio" <noreply@salonstudio.com>';
      const info = await this.transporter.sendMail({
        from: fromAddr,
        to: email,
        subject: 'Welcome to Salon Studio!',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #111;">Hello ${name},</h2>
            <p>Welcome to <strong>Salon Studio</strong>! Your account has been successfully created.</p>
            <p>We are excited to have you. You can now log in and book your next premium salon experience.</p>
            <br>
            <p>Best regards,<br>The Salon Studio Team</p>
          </div>
        `,
      });
      const previewUrl = nodemailer.getTestMessageUrl(info);
      this.logger.log(`Welcome email sent to ${email}.${previewUrl ? ' Preview URL: ' + previewUrl : ''}`);
    } catch (err) {
      this.logger.error('Error sending welcome email', err);
    }
  }

  async sendBookingConfirmation(email: string, name: string, serviceName: string, date: string, time: string) {
    if (!this.transporter) return;
    try {
      const fromAddr = process.env.EMAIL_FROM || '"Salon Studio" <noreply@salonstudio.com>';
      const info = await this.transporter.sendMail({
        from: fromAddr,
        to: email,
        subject: 'Booking Confirmation - Salon Studio',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #111;">Booking Confirmed!</h2>
            <p>Hi ${name},</p>
            <p>Your appointment has been successfully booked.</p>
            <table style="border-collapse: collapse; width: 100%; max-width: 400px; margin-top: 20px;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Service:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Time:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${time}</td>
              </tr>
            </table>
            <br>
            <p>We look forward to seeing you!</p>
            <p>Best regards,<br>The Salon Studio Team</p>
          </div>
        `,
      });
      const previewUrl = nodemailer.getTestMessageUrl(info);
      this.logger.log(`Booking email sent to ${email}.${previewUrl ? ' Preview URL: ' + previewUrl : ''}`);
    } catch (err) {
      this.logger.error('Error sending booking confirmation email', err);
    }
  }
}
