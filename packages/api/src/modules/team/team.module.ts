import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from '@entity'

import { TeamController } from './team.controller'
import { TeamService } from './team.service'
import { UserService } from '../user'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [TeamController],
  providers: [TeamService, UserService],
})
export class TeamModule {}
