import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter | null = null;
  private readonly logger = new Logger(NotificationsService.name);
  constructor(
    @InjectModel(Notification.name)
    private readonly notifModel: Model<Notification>,
  ) {}

  async sendInApp(userId: string, title: string, message: string) {
    const n = new this.notifModel({
      userId: new Types.ObjectId(userId),
      title,
      message,
      channel: 'inapp',
    });
    return n.save();
  }

  async sendEmail(userId: string, title: string, message: string) {
    try {
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
      const from = process.env.MAIL_FROM || 'no-reply@vams.local';
      const to = process.env.MAIL_TO_OVERRIDE || undefined; // for testing override
      await this.transporter.sendMail({
        from,
        to,
        subject: title,
        text: message,
        html: `<p>${message}</p>`,
      });
    } catch (e) {
      this.logger.warn(`Email send failed: ${e?.message || e}`);
    }
    const n = new this.notifModel({
      userId: new Types.ObjectId(userId),
      title,
      message,
      channel: 'email',
    });
    return n.save();
  }

  async sendSms(userId: string, message: string) {
    // Stub: integrate SMS provider
    const n = new this.notifModel({
      userId: new Types.ObjectId(userId),
      title: 'SMS',
      message,
      channel: 'sms',
    });
    return n.save();
  }

  list(userId: string) {
    return this.notifModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  markRead(id: string) {
    return this.notifModel
      .findByIdAndUpdate(id, { read: true }, { new: true })
      .exec();
  }
}
