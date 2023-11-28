import { GqlAuthGuard } from './../auth/guards/gql-auth.guard'
import {
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UsersService } from './users.service'
import {
  UserPublic,
  User,
  UserTwoFaSettings,
  GeneralUserGameStats,
  UserPublicGameInfos,
  LeaderBoardUser,
  GameRatio,
} from './entities/user.entity'
import * as DTO from './dto/user.input'
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator'
import { GameStat } from 'src/games/entities/gameStat.entity'
import { AuthHelper } from 'src/auth/auth.helper'

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  //**************************************************//
  //  MUTATION
  //**************************************************//

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateMyUser(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.UpdateMyUserInput,
  ) {
    if (args.username) {
      if (
        user.username != args.username &&
        (await this.usersService.findOneByUsername(args.username))
      )
        throw new UnauthorizedException(`This username is already in use`)
    }
    const usr = await this.usersService.update(user.id, args)
    return usr
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  deleteMyUser(@CtxUser() user: User) {
    return this.usersService.delete(user.id)
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updateMyPassword(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.UpdateMyPasswordInput,
  ) {
    await this.usersService.update(user.id, {
      password: await AuthHelper.hash(args.newPassword),
    })
    return true
  }
  //**************************************************//
  //  QUERY
  //**************************************************//

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  findMyUser(@CtxUser() user: User) {
    return user
  }

  @Query(() => UserPublic)
  @UseGuards(GqlAuthGuard)
  async findUser(@Args(`args`) args: DTO.FindUserInput) {
    const usr = await this.usersService.findOne(args.id)
    if (usr) {
      return usr
    }
    throw new BadRequestException(`this user did not exists`)
  }

  @Query(() => [LeaderBoardUser])
  @UseGuards(GqlAuthGuard)
  async findLeaderboardUserList() {
    return await this.usersService.findSortedLeaderBoardList()
  }

  @Query(() => [UserPublic])
  @UseGuards(GqlAuthGuard)
  async findPublicUsersList() {
    return await this.usersService.findAllUsersSorted()
  }

  @Query(() => UserTwoFaSettings)
  @UseGuards(GqlAuthGuard)
  findUserTwoFaSettings(@CtxUser() user: User) {
    if (!user.isOauth) {
      return user
    } else throw new UnauthorizedException(`user must not be an oauth user`)
  }

  @Query(() => [GameRatio])
  @UseGuards(GqlAuthGuard)
  async findPublicGameRatios(@Args(`userid`) userid: string) {
    const usr = await this.usersService.findOne(userid)
    if (!usr) {
      throw new BadRequestException(`this user does not exists`)
    }
    let cumulativePoints = 0
    const gameStats = (await this.usersService.findOne(userid)).gameStats
    gameStats.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

    const gameRatios = gameStats.map((stat) => {
      const gamePoints = stat.isWinner
        ? 3
        : stat.userScore === stat.opponentScore
        ? 1
        : -2
      cumulativePoints += gamePoints
      return {
        gameStat: stat,
        ratio: cumulativePoints,
        date: new Date(stat.createdAt),
      }
    })
    return gameRatios
  }

  @Query(() => GeneralUserGameStats)
  @UseGuards(GqlAuthGuard)
  async findGeneralGameStatsForUser(@CtxUser() user: User) {
    const gameStats = (await this.usersService.findOne(user.id)).gameStats
    let totalpoints = 0
    let totalwins = 0

    if (gameStats && gameStats.length) {
      gameStats.forEach((stats) => {
        totalpoints += parseInt(stats.userScore)
        if (stats.isWinner) {
          totalwins++
        }
      })
      const leaderBoardPosition =
        await this.usersService.FindUserLeaderBoardPosition(user.id)
      const result: GeneralUserGameStats = {
        gamesCount: gameStats.length,
        allTimeRatio: totalwins / gameStats.length,
        MeanPoints: totalpoints / gameStats.length,
        leaderBoardPosition: leaderBoardPosition + 1,
      }
      return result
    }
    const result: GeneralUserGameStats = {
      gamesCount: 0,
      allTimeRatio: 0,
      MeanPoints: 0,
      leaderBoardPosition: 0,
    }
    return result
  }

  @Query(() => GeneralUserGameStats)
  @UseGuards(GqlAuthGuard)
  async findPublicGeneralGameStatsForUser(@Args(`userid`) userid: string) {
    const usr = await this.usersService.findOne(userid)
    if (!usr) {
      throw new BadRequestException(`this user does not exists`)
    }
    const gameStats = (await this.usersService.findOne(userid)).gameStats
    let totalpoints = 0
    let totalwins = 0

    gameStats.forEach((stats) => {
      totalpoints += parseInt(stats.userScore)
      if (stats.isWinner) {
        totalwins++
      }
    })
    const leaderBoardPosition =
      await this.usersService.FindUserLeaderBoardPosition(userid)
    const result: GeneralUserGameStats = {
      gamesCount: gameStats.length,
      allTimeRatio: totalwins / gameStats.length,
      MeanPoints: totalpoints / gameStats.length,
      leaderBoardPosition: leaderBoardPosition + 1,
    }
    return result
  }

  @Query(() => [GameStat])
  @UseGuards(GqlAuthGuard)
  async findAllGameStatsForUser(@CtxUser() user: User) {
    const gameStats = (await this.usersService.findOne(user.id)).gameStats
    gameStats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    return gameStats
  }

  @Query(() => [GameStat])
  @UseGuards(GqlAuthGuard)
  async findAllPublicGameStatsForUser(@Args(`userid`) userid: string) {
    const usr = await this.usersService.findOne(userid)
    if (!usr) {
      throw new BadRequestException(`this user does not exists`)
    }
    const gameStats = (await this.usersService.findOne(userid)).gameStats
    gameStats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    return gameStats
  }

  @Query(() => UserPublicGameInfos)
  @UseGuards(GqlAuthGuard)
  async findPublicGameInfosForUser(@Args(`userid`) userid: string) {
    const usr = await this.usersService.findOne(userid)
    const gameStats = usr.gameStats
    let totalwins = 0

    gameStats.forEach((stats) => {
      if (stats.isWinner) {
        totalwins++
      }
    })
    let ratio = 0
    if (totalwins / gameStats.length > 0) {
      ratio = totalwins / gameStats.length
    }
    const result: UserPublicGameInfos = {
      id: usr.id,
      ratio: ratio,
      avatarUrl: usr.avatarUrl,
      username: usr.username,
    }
    return result
  }
}

//**************************************************//
//  SUBSCRIPTION
//**************************************************//
