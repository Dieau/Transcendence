import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql'
import { ChannelMembersService } from './channel-members.service'
import { ChannelMember } from './entities/channel-member.entity'
import {
  UseGuards,
  forwardRef,
  Inject,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlAuthGuard } from './../auth/guards/gql-auth.guard'
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator'
import { User } from 'src/users/entities/user.entity'
import * as DTO from './dto/channel-member.input'
import { ChannelsService } from 'src/channels/channels.service'
import { PubSub } from 'graphql-subscriptions'
import { EChannelMemberType } from '@prisma/client'

const PUB_INSERT_CHANNEL_MEMBER = `onInsertChannelMemberForChannelId`
const PUB_UPDATE_CHANNEL_MEMBER = `onUpdataChannelMemberForChannelId`
const PUB_DELETE_CHANNEL_MEMBER = `onDeleteChannelMemberForChannelId`

const PUB_INSERT_MY_CHANNEL_MEMBER = `onInsertMyChannelMemberForUserId`
const PUB_UPDATE_MY_CHANNEL_MEMBER = `onUpdateMyChannelMemberForUserId`
const PUB_DELETE_MY_CHANNEL_MEMBER = `onDeleteMyChannelMemberForUserId`

const PUB_DELETE_CHANNEL = `onDeleteChannel`

@Resolver(() => ChannelMember)
export class ChannelMembersResolver {
  constructor(
    private readonly channelMembersService: ChannelMembersService,
    @Inject(forwardRef(() => ChannelsService))
    private readonly channelsService: ChannelsService,
    private readonly pubSub: PubSub,
  ) {}

  //**************************************************//
  //  MUTATION
  //**************************************************//

  @Mutation(() => ChannelMember)
  @UseGuards(GqlAuthGuard)
  async createMyMemberForChannel(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.CreateMyMemberForChannelInput,
  ) {
    if (
      await this.channelsService.verifyChannelPassword(
        args.channelId,
        args.channelPassword,
      )
    )
      throw new UnauthorizedException(`Invalid password`)
    delete args.channelPassword
    try {
      const res = await this.channelMembersService.create({
        ...args,
        userId: user.id,
      })
      await this.pubSub.publish(PUB_INSERT_MY_CHANNEL_MEMBER, res)
      await this.pubSub.publish(PUB_INSERT_CHANNEL_MEMBER, res)
      return res
    } catch (e) {
      throw new UnauthorizedException(
        `Unable to join the channel, you may already be a member of this channel or you are banned`,
      )
    }
  }

  @Mutation(() => ChannelMember)
  @UseGuards(GqlAuthGuard)
  async createMemberForChannel(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.CreateMemberForChannelInput,
  ) {
    const member = await this.channelMembersService.findOne(
      args.channelId,
      user.id,
    )
    if (
      member.type !== EChannelMemberType.Owner &&
      member.type !== EChannelMemberType.Admin
    )
      throw new UnauthorizedException(`Invalid member type`)
    try {
      const res = await this.channelMembersService.create({
        ...args,
      })
      await this.pubSub.publish(PUB_INSERT_CHANNEL_MEMBER, res)
      await this.pubSub.publish(PUB_INSERT_MY_CHANNEL_MEMBER, res)
      return res
    } catch (e) {
      throw new UnauthorizedException(
        `Unable to create channel member, this user may already be a member of this channel or is banned`,
      )
    }
  }

  @Mutation(() => ChannelMember)
  @UseGuards(GqlAuthGuard)
  async updateMemberForChannel(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.UpdateMyMemberForChannelInput,
  ) {
    const member = await this.channelMembersService.findOne(
      args.channelId,
      user.id,
    )
    if (
      member.type !== EChannelMemberType.Owner &&
      member.type !== EChannelMemberType.Admin
    )
      throw new UnauthorizedException(`Invalid member type`)
    const res = await this.channelMembersService.update(
      args.userId,
      args.channelId,
      args,
    )
    if (res.type === EChannelMemberType.Banned)
      await this.pubSub.publish(PUB_DELETE_MY_CHANNEL_MEMBER, res)
    await this.pubSub.publish(PUB_UPDATE_CHANNEL_MEMBER, res)
    await this.pubSub.publish(PUB_UPDATE_MY_CHANNEL_MEMBER, res)
    return res
  }

  @Mutation(() => ChannelMember)
  @UseGuards(GqlAuthGuard)
  async deleteMemberForChannel(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.DeleteMemberForChannelInput,
  ) {
    const member = await this.channelMembersService.findOne(
      args.channelId,
      user.id,
    )
    if (
      member.type !== EChannelMemberType.Owner &&
      member.type !== EChannelMemberType.Admin
    )
      throw new UnauthorizedException(`Invalid member type`)
    const res = await this.channelMembersService.delete(
      args.userId,
      args.channelId,
    )
    if (res.type === EChannelMemberType.Owner) {
      this.transferOwnership(user, args)
    }
    await this.pubSub.publish(PUB_DELETE_CHANNEL_MEMBER, res)
    await this.pubSub.publish(PUB_DELETE_MY_CHANNEL_MEMBER, res)
    return res
  }

  @Mutation(() => ChannelMember)
  @UseGuards(GqlAuthGuard)
  async deleteMyMemberForChannel(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.DeleteMyMemberForChannelInput,
  ) {
    const res = await this.channelMembersService.delete(user.id, args.channelId)
    if (res.type === EChannelMemberType.Owner) {
      this.transferOwnership(user, args)
    }
    await this.pubSub.publish(PUB_DELETE_CHANNEL_MEMBER, res)
    await this.pubSub.publish(PUB_DELETE_MY_CHANNEL_MEMBER, res)
    return res
  }

  //**************************************************//
  //  QUERY
  //**************************************************//

  @Query(() => ChannelMember)
  @UseGuards(GqlAuthGuard)
  async findMyChannelMemberForChannel(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.FindMyChannelMemberForChannelInput,
  ) {
    return await this.channelMembersService.findOne(args.channelId, user.id)
  }

  @Query(() => [ChannelMember])
  @UseGuards(GqlAuthGuard)
  async findAllChannelMembersForChannel(
    @Args(`args`) args: DTO.FindAllChannelMembersForChannelInput,
  ) {
    return await this.channelMembersService.findAll(args.channelId)
  }

  //**************************************************//
  //  SUBSCRIPTION
  //**************************************************//

  @Subscription(() => ChannelMember, {
    filter: (payload: ChannelMember, variables: any) => {
      return payload.channelId === variables.args.channelId
    },
    resolve: (payload) => {
      return payload
    },
  })
  onNewChannelMemberForChannelId(
    @Args(`args`) args: DTO.OnChannelMemberChannelInput,
  ) {
    return this.pubSub.asyncIterator(PUB_INSERT_CHANNEL_MEMBER)
  }

  @Subscription(() => ChannelMember, {
    filter: (payload: ChannelMember, variables: any) => {
      return payload.channelId === variables.args.channelId
    },
    resolve: (payload) => {
      return payload
    },
  })
  onUpdateChannelMemberForChannelId(
    @Args(`args`) args: DTO.OnChannelMemberChannelInput,
  ) {
    return this.pubSub.asyncIterator(PUB_UPDATE_CHANNEL_MEMBER)
  }

  @Subscription(() => ChannelMember, {
    filter: (payload: ChannelMember, variables: any) => {
      return payload.channelId === variables.args.channelId
    },
    resolve: (payload) => {
      return payload
    },
  })
  onDeleteChannelMemberForChannelId(
    @Args(`args`) args: DTO.OnChannelMemberChannelInput,
  ) {
    return this.pubSub.asyncIterator(PUB_DELETE_CHANNEL_MEMBER)
  }

  @Subscription(() => ChannelMember, {
    filter: (payload: ChannelMember, variables: any) => {
      return payload.userId === variables.args.userId
    },
    resolve: (payload) => {
      return payload
    },
  })
  onNewChannelMemberForUserId(
    @Args(`args`) args: DTO.OnChannelMemberUserInput,
  ) {
    return this.pubSub.asyncIterator(PUB_INSERT_MY_CHANNEL_MEMBER)
  }

  @Subscription(() => ChannelMember, {
    filter: (payload: ChannelMember, variables: any) => {
      return payload.userId === variables.args.userId
    },
    resolve: (payload) => {
      return payload
    },
  })
  onUpdateChannelMemberForUserlId(
    @Args(`args`) args: DTO.OnChannelMemberUserInput,
  ) {
    return this.pubSub.asyncIterator(PUB_UPDATE_MY_CHANNEL_MEMBER)
  }

  @Subscription(() => ChannelMember, {
    filter: (payload: ChannelMember, variables: any) => {
      return payload.userId === variables.args.userId
    },
    resolve: (payload) => {
      return payload
    },
  })
  onDeleteChannelMemberForUserlId(
    @Args(`args`) args: DTO.OnChannelMemberUserInput,
  ) {
    return this.pubSub.asyncIterator(PUB_DELETE_MY_CHANNEL_MEMBER)
  }

  //**************************************************//
  //  OTHER
  //**************************************************//

  async transferOwnership(user: User, args: DTO.DeleteMyMemberForChannelInput) {
    const oldestAdmin =
      await this.channelMembersService.findOldestAdminForChannel(args.channelId)
    const oldestMember =
      await this.channelMembersService.findOldestMemberForChannel(
        args.channelId,
      )
    if (oldestAdmin !== null) {
      oldestAdmin.type = EChannelMemberType.Owner
      const res = await this.channelMembersService.update(
        oldestAdmin.userId,
        oldestAdmin.channelId,
        oldestAdmin,
      )
      await this.pubSub.publish(PUB_UPDATE_CHANNEL_MEMBER, res)
      await this.pubSub.publish(PUB_UPDATE_MY_CHANNEL_MEMBER, res)
    } else if (oldestMember !== null) {
      oldestMember.type = EChannelMemberType.Owner
      const res = await this.channelMembersService.update(
        oldestMember.userId,
        oldestMember.channelId,
        oldestMember,
      )
      await this.pubSub.publish(PUB_UPDATE_CHANNEL_MEMBER, res)
      await this.pubSub.publish(PUB_UPDATE_MY_CHANNEL_MEMBER, res)
    } else {
      const res = await this.channelsService.delete(args.channelId)
      this.pubSub.publish(PUB_DELETE_CHANNEL, res)
    }
  }
}
