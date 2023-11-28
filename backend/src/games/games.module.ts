import { Module } from '@nestjs/common'
import { GamesService } from './games.service'
import { GamesResolver } from './games.resolver'
import { UsersModule } from 'src/users/users.module'
import { GameMembersService } from 'src/game-members/game-members.service'
import { UserPresencesService } from 'src/user-presences/user-presences.service'

@Module({
  providers: [
    GamesResolver,
    GamesService,
    GameMembersService,
    UserPresencesService,
  ],
  imports: [UsersModule],
})
export class GamesModule {}
