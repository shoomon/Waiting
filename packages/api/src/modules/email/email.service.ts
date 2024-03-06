import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as nodemailer from 'nodemailer'
import { Repository } from 'typeorm'

import { Verification } from '@entity'

import { VERIFICATION_EMAIL_HTML, VERIFICATION_EMAIL_SUBJECT } from './consts'
import { UserService } from '../user'

@Injectable()
export class EmailService {
  private transporter

  constructor(
    @InjectRepository(Verification) private readonly verifications: Repository<Verification>,
    private readonly userService: UserService,
  ) {
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

  private async findVerification(email: string): Promise<Verification> {
    return this.verifications.findOne({ where: { email } })
  }

  private async createVerification(email: string): Promise<Verification> {
    const verification = await this.verifications.create({ email })
    return this.verifications.save(verification)
  }

  private async updateVerification(verification: Verification): Promise<Verification> {
    await this.verifications.update({ id: verification.id }, verification)
    return this.findVerification(verification.email)
  }

  private async removeVerification(verification: Verification) {
    await this.verifications.remove(verification)
  }

  async sendVerificationEmail(email: string, isFind?: boolean): Promise<boolean> {
    if (isFind) {
      const user = await this.userService.getUserByEmail(email, false)
      if (!user) throw new NotFoundException()
    }

    let verifyCode
    const prevVerification = await this.findVerification(email)

    if (prevVerification) {
      verifyCode = await (await this.updateVerification(prevVerification)).code
    } else {
      verifyCode = await (await this.createVerification(email)).code
    }

    if (!verifyCode) throw new Error('No Verify code')

    // 이메일 옵션
    const mailOptions = {
      to: email,
      subject: VERIFICATION_EMAIL_SUBJECT,
      html: VERIFICATION_EMAIL_HTML(verifyCode),
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

  async verifyCode(email: string, code: string): Promise<boolean> {
    const verification = await this.findVerification(email)

    if (!verification) return false
    if (verification.code === code) {
      await this.removeVerification(verification)
      return true
    }

    return false
  }
}
