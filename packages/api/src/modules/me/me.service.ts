import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserResponseDto } from '@dto'
import { User } from '@entity'
import { addLabelsToUser } from '@util'

@Injectable()
export class MeService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async getMe(id: number): Promise<UserResponseDto> {
    try {
      const me = await this.users.findOne({ where: { id } })
      return addLabelsToUser(me)
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
