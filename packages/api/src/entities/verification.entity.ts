import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm'
import { IsEmail } from 'class-validator'

import { Core } from '@entity'

@Entity()
export class Verification extends Core {
  @Column()
  code: string

  @Column()
  @IsEmail()
  email: string

  @BeforeInsert()
  @BeforeUpdate()
  generateCode() {
    this.code = Math.floor(100000 + Math.random() * 900000).toString()
  }
}
