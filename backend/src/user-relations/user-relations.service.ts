import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { EUserRelationType } from '@prisma/client'
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions'

@Injectable()
export class UserRelationsService {
  constructor(private prisma: PrismaService) { }
  //**************************************************//
  //  MUTATION
  //**************************************************//

  async createRequestFriend(userOwnerId: string, userTargetId: string) {
    const relationOT = await this.findRelation(userOwnerId, userTargetId)
    const relationTO = await this.findRelation(userTargetId, userOwnerId)

    if (relationTO === EUserRelationType.PendingAccept)
      return await this.acceptPendingRelation(userOwnerId, userTargetId)
    if (relationTO && relationTO === EUserRelationType.Blocked) {
      throw new BadRequestException(
        `this user can't create, or maintain any kind of relationship with you`,
      )
    }
    if (relationOT && relationOT === EUserRelationType.Blocked) {
      throw new BadRequestException(
        `you blocked this user, go to yout profile setting to unblock him`,
      )
    }
    if (relationOT !== undefined || relationTO !== undefined)
      throw new BadRequestException(`you can't add this friend`)

    await this.prisma.userRelation.create({
      data: {
        userOwnerId: userTargetId,
        userTargetId: userOwnerId,
        type: EUserRelationType.WaitingAccept,
      },
    })
    return await this.prisma.userRelation.create({
      data: {
        userOwnerId,
        userTargetId,
        type: EUserRelationType.PendingAccept,
      },
    })
  }

  // only works if the invite is in pending mode, do not work if user is blocked
  async acceptPendingRelation(userOwnerId: string, userTargetId: string) {
    const relationOT = await this.findRelation(userOwnerId, userTargetId)
    const relationTO = await this.findRelation(userTargetId, userOwnerId)

    if (
      relationOT !== EUserRelationType.WaitingAccept &&
      relationTO !== EUserRelationType.PendingAccept
    )
      throw new UnauthorizedException()

    await this.prisma.userRelation.update({
      where: {
        userOwnerId_userTargetId: {
          userTargetId: userOwnerId,
          userOwnerId: userTargetId,
        },
      },
      data: {
        type: EUserRelationType.Friend,
      },
    })
    return await this.prisma.userRelation.update({
      where: {
        userOwnerId_userTargetId: {
          userOwnerId,
          userTargetId,
        },
      },
      data: {
        type: EUserRelationType.Friend,
      },
    })
  }

  async refusePendingRelation(userOwnerId: string, userTargetId: string) {
    const relationOT = await this.findRelation(userOwnerId, userTargetId)
    const relationTO = await this.findRelation(userTargetId, userOwnerId)

    if (
      relationOT !== EUserRelationType.WaitingAccept &&
      relationTO !== EUserRelationType.PendingAccept
    )
      throw new UnauthorizedException()

    return await this.prisma.userRelation.delete({
      where: {
        userOwnerId_userTargetId: { userOwnerId, userTargetId },
      },
    })
  }

  async blockRelation(userOwnerId: string, userTargetId: string) {
    const relationOT = await this.findRelation(userOwnerId, userTargetId)
    const relationTO = await this.findRelation(userTargetId, userOwnerId)

    if (relationOT) {
      await this.prisma.userRelation.delete({
        where: {
          userOwnerId_userTargetId: {
            userOwnerId,
            userTargetId,
          },
        },
      })
    }
    if (relationTO && relationTO != EUserRelationType.Blocked) {
      await this.prisma.userRelation.delete({
        where: {
          userOwnerId_userTargetId: {
            userOwnerId: userTargetId,
            userTargetId: userOwnerId,
          },
        },
      })
    }
    return await this.prisma.userRelation.create({
      data: {
        userOwnerId: userOwnerId,
        userTargetId: userTargetId,
        type: EUserRelationType.Blocked,
      },
    })
  }

  async unblockRelation(userOwnerId: string, userTargetId: string) {
    const relationOT = await this.findRelation(userOwnerId, userTargetId)
    const relationTO = await this.findRelation(userTargetId, userOwnerId)
    let res

    if (relationOT && relationOT === EUserRelationType.Blocked) {
      res = await this.prisma.userRelation.delete({
        where: {
          userOwnerId_userTargetId: {
            userOwnerId,
            userTargetId,
          },
        },
      })
    }
    if (res) {
      return res
    }
    throw new BadRequestException(`this user was not blocked`)
  }

  async removeFriend(userOwnerId: string, userTargetId: string) {
    await this.prisma.userRelation.delete({
      where: {
        userOwnerId_userTargetId: {
          userOwnerId: userTargetId,
          userTargetId: userOwnerId,
        },
      },
    })
    return await this.prisma.userRelation.delete({
      where: {
        userOwnerId_userTargetId: {
          userOwnerId,
          userTargetId,
        },
      },
    })
  }

  //**************************************************//
  //  QUERY
  //**************************************************//

  async findAllForUser(userOwnerId: string) {
    return await this.prisma.userRelation.findMany({
      where: { userOwnerId },
    })
  }

  async findAllFriendsForUser(userOwnerId: string) {
    return await this.prisma.userRelation.findMany({
      where: { userOwnerId, type: EUserRelationType.Friend },
      include: { userTarget: true },
    })
  }

  async findAllBlockedForUser(userOwnerId: string) {
    return await this.prisma.userRelation.findMany({
      where: { userOwnerId, type: EUserRelationType.Blocked },
      include: { userTarget: true },
    })
  }

  async findAllBlockedByForUser(userTargetId: string) {
    return await this.prisma.userRelation.findMany({
      where: { userTargetId, type: EUserRelationType.Blocked },
      include: { userOwner: true },
    })
  }

  async findOne(userOwnerId: string, userTargetId: string) {
    return await this.prisma.userRelation.findUnique({
      where: {
        userOwnerId_userTargetId: {
          userOwnerId: userOwnerId,
          userTargetId,
        },
      },
      include: {
        userTarget: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            gameStats: true,
          },
        },
      },
    })
  }

  async findAll() {
    return await this.prisma.userRelation.findMany({ where: {} })
  }
  //**************************************************//
  //  UTILS
  //**************************************************//

  private async findRelation(
    userAId: string,
    userBId: string,
  ): Promise<EUserRelationType | undefined> {
    const relation = await this.prisma.userRelation.findUnique({
      where: {
        userOwnerId_userTargetId: {
          userOwnerId: userAId,
          userTargetId: userBId,
        },
      },
    })
    return relation?.type
  }
}
