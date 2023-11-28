import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersResolver } from './users.resolver'
import { UserPresencesService } from 'src/user-presences/user-presences.service'

@Module({
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
  imports: [],
})
export class UsersModule {}
