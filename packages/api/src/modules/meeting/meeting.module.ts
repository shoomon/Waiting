import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Meeting, User } from '@entity'

import { MeetingController } from './meeting.controller'
import { MeetingService } from './meeting.service'
import { UserService } from '../user'
import { NotificationService } from '../notification'

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, User])],
  controllers: [MeetingController],
  providers: [MeetingService, UserService, NotificationService],
})
export class MeetingModule {}
