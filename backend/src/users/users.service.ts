import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  //**************************************************//
  //  MUTATION
  //**************************************************//

  async create(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({ data })
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({ where: { id }, data })
  }

  async delete(id: string) {
    return await this.prisma.user.delete({ where: { id } })
  }

  async deleteAll() {
    return await this.prisma.user.deleteMany({})
  }

  //**************************************************//
  //  QUERY
  //**************************************************//

  async findOne(id: string) {
    if (id) {
      const usr = await this.prisma.user.findUnique({
        where: { id },
        include: {
          gameStats: true,
          relationFollowings: true,
        },
      })
      if (usr) {
        return usr
      }
    }
    return null
  }

  async findAll(args: Prisma.UserFindManyArgs) {
    return await this.prisma.user.findMany(args)
  }

  async findOneByExternalOAuthId(id: string) {
    return await this.prisma.user.findUnique({ where: { id } })
  }

  async findOneByUsername(username: string) {
    return await this.prisma.user.findUnique({ where: { username } })
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } })
  }

  async findAllUsersSorted() {
    return await this.prisma.user.findMany({})
  }

  async findSortedLeaderBoardList() {
    const allGameStats = await this.prisma.gameStat.findMany()
    interface UserStats {
      points: number
      wins: number
      losses: number
    }
    const userStats: Record<string, UserStats> = {}

    allGameStats.forEach((stat) => {
      if (!userStats[stat.userId]) {
        userStats[stat.userId] = { points: 0, wins: 0, losses: 0 }
      }
      if (stat.isWinner) {
        userStats[stat.userId].points += 3 // win
        userStats[stat.userId].wins += 1
      } else if (stat.userScore === stat.opponentScore) {
        userStats[stat.userId].points += 1 // equality
      } else {
        userStats[stat.userId].points -= 2 // defeat
        userStats[stat.userId].losses += 1
      }
    })

    const sortedStats = Object.entries(userStats)
      .map(([userId, stats]) => ({ userId, ...stats }))
      .sort((a, b) => b.points - a.points)

    const sortedUsers = await Promise.all(
      sortedStats.map(async (stat) => {
        const user = await this.prisma.user.findUnique({
          where: { id: stat.userId },
        })
        const winrate =
          stat.losses === 0 ? 1 : stat.wins / (stat.wins + stat.losses)
        return {
          ...user,
          ratio: stat.points,
          winrate: (winrate * 100).toFixed(0),
        }
      }),
    )

    return sortedUsers
  }

  async FindUserLeaderBoardPosition(userId: string) {
    const sortedUsers = await this.findSortedLeaderBoardList()
    for (let i = 0; i < sortedUsers.length; i++) {
      if (sortedUsers[i].id === userId) {
        return i
      }
    }
    return null
  }

  async checkPseudo(username: string) {
    const found = await this.prisma.user.findFirst({ where: { username } })
    return found === null
  }
}
