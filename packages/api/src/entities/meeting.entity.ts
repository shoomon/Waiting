import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { IsEnum, IsString } from 'class-validator'

import { Core } from './core.entity'
import { User } from './user.entity'
import { MeetingStatus } from './types'

@Entity()
export class Meeting extends Core {
  @PrimaryGeneratedColumn()
  id: number

  @JoinColumn({ name: 'reporter_id', referencedColumnName: 'id' })
  @ManyToOne(() => User)
  reporter: User

  @JoinColumn({ name: 'recipient_id', referencedColumnName: 'id' })
  @ManyToOne(() => User)
  recipient: User

  @Column({ nullable: true })
  @IsString()
  content: string

  @Column({ type: 'enum', enum: MeetingStatus, default: MeetingStatus.PENDING })
  @IsEnum(MeetingStatus)
  status: MeetingStatus
}
