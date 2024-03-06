import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { GroupTeamMap, User, UserTeam } from '@entity'
import { CreateUserDto, ResetPasswordDto, UpdateUserDto, UserResponseDto } from '@dto'
import { addLabelsToUser } from '@util'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async getUserByEmail(email: string, isLogin?: boolean) {
    return this.users.findOne({ where: { email }, select: ['id', 'email', 'password', 'name'] })
  }

  async getUserById(id: number) {
    return this.users.findOne({ where: { id } })
  }

  async createUser({ email, password, name }: CreateUserDto): Promise<UserResponseDto> {
    try {
      const exists = await this.users.exist({ where: { email } })

      if (exists) throw new ConflictException()

      const user = await this.users.save(this.users.create({ email, password, name }))

      return addLabelsToUser(user)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async updateUser(userId: number, { name, role, teams }: UpdateUserDto): Promise<UserResponseDto> {
    try {
      const user = await this.getUserById(userId)

      if (name) user.name = name
      if (role) user.role = role
      if (teams) user.teams = teams as UserTeam[]

      const result = await this.users.save(user)

      return addLabelsToUser(result)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async resetPassword({ email, password }: ResetPasswordDto): Promise<UserResponseDto> {
    try {
      const user = await this.getUserByEmail(email)

      if (!user) throw new NotFoundException()

      user.password = password

      const result = await this.users.save(user)

      return addLabelsToUser(result)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async joinTeam(userId: number, team: UserTeam): Promise<UserResponseDto> {
    try {
      const user = await this.getUserById(userId)

      if (!GroupTeamMap[user.group].includes(team)) throw new ForbiddenException()
      if (!Object.values(UserTeam).includes(team)) throw new NotFoundException()
      if (user.teams && user.teams.includes(team)) throw new ConflictException()
      user.teams = user.teams ? [...user.teams, team] : [team]

      const result = await this.users.save(user)

      return addLabelsToUser(result)
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
