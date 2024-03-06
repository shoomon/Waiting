import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, LessThanOrEqual, Repository } from 'typeorm'
import { startOfDay, endOfDay, isToday } from 'date-fns'

import { Meeting, MeetingStatus, UserRole } from '@entity'
import { MeetingRequestDto, MeetingResponseDto, MeetingStatusRequestDto } from '@dto'
import { getDateForEmailNotification, getKoreanTime } from '@util'

import { UserService } from '../user'
import { NotificationService } from '../notification'

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting) private readonly meetings: Repository<Meeting>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  getHello(): string {
    return 'Hello from ExampleService!'
  }

  async getMeetingById(id: number): Promise<MeetingResponseDto> {
    return this.meetings.findOne({
      where: { id },
      relations: ['reporter', 'recipient'],
      select: ['id', 'createdAt', 'content', 'status'],
    })
  }

  async getSentMeetingsByUser(userId: number): Promise<MeetingResponseDto[]> {
    try {
      const meetings = (await this.meetings.find({
        where: { reporter: { id: userId } },
        relations: ['recipient'],
        order: { createdAt: 'DESC' },
      })) as MeetingResponseDto[]

      for (const meeting of meetings) {
        const { id, status, createdAt, recipient } = meeting
        if (status === MeetingStatus.PENDING && isToday(createdAt)) {
          meeting.myWaitingNumber = await this.getWaitingNumber(recipient.id, id)
        }
      }

      return meetings
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async getReceivedMeetingsByUser(userId: number): Promise<MeetingResponseDto[]> {
    try {
      return this.meetings.find({
        where: { recipient: { id: userId } },
        relations: ['reporter'],
        order: { createdAt: 'DESC' },
      })
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async getWaitingNumber(recipientId: number, meetingId: number) {
    const now = new Date()
    const startOfToday = startOfDay(now)
    const endOfToday = endOfDay(now)

    return this.meetings.count({
      where: {
        recipient: { id: recipientId },
        createdAt: Between(startOfToday, endOfToday),
        status: MeetingStatus.PENDING,
        id: LessThanOrEqual(meetingId),
      },
    })
  }

  async createMeeting(
    reporterId: number,
    recipientId: number,
    { content }: MeetingRequestDto,
  ): Promise<MeetingResponseDto> {
    try {
      const now = new Date()
      const startOfToday = startOfDay(now)
      const endOfToday = endOfDay(now)

      const exists = await this.meetings.exist({
        where: {
          createdAt: Between(startOfToday, endOfToday),
          reporter: { id: reporterId },
          recipient: { id: recipientId },
          status: MeetingStatus.PENDING,
        },
      })

      if (exists) throw new ConflictException()

      const reporter = await this.userService.getUserById(reporterId)
      const recipient = await this.userService.getUserById(recipientId)

      if (!reporter || !recipient) throw new NotFoundException()
      if (recipient.role !== UserRole.RECIPIENT) throw new BadRequestException()

      const meeting = await this.meetings.save(this.meetings.create({ reporter, recipient, content }))

      this.notificationService.sendReceivedMeetingEmail(
        recipient.email,
        getDateForEmailNotification(getKoreanTime()),
        reporter.name,
      )

      return meeting
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async updateMeeting(
    meetingId: number,
    reporterId: number,
    { content }: MeetingRequestDto,
  ): Promise<MeetingResponseDto> {
    try {
      const meeting = (await this.getMeetingById(meetingId)) as any

      if (!meeting) throw new NotFoundException()
      if (meeting.reporter.id !== reporterId) throw new UnauthorizedException()

      meeting.content = content

      return this.meetings.save(meeting)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async deleteMeeting(meetingId: number, userId: number): Promise<boolean> {
    try {
      const meeting = (await this.getMeetingById(meetingId)) as any

      if (!meeting) throw new NotFoundException()
      if (meeting.reporter.id !== userId && meeting.recipient.id !== userId) throw new UnauthorizedException()

      const result = (await this.meetings.remove(meeting)) as any

      return result.id === undefined
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async updateMeetingStatus(
    meetingId: number,
    recipientId: number,
    { status }: MeetingStatusRequestDto,
  ): Promise<MeetingResponseDto> {
    try {
      const meeting = (await this.getMeetingById(meetingId)) as any

      if (!meeting) throw new NotFoundException()
      if (meeting.recipient.id !== recipientId) throw new UnauthorizedException()

      meeting.status = status

      const updatedMeeting = this.meetings.save(meeting)

      this.notificationService.sendMeetingStatusUpdateEmail(
        status,
        meeting.reporter.email,
        getDateForEmailNotification(getKoreanTime()),
        meeting.recipient.name,
      )

      return updatedMeeting
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
