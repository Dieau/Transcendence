import { BadRequestException, UseGuards } from '@nestjs/common'
import { GameData } from './entities/game-data.entity'
import { Resolver, Mutation, Args, Query, Subscription } from '@nestjs/graphql'
import { GamesService } from './games.service'
import { UsersService } from '../users/users.service'
import { UserPresencesService } from 'src/user-presences/user-presences.service'
import { GameMembersService } from 'src/game-members/game-members.service'
import { Game } from './entities/game.entity'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { User } from 'src/users/entities/user.entity'
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator'
import * as DTO from './dto/game.input'
import { GameStat } from './entities/gameStat.entity'
import { PubSub } from 'graphql-subscriptions'
import { EUserPresenceStatus } from '@prisma/client'

@Resolver(() => Game)
export class GamesResolver {
  constructor(
    private readonly gamesService: GamesService,
    private readonly gameMemberService: GameMembersService,
    private readonly userService: UsersService,
    private readonly pubSub: PubSub,
    private readonly userPresenceService: UserPresencesService,
  ) {}

  //**************************************************//
  //  MUTATION
  //**************************************************//

  @Mutation(() => GameData)
  @UseGuards(GqlAuthGuard)
  createGame(
    @CtxUser() user: User,
    @Args(`message`, { nullable: true }) message?: string,
    @Args(`userTargetId`, { nullable: true }) userTargetId?: string,
  ) {
    return this.gamesService.create({
      message: message,
      targetUserId: userTargetId,
      gameMembers: {
        create: {
          userId: user.id,
        },
      },
    })
  }

  @Mutation(() => GameData)
  @UseGuards(GqlAuthGuard)
  updateGame(@CtxUser() user: User, @Args(`args`) args: DTO.UpdateGameInput) {
    return this.gamesService.update(args.id, args)
  }

  @Mutation(() => Game)
  @UseGuards(GqlAuthGuard)
  async deleteGame(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.DeleteGameInput,
  ) {
    return await this.gamesService.delete(args.id)
  }

  @Mutation(() => Game)
  @UseGuards(GqlAuthGuard)
  joinGame(@CtxUser() user: User, @Args(`args`) args: DTO.JoinGameInput) {
    return this.gamesService.playerJoin(args.id, user)
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async leaveGame(@CtxUser() user: User) {
    const userGame = await this.gamesService.findGameByUserId(user.id)
    if (!userGame) {
      return true
    }
    await this.gamesService.endGameOnFailure(userGame.id, user.id)
    return true
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async refusePrivateGameInvitation(
    @CtxUser() user: User,
    @Args(`gameId`) gameId: string,
  ) {
    const game = await this.gamesService.findOne(gameId)
    if (!game) {
      throw new BadRequestException(`this game does not exists`)
    }
    if (game && game.targetUserId != user.id) {
      throw new BadRequestException(`you're not invited to this game`)
    } else {
      this.gamesService.endGameOnFailure(gameId)
    }
    return true
  }
  //**************************************************//
  //  QUERY
  //**************************************************//

  @Query(() => [GameStat])
  @UseGuards(GqlAuthGuard)
  async findAllGameStatsSoftLimit() {
    const gameStats = await this.gamesService.findManyGameStatsSoftLimit(20)
    return gameStats
  }

  @Query(() => [Game])
  @UseGuards(GqlAuthGuard)
  async findAllGames() {
    return await this.gamesService.findAll()
  }

  @Query(() => Game)
  @UseGuards(GqlAuthGuard)
  async findGame(gameId) {
    return await this.gamesService.findOne(gameId)
  }

  @Query(() => Game, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async getUserGameBeforeStart(@CtxUser() user: User) {
    const game = await this.gamesService.findGameByUserId(user.id)
    if (game) {
      const presence = await this.userPresenceService.getUserPresence(user.id)
      if (presence && presence.connected != EUserPresenceStatus.InGame) {
        return game
      }
    }
    return null
  }
  //**************************************************//
  //  SUBSCRIPTION
  //**************************************************//

  @Subscription(() => GameStat, { nullable: true })
  allGamesStatsUpdated() {
    const res = this.pubSub.asyncIterator(`allGamestatsUpdated`)
    return res
  }

  @Subscription(() => Game, { nullable: true })
  allGamesUpdated() {
    const res = this.pubSub.asyncIterator(`allGamesUpdated`)
    return res
  }

  @Subscription(() => Game, {
    filter: (payload, variables) => {
      return payload.UserGameUpdated.userId === variables.userId
    },
  })
  UserGameUpdated(@Args(`userId`) userId: string) {
    return this.pubSub.asyncIterator(`UserGameUpdated:${userId}`)
  }

  @Subscription(() => GameStat, {
    filter: (payload, variables) => payload.userId === variables.userId,
  })
  allGamesStatsUpdatedForUser(@Args(`userId`) userId: string) {
    const res = this.pubSub.asyncIterator(`userGamesStats:${userId}`)
    return res
  }
}
