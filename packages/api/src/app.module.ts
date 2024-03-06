import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Modules } from '@module'
import { Meeting, Verification, User } from '@entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'waiting',
      password: 'waiting',
      database: 'waiting',
      synchronize: true,
      entities: [Meeting, Verification, User],
    }),
    ...Modules,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
