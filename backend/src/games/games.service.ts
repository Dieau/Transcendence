import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { User } from 'src/users/entities/user.entity'
import { GameData, PlayerData } from './entities/game-data.entity'
import { Game } from './entities/game.entity'
import { GameStat, Prisma, EUserPresenceStatus } from '@prisma/client'
import { PubSub } from 'graphql-subscriptions'
import { randomInt } from 'crypto'
import { GameMembersService } from 'src/game-members/game-members.service'
import { UserPresencesService } from 'src/user-presences/user-presences.service'

@Injectable()
export class GamesService {
  constructor(
    private prisma: PrismaService,
    private readonly pubSub: PubSub,
    private readonly gameMembersService: GameMembersService,
    private readonly userPresenceService: UserPresencesService
  ) { }

  //**************************************************//
  //  GAME DATA
  //**************************************************//

  private gamesData = new Map<string, GameData>()

  playerUpdate(gameId: string, user: User, data: Partial<PlayerData>) {
    return this.findGameData(gameId).updatePlayer(user, data)
  }

  findGameData(gameId: string) {
    if (!this.gamesData.has(gameId)) {
      throw new BadRequestException(`Cannot find gameData with ${gameId}`)
    }
    return this.gamesData.get(gameId)
  }

  updateGameData(game: Game) {
    return this.findGameData(game.id).update(game)
  }

  createGameData(game: Game) {
    if (this.gamesData.has(game.id)) {
      throw new BadRequestException(`Cannot create gameData with ${game.id}`)
    }
    const gameData = new GameData(game)
    this.gamesData.set(game.id, gameData)
    return gameData
  }

  deleteGameData(game: Game) {
    if (!this.gamesData.has(game.id)) {
      throw new BadRequestException(`Cannot delete gameData with ${game.id}`)
    }
    return this.gamesData.delete(game.id)
  }

  //**************************************************//
  //  MUTATION
  //**************************************************//

  async create(data: Prisma.GameCreateInput) {
    const newGame = await this.prisma.game.create({
      data,
      include: { gameMembers: true },
    })
    if (newGame) {
      const player1 = newGame.gameMembers.at(0)
      const player2 = newGame.gameMembers.at(1)
      if (player1) {
        await this.pubSub.publish(`UserGameUpdated:${player1.userId}`, {
          UserGameUpdated: {
            ...newGame,
            userId: player1.userId,
          },
        })
      }
      if (player2) {
        await this.pubSub.publish(`UserGameUpdated:${player2.userId}`, {
          UserGameUpdated: {
            ...newGame,
            userId: player2.userId,
          },
        })
      }
      await this.pubSub.publish(`allGamesUpdated`, {
        allGamesUpdated: newGame,
      })
      return newGame
    }
    throw new BadRequestException(`you cant create a game at ths moment`)
  }

  async update(id: string, data: Prisma.GameUpdateInput) {
    const game = await this.prisma.game.update({ where: { id }, data })
    this.pubSub.publish(`allGamesUpdated`, {
      allGamesUpdated: game,
    })
    return this.updateGameData(game)
  }

  async delete(id: string) {
    const verifier = await this.prisma.game.findUnique({
      where: {
        id: id,
      },
      include: {
        gameMembers: true,
      },
    })
    if (verifier) {
      const game = await this.prisma.game.delete({ where: { id } })
      game.isDeleted = true
      await this.pubSub.publish(`allGamesUpdated`, {
        allGamesUpdated: { ...game },
      })
      return game
    }
    return
  }

  async updateGameScore(
    gameId: string,
    scorePlayer1: number,
    scorePlayer2: number,
    idPlayer1: string,
    idPlayer2: string,
  ) {
    const game = await this.findOne(gameId)
    const gameMembers = await this.gameMembersService.findAllForGame(gameId)
    if (game && gameMembers && gameMembers.length == 2) {
      const player1 = gameMembers.find((member) => member.userId == idPlayer1)
      const player2 = gameMembers.find((member) => member.userId == idPlayer2)
      if (player1) {
        await this.gameMembersService.update(gameId, idPlayer1, {
          score: scorePlayer1,
        })
      }
      if (player2) {
        await this.gameMembersService.update(gameId, idPlayer2, {
          score: scorePlayer2,
        })
      }
      await this.pubSub.publish(`allGamesUpdated`, {
        allGamesUpdated: { ...game },
      })
    }
  }

  async createGameStat(data: Prisma.GameStatUncheckedCreateInput) {
    const gameStat = await this.prisma.gameStat.create({ data })
    this.pubSub.publish(`allGamestatsUpdated`, {
      allGamesStatsUpdated: gameStat,
    })
    this.pubSub.publish(`userGamesStats: ${gameStat.userId}`, {
      allGamesStatsUpdatedForUser: gameStat,
    })

    return gameStat
  }

  async deleteGameStat(userId: string, id: string) {
    const gameStat = await this.prisma.gameStat.findUnique({
      where: { id_userId: { id, userId } },
    })
    await this.prisma.gameStat.delete({
      where: { id_userId: { id, userId } },
    })
    this.pubSub.publish(`allGamestatsUpdated`, {
      allGamesStatsUpdated: { ...gameStat, isDeleted: true },
    })
    this.pubSub.publish(`userGamesStats: ${userId}`, {
      allGamesStatsUpdatedForUser: { ...gameStat, isDeleted: true },
    })
    return gameStat
  }

  async updateGameStat(
    id: string,
    userId: string,
    data: Prisma.GameStatUncheckedUpdateInput,
  ) {
    return await this.prisma.gameStat.update({
      where: { id_userId: { id, userId } },
      data,
    })
  }

  async playerJoin(gameId: string, user: User) {
    const existingMembers = await this.prisma.gameMember.count({
      where: { gameId: gameId },
    })
    if (existingMembers >= 2) {
      throw new BadRequestException(
        `This game already has the maximum number of players.`,
      )
    }
    const existingUser = await this.prisma.gameMember.findUnique({
      where: {
        gameId_userId: {
          gameId: gameId,
          userId: user.id,
        },
      },
    })
    if (existingUser) {
      throw new BadRequestException(`This user has already joined the game.`)
    }
    await this.prisma.gameMember.create({
      data: {
        gameId: gameId,
        userId: user.id,
      },
    })
    const game = await this.prisma.game.findFirst({
      where: { id: gameId },
      include: {
        gameMembers: true,
      },
    })
    this.pubSub.publish(`allGamesUpdated`, {
      allGamesUpdated: game,
    })
    return game
  }

  async playerLeave(gameId: string, user: User) {
    const memberToDelete = await this.prisma.gameMember.findUnique({
      where: {
        gameId_userId: {
          gameId: gameId,
          userId: user.id,
        },
      },
    })

    if (!memberToDelete) {
      throw new BadRequestException(`This user is not part of the game.`)
    }

    await this.prisma.gameMember.delete({
      where: {
        gameId_userId: {
          gameId: gameId,
          userId: user.id,
        },
      },
    })
    const remainingMembers = await this.prisma.gameMember.count({
      where: { gameId: gameId },
    })

    if (remainingMembers === 0) {
      await this.delete(gameId)
    } else {
      const updatedGame = this.prisma.game.findFirst({
        where: { id: gameId },
        include: {
          gameMembers: true,
        },
      })
      this.pubSub.publish(`allGamesUpdated`, {
        allGamesUpdated: updatedGame,
      })
    }

    return memberToDelete
  }

  async endGameOnFailure(gameId: string, requesterUserId?: string) {
    const game = await this.prisma.game.findUnique({
      where: {
        id: gameId,
      },
      include: {
        gameMembers: true,
      },
    })
    if (game) {
      const gameMembers = game.gameMembers
      game.isDeleted = true
      if (gameMembers && gameMembers.length) {
        if (gameMembers.at(0)) {
          const presence = await this.userPresenceService.getUserPresence(gameMembers.at(0).userId)
          if (presence && presence.connected === EUserPresenceStatus.InGame)
          {
            await this.userPresenceService.update(gameMembers.at(0).userId, { connected : EUserPresenceStatus.Offline })
          }
        }
        if (gameMembers.at(1)) {
          const presence = await this.userPresenceService.getUserPresence(gameMembers.at(1).userId)
          if (presence && presence.connected === EUserPresenceStatus.InGame)
          {
            await this.userPresenceService.update(gameMembers.at(1).userId, { connected : EUserPresenceStatus.Offline})
          }
        }
        if (
          requesterUserId &&
          gameMembers.find(
            (gameMember) => gameMember.userId === requesterUserId,
          )
        ) {
          const otherPlayer =
            await this.gameMembersService.findOtherPlayerInGame(requesterUserId)
          if (otherPlayer) {
            await this.pubSub.publish(`UserGameUpdated:${otherPlayer.userId}`, {
              UserGameUpdated: {
                ...game,
                userId: otherPlayer.userId,
              },
            })
          }
        } else {
          for (const gameMember of gameMembers) {
            await this.pubSub.publish(`UserGameUpdated:${gameMember.userId}`, {
              UserGameUpdated: {
                ...game,
                userId: gameMember.userId,
              },
            })
          }
        }
      }
      return await this.delete(game.id)
    }
  }

  async endGameOnSuccess(
    gameId: string,
    scorePlayer1: number,
    scorePlayer2: number,
    idPlayer1?: string,
    idPlayer2?: string,
  ) {
    const verifier = await this.prisma.game.findFirst({
      where: {
        id: gameId,
      },
    })
    if (verifier) {
      let gameStatForPlayer1: GameStat
      let gameStatForPlayer2: GameStat
      const gameMembers = await this.gameMembersService.findAllForGame(gameId)
      if (gameMembers) {
        if (gameMembers.at(0)) {
          const presence = await this.userPresenceService.getUserPresence(gameMembers.at(0).userId)
          if (presence && presence.connected === EUserPresenceStatus.InGame)
          {
            await this.userPresenceService.update(gameMembers.at(0).userId, { connected : EUserPresenceStatus.Offline })
          }
        }
        if (gameMembers.at(1)) {
          const presence = await this.userPresenceService.getUserPresence(gameMembers.at(1).userId)
          if (presence && presence.connected === EUserPresenceStatus.InGame)
          {
            await this.userPresenceService.update(gameMembers.at(1).userId, { connected : EUserPresenceStatus.Offline })
          }
        }
      }
      const game = await this.prisma.game.delete({
        where: {
          id: gameId,
        },
        include: {
          gameMembers: true,
        },
      })
      game.isDeleted = true
      this.pubSub.publish(`allGamesUpdated`, {
        allGamesUpdated: game,
      })
      if (!game.targetUserId) {
        if (gameMembers && gameMembers.length == 2) {
          if (idPlayer1 && idPlayer2) {
            if (gameMembers.find((member) => member.userId === idPlayer1)) {
              gameStatForPlayer1 = await this.createGameStat({
                userId: idPlayer1,
                opponentId: idPlayer2,
                isWinner: scorePlayer1 >= scorePlayer2,
                userScore: scorePlayer1.toString(),
                opponentScore: scorePlayer2.toString(),
                isFakeData: false,
              })
            }
            if (gameMembers.find((member) => member.userId === idPlayer2)) {
              gameStatForPlayer2 = await this.createGameStat({
                userId: idPlayer2,
                opponentId: idPlayer1,
                isWinner: scorePlayer1 <= scorePlayer2,
                userScore: scorePlayer2.toString(),
                opponentScore: scorePlayer1.toString(),
                isFakeData: false,
              })
            }
          } else {
            const isWinner = scorePlayer1 >= scorePlayer2 ? true : false
            gameStatForPlayer1 = await this.createGameStat({
              userId: game.gameMembers[0].userId,
              opponentId: game.gameMembers[1].userId,
              isWinner: isWinner,
              userScore: scorePlayer1.toString(),
              opponentScore: scorePlayer2.toString(),
              isFakeData: false,
            })
            gameStatForPlayer2 = await this.createGameStat({
              userId: game.gameMembers[1].userId,
              opponentId: game.gameMembers[0].userId,
              isWinner: !isWinner,
              userScore: scorePlayer2.toString(),
              opponentScore: scorePlayer1.toString(),
              isFakeData: false,
            })
          }
        }
        if (!gameStatForPlayer1 || !gameStatForPlayer2) {
          throw new BadRequestException(`can't create gameStats !`)
        }
        return gameStatForPlayer1
      }

      const resGame = await this.prisma.game.findFirst({
        where: {
          id: gameId,
        },
      })

      if (resGame) {
        throw new BadRequestException(`can't delete game !`)
      }
    }
    return null
  }

  async killAll() {
    const games = await this.prisma.game.findMany()
    await Promise.all(games.map((game) => this.endGameOnFailure(game.id)))
    return games
  }

  //**************************************************//
  //  QUERY
  //**************************************************//

  async findAll() {
    return await this.prisma.game.findMany({
      include: {
        gameMembers: true,
      },
    })
  }

  async findManyGameStatsSoftLimit(limit: number) {
    let allStats = await this.prisma.gameStat.findMany({
      orderBy: {
        createdAt: `desc`,
      },
    })

    for (let i = allStats.length - 1; i >= 0; i--) {
      const stat = allStats[i]

      const similarTimestampEntry = allStats.find(
        (otherStat, otherIndex) =>
          otherIndex > i &&
          otherStat.userId === stat.opponentId &&
          otherStat.opponentId === stat.userId &&
          Math.abs(otherStat.createdAt.getTime() - stat.createdAt.getTime()) <
          5000,
      )

      if (similarTimestampEntry) {
        const rand = randomInt(0, 2)

        if (rand) {
          allStats.splice(i, 1)
        } else {
          const indexToRemove = allStats.findIndex(
            (entry) => entry.id === similarTimestampEntry.id,
          )
          if (indexToRemove !== -1) {
            allStats.splice(indexToRemove, 1)
          }
        }
      }
    }
    allStats = allStats.slice(0, limit)

    return allStats
  }

  async findOne(id: string) {
    return await this.prisma.game.findUnique({
      include: {
        gameMembers: true,
      },
      where: { id: id },
    })
  }

  async findGameByUserId(userId: string): Promise<Game | null> {
    const gameMember = await this.prisma.gameMember.findFirst({
      where: {
        userId: userId,
      },
      include: {
        game: true,
      },
    })

    return gameMember?.game || null
  }
}
