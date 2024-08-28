//services/mailer.ts
import nodemailer from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';
import { ErrorResponse, HttpCode } from '../types/types';

interface MailOptions {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Attachment[];
}

class Mailer {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail(options: MailOptions): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      ...options,
      from: options.from || process.env.MAIL_USER,
    };
    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully.');
    } catch (error) {
      throw new ErrorResponse('Error emailing', HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
}

export default new Mailer();
