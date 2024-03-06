import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

import { MeetingStatus } from '@entity'

import {
  MEETING_STATUS_EMAIL_HTML,
  MEETING_STATUS_EMAIL_SUBJECT,
  RECEIVED_MEETING_EMAIL_HTML,
  RECEIVED_MEETING_EMAIL_SUBJECT,
} from './consts'

@Injectable()
export class NotificationService {
  private transporter

  constructor() {
    // 이메일 계정 정보
    const emailConfig = {
      service: 'gmail',
      auth: {
        user: 'limi.chory@gmail.com',
        pass: 'jmjl cxdj moti zjgn',
      },
    }

    // 이메일 전송 설정
    this.transporter = nodemailer.createTransport({
      service: emailConfig.service,
      auth: emailConfig.auth,
    })
  }

  async sendReceivedMeetingEmail(email: string, date: string, reporter: string): Promise<boolean> {
    // 이메일 옵션
    const mailOptions = {
      to: email,
      subject: RECEIVED_MEETING_EMAIL_SUBJECT,
      html: RECEIVED_MEETING_EMAIL_HTML(date, reporter),
    }

    // 이메일 전송
    try {
      await this.transporter.sendMail(mailOptions)
      return true
    } catch (e) {
      console.error('Error:', e)
      throw new Error('Failed to send email.')
    }
  }

  async sendMeetingStatusUpdateEmail(
    status: MeetingStatus,
    email: string,
    date: string,
    recipient: string,
  ): Promise<boolean> {
    // 이메일 옵션
    const mailOptions = {
      to: email,
      subject: MEETING_STATUS_EMAIL_SUBJECT(status),
      html: MEETING_STATUS_EMAIL_HTML(status, date, recipient),
    }

    // 이메일 전송
    try {
      await this.transporter.sendMail(mailOptions)
      return true
    } catch (e) {
      console.error('Error:', e)
      throw new Error('Failed to send email.')
    }
  }
}
