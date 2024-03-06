import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { ApiOperation, AuthUser } from '@decorators'
import { User } from '@entity'

import { TeamService } from './team.service'
import { JwtAuthGuard } from '../auth/jwt.auth.guard'

@ApiTags('teams')
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('/mates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: '팀원 조회' })
  async getTeammates(@AuthUser() user: User) {
    return this.teamService.getTeammates(user)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: '그룹의 팀 조회' })
  async getTeams(@AuthUser() user: User) {
    return this.teamService.getTeams(user.group)
  }
}
