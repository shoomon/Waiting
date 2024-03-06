import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User, Verification } from '@entity'

import { EmailService } from './email.service'
import { UserService } from '../user'

@Module({
  imports: [TypeOrmModule.forFeature([Verification, User])],
  providers: [EmailService, UserService],
})
export class EmailModule {}
