import { Resolver, Mutation, Args, Parent, ResolveField } from '@nestjs/graphql'
import { GameMembersService } from './game-members.service'
import { GameMember } from './entities/game-member.entity'
import * as DTO from './dto/game-member.input'
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator'
import { User } from '@prisma/client'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { UserPublicGameInfos } from 'src/users/entities/user.entity'

@Resolver(() => GameMember)
export class GameMembersResolver {
  constructor(private readonly gameMembersService: GameMembersService) { }

  //**************************************************//
  //  MUTATION
  //**************************************************//
  @Mutation(() => GameMember)
  @UseGuards(GqlAuthGuard)
  async updateGameMemberForGame(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.UpdateGameMemberInput,
  ) {
    return await this.gameMembersService.update(args.gameId, user.id, args)
  }

  //**************************************************//
  //  QUERY
  //**************************************************//

  @ResolveField(`userGameInfos`, () => UserPublicGameInfos)
  async userGameInfos(
    @Parent() gameMember: GameMember,
  ): Promise<UserPublicGameInfos> {
    const { user } = await this.gameMembersService.findOne({
      gameId: gameMember.gameId,
      userId: gameMember.userId,
    })

    const gameStats = user.gameStats
    let totalWins = 0

    gameStats.forEach((stats) => {
      if (stats.isWinner) {
        totalWins++
      }
    })

    const ratio = gameStats.length > 0 ? totalWins / gameStats.length : 0

    return {
      id:'0',
      username: user.username,
      avatarUrl: user.avatarUrl,
      ratio: Number(ratio.toFixed(2)),
    }
  }

  //**************************************************//
  //  SUBSCRIPTION
  //**************************************************//
}
