import { Injectable } from '@nestjs/common'
import { EChannelMemberType, EChannelType, Prisma } from '@prisma/client'
import { compare } from 'bcrypt'
import { AuthHelper } from 'src/auth/auth.helper'
import { PrismaService } from 'src/prisma/prisma.service'

const SALT_OR_ROUNDS = 10

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}
  //**************************************************//
  //  MUTATION
  //**************************************************//

  async create(data: Prisma.ChannelCreateInput) {
    if (
      data.channelType === EChannelType.Protected &&
      data.password !== undefined
    )
      data.password = await AuthHelper.hashChannel(data.password)
    return await this.prisma.channel.create({ data })
  }

  async update(id: string, password: string, data: Prisma.ChannelUpdateInput) {
    if (data.channelType === EChannelType.Protected && password !== undefined)
      data.password = await AuthHelper.hashChannel(password)
    return await this.prisma.channel.update({ where: { id }, data })
  }

  async delete(id: string) {
    return await this.prisma.channel.delete({ where: { id } })
  }

  //**************************************************//
  //  QUERY
  //**************************************************//

  async findAll() {
    return await this.prisma.channel.findMany({})
  }

  async findAllForUser(userId: string) {
    const channels = await this.prisma.channel.findMany({
      where: {
        channelMembers: {
          some: {
            userId: {
              equals: userId,
            },
            NOT: {
              type: EChannelMemberType.Banned,
            },
          },
        },
      },
      include: {
        channelMembers: { include: { user: true } },
      },
    })
    channels.forEach((channel) => {
      if (channel.channelType === EChannelType.Direct) {
        const otherMember = channel.channelMembers
          .filter((member) => member.userId !== userId)
          .pop()
        channel.name = otherMember.user.username
        channel.avatarUrl = otherMember.user.avatarUrl
      }
    })
    return channels
  }

  async findAllVisible() {
    return await this.prisma.channel.findMany({
      where: {
        NOT: {
          channelType: EChannelType.Private,
        },
        AND: { NOT: { channelType: EChannelType.Direct } },
      },
      include: {
        channelMembers: { include: { user: true } },
      },
    })
  }

  async findOne(id: string, userId: string) {
    const channel = await this.prisma.channel.findFirst({
      where: { id },
      include: {
        channelMembers: { include: { user: true } },
        channelMessages: true,
      },
    })
    if (channel.channelType === EChannelType.Direct) {
      const otherMember = channel.channelMembers
        .filter((member) => member.userId !== userId)
        .pop()
      channel.name = otherMember.user.username
      channel.avatarUrl = otherMember.user.avatarUrl
    }
    return channel
  }

  async checkChannelName(name: string) {
    const found = await this.prisma.channel.findFirst({ where: { name } })
    return found !== null
  }

  //**************************************************//
  //  SUBSCRIPTION
  //**************************************************//

  //**************************************************//
  //  UTILS
  //**************************************************//
  async verifyChannelPassword(channelId: string, password: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
    })
    if (channel.channelType !== EChannelType.Protected) return false
    return !(await compare(password, channel.password))
  }

  async findDirectChannelForUsers(userId: string, otherUserId: string) {
    const channel = await this.prisma.channel.findFirst({
      where: {
        channelType: EChannelType.Direct,
        channelMembers: { some: { userId: userId } },
        AND: { channelMembers: { some: { userId: otherUserId } } },
      },
      include: { channelMembers: { include: { user: true } } },
    })
    if (channel !== null && channel.channelType === EChannelType.Direct) {
      const otherMember = channel.channelMembers
        .filter((member) => member.userId !== userId)
        .pop()
      channel.name = otherMember.user.username
      channel.avatarUrl = otherMember.user.avatarUrl
    }
    return channel
  }
}
