import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter | null = null;
  private readonly logger = new Logger(MailerService.name);

  private async getTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT || 587),
        secure: (process.env.MAIL_SECURE || 'false') === 'true',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
    }
    return this.transporter;
  }

  async sendActivationEmail(userEmail: string, token: string) {
    try {
      const transporter = await this.getTransporter();
      const from = process.env.MAIL_FROM || 'no-reply@varms.local';
      const frontendUrl =
        process.env.FRONTEND_URL ||
        process.env.APP_BASE_URL ||
        'http://localhost:3001';
      const link = `${frontendUrl.replace(/\/$/, '')}/activate?token=${encodeURIComponent(token)}`;
      await transporter.sendMail({
        from,
        to: userEmail,
        subject: 'Activate your VARMS account',
        text: `Welcome to VARMS! Activate your account: ${link}`,
        html: `<p>Welcome to VARMS!</p><p>Activate your account by clicking <a href="${link}">here</a>.</p>`,
      });
    } catch (e) {
      this.logger.warn(`Activation email failed: ${e?.message || e}`);
    }
  }

  async sendPasswordResetEmail(userEmail: string, token: string) {
    try {
      const transporter = await this.getTransporter();
      const from = process.env.MAIL_FROM || 'no-reply@varms.local';
      const frontendUrl =
        process.env.FRONTEND_URL ||
        process.env.APP_BASE_URL ||
        'http://localhost:3001';
      const link = `${frontendUrl.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;
      await transporter.sendMail({
        from,
        to: userEmail,
        subject: 'Reset your VARMS password',
        text: `Reset your password using this link: ${link}`,
        html: `<p>Reset your password by clicking <a href="${link}">this link</a>.</p>`,
      });
    } catch (e) {
      this.logger.warn(`Password reset email failed: ${e?.message || e}`);
    }
  }
}
