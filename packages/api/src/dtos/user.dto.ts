import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator'

import { UserRole } from '@entity'
import { LabeledDto } from '@dto'

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: '이메일 주소' })
  email: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '비밀번호' })
  password: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '이름' })
  name: string
}

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '이름' })
  name: string

  @IsNotEmpty()
  @ApiProperty({
    enum: UserRole,
    enumName: 'UserRole',
  })
  @IsEnum(UserRole)
  role: UserRole

  @IsNotEmpty()
  @ApiProperty({ description: '팀', isArray: true, type: 'string' })
  teams: string[]
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: '이메일 주소' })
  email: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '비밀번호' })
  password: string
}

export class UserResponseDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  email: string

  @ApiProperty()
  name: string

  @ApiProperty({ type: () => LabeledDto })
  group: LabeledDto

  @ApiProperty({ type: () => LabeledDto, isArray: true })
  teams: LabeledDto[]

  @ApiProperty({
    enum: UserRole,
    enumName: 'UserRole',
  })
  @IsEnum(UserRole)
  role: UserRole
}

export class VerificationEmailDto {
  @ApiProperty()
  isFind?: boolean
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: '이메일 주소' })
  email: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '비밀번호' })
  password: string
}
