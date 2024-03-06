import { AuthModule } from './auth'
import { EmailModule } from './email'
import { MeModule } from './me'
import { TeamModule } from './team'
import { UserModule } from './user'
import { MeetingModule } from './meeting'

export * from './auth'
export * from './user'
export * from './meeting'
export * from './email'
export * from './me'
export * from './team'

export const Modules = [AuthModule, EmailModule, UserModule, MeModule, TeamModule, MeetingModule]
