import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const [_, token] = request.headers['authorization'].split(' ')

    if (!token) return false

    try {
      const decoded = this.jwtService.verify(token)
      request.user = decoded

      return true
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
