import {
  Mutation,
  Query,
  Resolver,
  Subscription,
  ResolveField,
  Parent,
  Args,
} from '@nestjs/graphql'
import { GameMatchmakingMembersService } from './game-matchmaking-members.service'
import { GamesService } from 'src/games/games.service'
import { GameMatchmakingMember } from './entities/game-matchmaking-member.entity'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { UseGuards, BadRequestException } from '@nestjs/common'
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator'
import { User } from '@prisma/client'
import { PubSub } from 'graphql-subscriptions'
import { UserPublicGameInfos } from 'src/users/entities/user.entity'

@Resolver(() => GameMatchmakingMember)
export class GameMatchmakingMembersResolver {
  constructor(
    private readonly gameMatchmakingMembersService: GameMatchmakingMembersService,
    private readonly pubSub: PubSub,
    private readonly gameService: GamesService,
  ) {}

  //**************************************************//
  //  MUTATION
  //**************************************************//

  @Mutation(() => GameMatchmakingMember)
  @UseGuards(GqlAuthGuard)
  async joinGameMatchmakingMember(
    @CtxUser() user: User,
    @Args(`message`, { nullable: true }) message?: string,
    @Args(`userTargetId`, { nullable: true }) userTargetId?: string,
  ) {
    const activeGame = await this.gameService.findGameByUserId(user.id)
    if (activeGame) {
      throw new BadRequestException(`you're already in game`)
    }
    const newMember = await this.gameMatchmakingMembersService.create({
      userId: user.id,
      targetUserId: userTargetId,
      message: message,
    })
    return newMember
  }

  @Mutation(() => GameMatchmakingMember)
  @UseGuards(GqlAuthGuard)
  async leaveGameMatchmakingMember(@CtxUser() user: User) {
    const todelete = await this.gameMatchmakingMembersService.findOne(user.id)
    if (todelete) {
      todelete.isDeleted = true
      await this.gameMatchmakingMembersService.delete(user.id)
    } else {
      throw new BadRequestException(`You're not looking for a game`)
    }
    return todelete
  }

  @Mutation(() => GameMatchmakingMember)
  @UseGuards(GqlAuthGuard)
  async refuseMatchMakingInvite(
    @CtxUser() user: User,
    @Args(`matchMakerId`) matchMakerId: string,
  ) {
    const matchmaker = await this.gameMatchmakingMembersService.findOne(
      matchMakerId,
    )
    if (!matchmaker) {
      throw new BadRequestException(`this player left matchmaking`)
    }
    if (matchmaker && matchmaker.targetUserId != user.id) {
      throw new BadRequestException(`you're not invited to this game`)
    }
    if (matchmaker) {
      await this.gameMatchmakingMembersService.delete(matchmaker.userId)
    } else {
      throw new BadRequestException(`this game did not existed`)
    }
    return matchmaker
  }

  //**************************************************//
  //  QUERY
  //**************************************************//

  @Query(() => [GameMatchmakingMember])
  @UseGuards(GqlAuthGuard)
  async findAllGameMatchmakingMemberl() {
    return await this.gameMatchmakingMembersService.findAll()
  }

  //**************************************************//
  //  SUBSCRIPTION
  //**************************************************//

  @Subscription(() => GameMatchmakingMember)
  matchmakingMembersChanged() {
    return this.pubSub.asyncIterator(`matchmakingMembersChanged`)
  }

  @ResolveField(`userGameInfos`, () => UserPublicGameInfos)
  async userGameInfos(
    @Parent() GameMatchmakingMember: GameMatchmakingMember,
  ): Promise<UserPublicGameInfos> {
    if (!GameMatchmakingMember.isDeleted) {
      const { user } = await this.gameMatchmakingMembersService.findOne(
        GameMatchmakingMember.userId,
      )
      if (user) {
        const gameStats = user.gameStats
        let totalWins = 0

        gameStats.forEach((stats) => {
          if (stats.isWinner) {
            totalWins++
          }
        })

        const ratio = gameStats.length > 0 ? totalWins / gameStats.length : 0

        return {
          id: `0`,
          username: user.username,
          avatarUrl: user.avatarUrl,
          ratio: Number(ratio.toFixed(2)),
        }
      }
    }
    return {
      id: `0`,
      username: `deleted`,
      avatarUrl: `https://https://img-4.linternaute.com/q_N1jQGmO8sUI6v2LOGFcRrXqpE=/1500x/smart/08e82cbcdf5a42c8b79808bc6b15792a/ccmcms-linternaute/48672760.jpg`,
      ratio: 0,
    }
  }
}
