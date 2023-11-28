import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { GamesService } from 'src/games/games.service'
import { PubSub } from 'graphql-subscriptions'

@Injectable()
export class GameMatchmakingMembersService {
  constructor(
    private prisma: PrismaService,
    private readonly gameService: GamesService,
    private readonly pubSub: PubSub,
  ) { }
  //**************************************************//
  //  MUTATION
  //**************************************************//

  async create(data: Prisma.GameMatchmakingMemberUncheckedCreateInput) {
    const alreadyPresent = await this.prisma.gameMatchmakingMember.findFirst({
      where: { userId: data.userId },
    })

    if (alreadyPresent) {
      await this.delete(alreadyPresent.userId)
    }
    const newMatchmakingMember = await this.prisma.gameMatchmakingMember.create(
      {
        data,
      },
    )
    let opponentSearchCriteria
    if (data.targetUserId) {
      opponentSearchCriteria = { userId: data.targetUserId, isDeleted: false }
    } else {
      opponentSearchCriteria = {
        targetUserId: null,
        isDeleted: false,
        userId: { not: data.userId },
      }
    }
    const opponent = await this.prisma.gameMatchmakingMember.findFirst({
      where: opponentSearchCriteria,
    })
    let createGameData: Prisma.GameCreateInput
    if (opponent) {
      if (!data.targetUserId) {
        createGameData = {
          gameMembers: {
            create: [{ userId: data.userId }, { userId: opponent.userId }],
          },
        }
      } else {
        createGameData = {
          gameMembers: {
            create: [{ userId: data.userId }, { userId: opponent.userId }],
          },
          targetUserId: data.targetUserId,
        }
      }
      const newGame = await this.gameService.create(createGameData)
      if (newGame) {
        const ret = await this.delete(data.userId)
        await this.delete(opponent.userId)
        return ret
      } else {
        await this.delete(data.userId)
        throw new BadRequestException(
          `you cant join matchmaking at this moment`,
        )
      }
    } else {
      await this.pubSub.publish(`matchmakingMembersChanged`, {
        matchmakingMembersChanged: newMatchmakingMember,
      })
      return newMatchmakingMember
    }
  }

  async delete(userId: string) {
    const ret = await this.prisma.gameMatchmakingMember.findUnique({
      where: { userId: userId },
    })
    if (ret) {
      ret.isDeleted = true
      await this.prisma.gameMatchmakingMember.delete({
        where: { userId: userId },
      })
      await this.pubSub.publish(`matchmakingMembersChanged`, {
        matchmakingMembersChanged: ret,
      })
      return ret
    }
  }

  //**************************************************//
  //  QUERY
  //**************************************************//

  async findAll() {
    return await this.prisma.gameMatchmakingMember.findMany({})
  }

  async findOne(userId: string) {
    return await this.prisma.gameMatchmakingMember.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
            gameStats: true,
          },
        },
      },
    })
  }
}
