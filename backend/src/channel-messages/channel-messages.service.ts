import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ChannelMessagesService {
  constructor(private prisma: PrismaService) {}
  //**************************************************//
  //  MUTATION
  //**************************************************//

  async create(data: Prisma.ChannelMessageUncheckedCreateInput) {
    return await this.prisma.channelMessage.create({
      data,
    })
  }

  async update(
    id: string,
    userId: string,
    data: Prisma.ChannelMessageUncheckedUpdateInput,
  ) {
    return await this.prisma.channelMessage.update({
      where: {
        id_userId: {
          id,
          userId,
        },
      },
      data,
    })
  }

  async delete(id: string, userId: string) {
    return await this.prisma.channelMessage.delete({
      where: {
        id_userId: {
          id,
          userId,
        },
      },
    })
  }

  //**************************************************//
  //  QUERY
  //**************************************************//

  async findAll() {
    return await this.prisma.channelMessage.findMany({})
  }

  async findOne(id: string, userId: string) {
    return await this.prisma.channelMessage.findUnique({
      where: {
        id_userId: {
          id,
          userId,
        },
      },
    })
  }

  async findAllForChannel(channelId: string) {
    return await this.prisma.channelMessage.findMany({ where: { channelId } })
  }

  async findUserForChannelMessage(id: string) {
    return await this.prisma.channelMessage.findFirst({
      where: { id },
      include: { user: true },
    })
  }
}
