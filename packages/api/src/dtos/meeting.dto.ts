import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'

import { MeetingStatus, User } from '@entity'

export class MeetingRequestDto {
  @ApiProperty()
  @IsString()
  content: string
}

export class MeetingStatusRequestDto {
  @ApiProperty({ enum: MeetingStatus, enumName: 'MeetingStatus' })
  @IsEnum(MeetingStatus)
  status: MeetingStatus
}

export class MeetingResponseDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  createdAt: Date

  @ApiProperty({ type: () => User })
  reporter?: User

  @ApiProperty({ type: () => User })
  recipient?: User

  @ApiProperty()
  content: string

  @ApiProperty()
  myWaitingNumber?: number

  @ApiProperty({ enum: MeetingStatus, enumName: 'MeetingStatus' })
  @IsEnum(MeetingStatus)
  status: MeetingStatus
}
