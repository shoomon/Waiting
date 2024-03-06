import { Controller, Get, Post, Put, Delete, Param, UseGuards, Body, Patch } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'

import { ApiOperation, AuthUser } from '@decorators'
import { User } from '@entity'
import { MeetingRequestDto, MeetingResponseDto, MeetingStatusRequestDto } from '@dto'

import { MeetingService } from './meeting.service'
import { JwtAuthGuard } from '../auth/jwt.auth.guard'

@ApiTags('meetings')
@Controller('meetings')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Get('/sent')
  @ApiOperation({ description: '보낸 Meeting 리스트 조회' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getSentMeetings(@AuthUser() user: User) {
    return this.meetingService.getSentMeetingsByUser(user.id)
  }

  @Get('/received')
  @ApiOperation({ description: '받은 Meeting 리스트 조회' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getReceivedMeetings(@AuthUser() user: User) {
    return this.meetingService.getReceivedMeetingsByUser(user.id)
  }

  @Get('/:id')
  @ApiResponse({ status: 200, type: MeetingResponseDto, description: '미팅 정보 조회 완료' })
  @ApiOperation({ description: 'Meeting 조회' })
  getMeeting(@Param('id') id: number) {
    return this.meetingService.getMeetingById(id)
  }

  @Post('/:recipientId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Meeting 생성' })
  @ApiBody({ type: MeetingRequestDto, description: '미팅 생성 정보 입력' })
  createMeeting(
    @AuthUser() user: User,
    @Param('recipientId') recipientId: number,
    @Body() meetingRequestDto: MeetingRequestDto,
  ) {
    return this.meetingService.createMeeting(user.id, recipientId, meetingRequestDto)
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Meeting 수정' })
  @ApiBody({ type: MeetingRequestDto, description: '미팅 수정 정보 입력' })
  updateMeeting(@AuthUser() user: User, @Param('id') id: number, @Body() meetingRequestDto: MeetingRequestDto) {
    return this.meetingService.updateMeeting(id, user.id, meetingRequestDto)
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Meeting 삭제' })
  deleteMeeting(@AuthUser() user: User, @Param('id') id: number) {
    return this.meetingService.deleteMeeting(id, user.id)
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Meeting 상태 변경' })
  @ApiBody({ type: MeetingStatusRequestDto, description: '미팅 상태 수정 정보 입력' })
  updateMeetingStatus(
    @AuthUser() user: User,
    @Param('id') id: number,
    @Body() meetingStatusRequestDto: MeetingStatusRequestDto,
  ) {
    return this.meetingService.updateMeetingStatus(id, user.id, meetingStatusRequestDto)
  }
}
