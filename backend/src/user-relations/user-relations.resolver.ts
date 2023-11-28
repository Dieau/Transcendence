import {
  Resolver,
  Mutation,
  Args,
  Query,
  Subscription,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { UserRelationsService } from './user-relations.service'
import { UserRelation } from './entities/user-relation.entity'
import {
  BadRequestException,
  Inject,
  UseGuards,
  forwardRef,
} from '@nestjs/common'
import { GqlAuthGuard } from './../auth/guards/gql-auth.guard'
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator'
import { User, UserPublicGameInfos } from 'src/users/entities/user.entity'
import * as DTO from './dto/user-relation.input'
import { EUserRelationType } from '@prisma/client'
import { ChannelsService } from 'src/channels/channels.service'
import { PubSub } from 'graphql-subscriptions'
import { userInfo } from 'os'

const PUB_DELETE_CHANNEL = `onDeleteChannel`

@Resolver(() => UserRelation)
export class UserRelationsResolver {
  constructor(
    private readonly userRelationsService: UserRelationsService,
    @Inject(forwardRef(() => ChannelsService))
    private readonly channelsService: ChannelsService,
    private readonly pubSub: PubSub,
  ) { }
  //**************************************************//
  //  MUTATION
  //**************************************************//

  @Mutation(() => UserRelation)
  @UseGuards(GqlAuthGuard)
  async createRequestFriend(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.CreateRequestFriendInput,
  ) {
    if (user.id === args.userTargetId) {
      throw new BadRequestException(
        `You can't be friends with yourself, sadly that's life`,
      )
    }
    const result = await this.userRelationsService.createRequestFriend(
      user.id,
      args.userTargetId,
    )
    const targetResult = await this.userRelationsService.findOne(
      args.userTargetId,
      user.id,
    )
    await this.pubSub.publish(`userRelationsChanged:${user.id}`, {
      userRelationsChanged: { ...result, userId: user.id },
    })
    await this.pubSub.publish(`userRelationsChanged:${result.userTargetId}`, {
      userRelationsChanged: { ...targetResult, userId: result.userTargetId },
    })
    return result
  }

  @Mutation(() => UserRelation)
  @UseGuards(GqlAuthGuard)
  async acceptFriendRequest(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.UpdateUserRelationInput,
  ) {
    const result = await this.userRelationsService.acceptPendingRelation(
      user.id,
      args.userTargetid,
    )
    const targetResult = await this.userRelationsService.findOne(
      args.userTargetid,
      user.id,
    )
    await this.pubSub.publish(`userRelationsChanged:${user.id}`, {
      userRelationsChanged: { ...result, userId: user.id },
    })
    await this.pubSub.publish(`userRelationsChanged:${result.userTargetId}`, {
      userRelationsChanged: { ...targetResult, userId: result.userTargetId },
    })
    return result
  }

  @Mutation(() => UserRelation)
  @UseGuards(GqlAuthGuard)
  async refuseFriendRequest(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.UpdateUserRelationInput,
  ) {
    const result = await this.userRelationsService.refusePendingRelation(
      user.id,
      args.userTargetid,
    )
    const targetResult = await this.userRelationsService.findOne(
      args.userTargetid,
      user.id,
    )
    await this.pubSub.publish(`userRelationsChanged:${user.id}`, {
      userRelationsChanged: { ...result, userId: user.id },
    })
    await this.pubSub.publish(`userRelationsChanged:${result.userTargetId}`, {
      userRelationsChanged: { ...targetResult, userId: result.userTargetId },
    })
    return result
  }

  @Mutation(() => UserRelation)
  @UseGuards(GqlAuthGuard)
  async blockRelation(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.UpdateUserRelationInput,
  ) {
    const channel = await this.channelsService.findDirectChannelForUsers(
      user.id,
      args.userTargetid,
    )
    if (channel !== null) {
      await this.channelsService.delete(channel.id)
      this.pubSub.publish(PUB_DELETE_CHANNEL, channel)
    }
    const targetResult = await this.userRelationsService.findOne(
      args.userTargetid,
      user.id,
    )
    const result = await this.userRelationsService.blockRelation(
      user.id,
      args.userTargetid,
    )
    if (targetResult) {
      targetResult.type = EUserRelationType.Terminated
      await this.pubSub.publish(`userRelationsChanged:${result.userTargetId}`, {
        userRelationsChanged: { ...targetResult, userId: result.userTargetId },
      })
    }
    await this.pubSub.publish(`userRelationsChanged:${user.id}`, {
      userRelationsChanged: { ...result, userId: user.id },
    })
    return result
  }

  @Mutation(() => UserRelation)
  @UseGuards(GqlAuthGuard)
  async unblockRelation(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.UpdateUserRelationInput,
  ) {
    return await this.userRelationsService.unblockRelation(
      user.id,
      args.userTargetid,
    )
  }

  @Mutation(() => UserRelation)
  @UseGuards(GqlAuthGuard)
  async removeFriend(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.UpdateUserRelationInput,
  ) {
    const targetResult = await this.userRelationsService.findOne(
      args.userTargetid,
      user.id,
    )
    if (!targetResult) {
      throw new BadRequestException(`you're not friend`)
    }
    const result = await this.userRelationsService.removeFriend(
      user.id,
      args.userTargetid,
    )
    targetResult.type = EUserRelationType.Terminated
    result.type = EUserRelationType.Terminated
    await this.pubSub.publish(`userRelationsChanged:${user.id}`, {
      userRelationsChanged: { ...result, userId: user.id },
    })
    await this.pubSub.publish(`userRelationsChanged:${result.userTargetId}`, {
      userRelationsChanged: { ...targetResult, userId: result.userTargetId },
    })
    return result
  }

  //**************************************************//
  //  QUERY
  //**************************************************//

  @Query(() => [UserRelation])
  @UseGuards(GqlAuthGuard)
  async findAllRelationsForMyUser(@CtxUser() user: User) {
    return await this.userRelationsService.findAllForUser(user.id)
  }

  @Query(() => [UserRelation])
  @UseGuards(GqlAuthGuard)
  async findAllFriendsForUser(@CtxUser() user: User) {
    return await this.userRelationsService.findAllFriendsForUser(user.id)
  }

  @Query(() => [UserRelation])
  @UseGuards(GqlAuthGuard)
  async findAllBlockedForUser(@CtxUser() user: User) {
    return await this.userRelationsService.findAllBlockedForUser(user.id)
  }

  @Query(() => [UserRelation])
  @UseGuards(GqlAuthGuard)
  async findAllBlockedByForUser(@CtxUser() user: User) {
    return await this.userRelationsService.findAllBlockedByForUser(user.id)
  }

  @Query(() => UserRelation, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async findRelation(@CtxUser() user: User, @Args(`userId`) userId: string) {
    const rel = await this.userRelationsService.findOne(user.id, userId)
    if (rel) {
      return rel
    }
    return null
  }
  //**************************************************//
  //  SUBSCRIPTION
  //**************************************************//

  @Subscription(() => UserRelation, {
    filter: (payload, variables) => {
      return payload.userRelationsChanged.userId === variables.userId
    },
  })
  userRelationsChanged(@Args(`userId`) userId: string) {
    return this.pubSub.asyncIterator(`userRelationsChanged:${userId}`)
  }

  @ResolveField(`friendInfos`, () => UserPublicGameInfos)
  async userGameInfos(
    @Parent() userRelation: UserRelation,
  ): Promise<UserPublicGameInfos> {
    if (userRelation.type != EUserRelationType.Terminated) {
      const { userTarget } = await this.userRelationsService.findOne(
        userRelation.userOwnerId,
        userRelation.userTargetId,
      )
      const gameStats = userTarget.gameStats
      let totalWins = 0

      if (gameStats) {
        gameStats.forEach((stats) => {
          if (stats.isWinner) {
            totalWins++
          }
        })
      }

      const ratio =
        gameStats && gameStats.length > 0 ? totalWins / gameStats.length : 0

      return {
        id: userTarget.id,
        username: userTarget.username,
        avatarUrl: userTarget.avatarUrl,
        ratio: Number(ratio.toFixed(2)),
      }
    }
    return {
      id:'0',
      username: `deleted`,
      avatarUrl: `https://https://img-4.linternaute.com/q_N1jQGmO8sUI6v2LOGFcRrXqpE=/1500x/smart/08e82cbcdf5a42c8b79808bc6b15792a/ccmcms-linternaute/48672760.jpg`,
      ratio: 0,
    }
  }
}
