import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { User } from '@entity'
import { LoginDto } from '@dto'

import { UserService } from '../user'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

  async validateUser({ email, password }: LoginDto) {
    try {
      const user = await this.userService.getUserByEmail(email)
      if (!user) throw new NotFoundException()

      const checkPassWord = await user.checkPassword(password)

      if (!checkPassWord) throw new UnauthorizedException()

      return user
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async createToken(userId: number): Promise<string> {
    return this.jwtService.signAsync({ id: userId })
  }

  async verifyToken(token: string): Promise<User> {
    try {
      return this.jwtService.verifyAsync(token)
    } catch (e) {
      throw new UnauthorizedException()
    }
  }
}
