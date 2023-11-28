import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { GameMember } from '@prisma/client'

@Injectable()
export class GameMembersService {
  constructor(private prisma: PrismaService) { }
  //**************************************************//
  //  MUTATION
  //**************************************************//

  async create(data: Prisma.GameMemberUncheckedCreateInput) {
    return await this.prisma.gameMember.create({ data })
  }

  async update(
    gameId: string,
    userId: string,
    data: Prisma.GameMemberUncheckedUpdateInput,
  ) {
    return await this.prisma.gameMember.update({
      where: {
        gameId_userId: {
          gameId,
          userId,
        },
      },
      data,
    })
  }

  async delete(gameId: string, userId: string) {
    return await this.prisma.gameMember.delete({
      where: { gameId_userId: { gameId, userId } },
    })
  }
  //**************************************************//
  //  QUERY
  //**************************************************//

  async findAllForGame(gameId: string) {
    return await this.prisma.gameMember.findMany({ where: { gameId } })
  }

  async findOne(
    gameId_userId: Prisma.GameMemberGameIdUserIdCompoundUniqueInput,
  ) {
    return await this.prisma.gameMember.findUnique({
      where: { gameId_userId },
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

  async findOtherPlayerInGame(userId: string): Promise<GameMember | null> {
    const userGameMember = await this.prisma.gameMember.findFirst({
      where: { userId },
      include: { game: true },
    })
    if (!userGameMember || !userGameMember.game) {
      throw new Error(`Game or GameMember not found`)
    }
    const otherGameMember = await this.prisma.gameMember.findFirst({
      where: {
        gameId: userGameMember.gameId,
        userId: { not: userId },
      },
    })

    return otherGameMember || null
  }
}
