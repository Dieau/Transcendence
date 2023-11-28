import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { PubSub } from 'graphql-subscriptions'

@Injectable()
export class UserPresencesService {
  constructor(private prisma: PrismaService, private readonly pubSub: PubSub) {}
  //**************************************************//
  //  MUTATION
  //**************************************************//

  async create(data: Prisma.UserPresenceUncheckedCreateInput) {
    return await this.prisma.userPresence.create({ data })
  }

  async update(userId: string, data: Prisma.UserPresenceUncheckedUpdateInput) {
    await this.prisma.userPresence.findFirst({ where: { userId } })
    return await this.prisma.userPresence.update({
      where: { userId },
      data,
    })
  }

  async delete(id: string) {
    return await this.prisma.userPresence.delete({ where: { id } })
  }

  //**************************************************//
  //  QUERY
  //**************************************************//

  async findAll() {
    return await this.prisma.userPresence.findMany({})
  }

  async findOne(id: string) {
    return await this.prisma.userPresence.findFirst({ where: { id } })
  }

  async getUserPresence(userId: string) {
    return await this.prisma.userPresence.findFirst({ where: { userId } })
  }
}
