import { Module } from '@nestjs/common'
import { GameMatchmakingMembersService } from './game-matchmaking-members.service'
import { GameMatchmakingMembersResolver } from './game-matchmaking-members.resolver'
import { GamesService } from 'src/games/games.service'
import { GameMembersService } from 'src/game-members/game-members.service'
import { UserPresencesService } from 'src/user-presences/user-presences.service'
@Module({
  providers: [
    GameMatchmakingMembersResolver,
    GameMatchmakingMembersService,
    GamesService,
    GameMembersService,
    UserPresencesService
  ],
  imports: [],
})
export class GameMatchmakingMembersModule { }
