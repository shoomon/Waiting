import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CreateUserDto, ResetPasswordDto, UpdateUserDto, UserResponseDto } from '@dto'
import { User } from '@entity'
import { ApiOperation, AuthUser } from '@decorators'

import { JwtAuthGuard } from '../auth/jwt.auth.guard'
import { UserService } from './user.service'

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({
    status: 201,
    type: UserResponseDto,
    description: '회원가입 완료',
  })
  @ApiOperation({ description: '회원가입' })
  @ApiBody({ type: CreateUserDto, description: '회원가입 정보 입력' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.createUser(createUserDto)
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: '회원정보 수정' })
  @ApiBody({ type: UpdateUserDto, description: '회원 수정 정보 입력' })
  async updateUser(@AuthUser() user: User, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return this.userService.updateUser(user.id, updateUserDto)
  }

  @Patch('/reset/password')
  @ApiOperation({ description: '비밀번호 변경' })
  @ApiBody({ type: ResetPasswordDto, description: '비밀번호 변경 정보 입력' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto)
  }
}
