import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm'
import { IsEmail, IsEnum, Length } from 'class-validator'
import * as bcrypt from 'bcrypt'

import { Core, EMAIL_GROUP_MAP, UserGroup, UserRole, UserTeam, UserType } from '@entity'

const DEFAULT_SALT_ROUND = 10

@Entity()
export class User extends Core {
  @Column()
  @IsEmail()
  email: string

  @Column({ select: false })
  password: string

  @Column()
  @Length(2, 5)
  name: string

  @Column({ type: 'enum', enum: UserGroup, default: UserGroup.NOT_BELONG })
  @IsEnum(UserGroup)
  group: UserGroup

  @Column('simple-array', { default: null })
  @IsEnum(UserTeam, { each: true })
  teams: UserTeam[]

  @Column({ type: 'enum', enum: UserRole, default: UserRole.REPORTER })
  @IsEnum(UserRole)
  role: UserRole

  @Column({ nullable: true })
  image?: string

  @Column({ type: 'enum', enum: UserType, default: UserType.GENERAL })
  @IsEnum(UserTeam)
  type: UserType

  @BeforeInsert()
  setGroup() {
    const [_, domain] = this.email.split('@')
    let group = UserGroup.NOT_BELONG

    if (domain in EMAIL_GROUP_MAP) group = EMAIL_GROUP_MAP[domain]

    this.group = group
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, DEFAULT_SALT_ROUND)
      } catch (e) {
        console.error(e)
        throw e
      }
    }
  }

  async checkPassword(inputPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(inputPassword, this.password)
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
