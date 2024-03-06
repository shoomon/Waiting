import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request } from 'express'

import { AuthService, UserService } from '@module'

export const AUTHORIZATION_KEY = 'Authorization'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  async use(req: Request, next: NextFunction) {
    const token = req?.headers?.[AUTHORIZATION_KEY]
    if (token) {
      try {
        const decoded = await this.authService.verifyToken(token.toString())
        if (decoded) {
          const user = await this.userService.getUserById(decoded.id)
          Object.assign(req, { user })
        }
      } catch (e) {
        console.error(e)
        throw e
      }
    }
    next()
  }
}
