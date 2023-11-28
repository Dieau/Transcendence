import { Module } from '@nestjs/common'
import { UserPresencesService } from './user-presences.service'
import { UserPresencesResolver } from './user-presences.resolver'

@Module({
  providers: [UserPresencesResolver, UserPresencesService],
  imports: [],
  exports: [UserPresencesService],
})
export class UserPresencesModule {}
