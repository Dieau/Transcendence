import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { EChannelMemberType, Prisma } from '@prisma/client'

@Injectable()
export class ChannelMembersService {
  constructor(private prisma: PrismaService) {}

  //**************************************************//
  //  MUTATION
  //**************************************************//

  async create(data: Prisma.ChannelMemberUncheckedCreateInput) {
    return await this.prisma.channelMember.create({
      data,
      include: {
        user: true,
        channel: true,
      },
    })
  }

  async update(
    userId: string,
    channelId: string,
    data: Prisma.ChannelMemberUncheckedUpdateInput,
  ) {
    return await this.prisma.channelMember.update({
      where: { channelId_userId: { userId, channelId } },
      data,
      include: {
        user: true,
        channel: true,
      },
    })
  }

  async delete(userId: string, channelId: string) {
    return await this.prisma.channelMember.delete({
      where: { channelId_userId: { userId, channelId } },
      include: {
        user: true,
        channel: true,
      },
    })
  }

  //**************************************************//
  //  QUERY
  //**************************************************//

  async findAll(channelId: string) {
    return await this.prisma.channelMember.findMany({
      where: { channelId: channelId },
      include: {
        user: true,
      },
    })
  }

  async findOne(channelId: string, userId: string) {
    return await this.prisma.channelMember.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    })
  }

  async findOldestAdminForChannel(channelId: string) {
    return await this.prisma.channelMember.findFirst({
      where: {
        channelId,
        AND: {
          type: EChannelMemberType.Admin,
        },
      },
      orderBy: { createdAt: `asc` },
    })
  }

  async findOldestMemberForChannel(channelId: string) {
    return await this.prisma.channelMember.findFirst({
      where: {
        channelId,
        AND: {
          type: EChannelMemberType.Default,
        },
      },
      orderBy: { createdAt: `asc` },
    })
  }
}
