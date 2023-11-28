import * as DTO from './dto/channel.input'
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql'
import { ChannelsService } from './channels.service'
import { Channel } from './entities/channel.entity'
import { PubSub } from 'graphql-subscriptions'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import {
  BadRequestException,
  Inject,
  UnauthorizedException,
  UseGuards,
  forwardRef,
} from '@nestjs/common'
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator'
import { User } from 'src/users/entities/user.entity'
import {
  EChannelMemberType,
  EChannelType,
  EUserRelationType,
} from '@prisma/client'
import { ChannelMembersService } from 'src/channel-members/channel-members.service'
import { UserRelationsService } from 'src/user-relations/user-relations.service'

const PUB_INSERT_CHANNEL = `onInsertChannel`
const PUB_UPDATE_CHANNEL = `onUpdateChannel`
const PUB_DELETE_CHANNEL = `onDeleteChannel`

const PUB_NEW_VISIBLE_CHANNEL = `onNewVisibleChannel`

const PUB_INSERT_CHANNEL_MEMBER = `onInsertChannelMemberForChannelId`
const PUB_INSERT_MY_CHANNEL_MEMBER = `onInsertMyChannelMemberForUserId`

@Resolver(Channel)
export class ChannelsResolver {
  constructor(
    private readonly channelsService: ChannelsService,
    @Inject(forwardRef(() => ChannelMembersService))
    private readonly channelMembersService: ChannelMembersService,
    @Inject(forwardRef(() => UserRelationsService))
    private readonly userRelationsService: UserRelationsService,
    private readonly pubSub: PubSub,
  ) {}

  //**************************************************//
  //  MUTATION
  //**************************************************//

  @Mutation(() => Channel)
  @UseGuards(GqlAuthGuard)
  async createChannel(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.CreateChannelInput,
  ) {
    const channel = await this.channelsService.create(args)
    this.pubSub.publish(PUB_INSERT_CHANNEL, channel)
    return channel
  }

  @Mutation(() => Channel)
  @UseGuards(GqlAuthGuard)
  async updateChannel(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.UpdateChannelInput,
  ) {
    const member = await this.channelMembersService.findOne(args.id, user.id)
    if (
      member.type !== EChannelMemberType.Owner &&
      member.type !== EChannelMemberType.Admin
    )
      throw new UnauthorizedException(`Invalid member type`)
    const channel = await this.channelsService.update(
      args.id,
      args.password,
      args,
    )
    if (
      channel.channelType === EChannelType.Public ||
      channel.channelType === EChannelType.Protected
    )
      this.pubSub.publish(PUB_NEW_VISIBLE_CHANNEL, channel)
    this.pubSub.publish(PUB_UPDATE_CHANNEL, channel)
    return channel
  }

  @Mutation(() => Channel)
  @UseGuards(GqlAuthGuard)
  // @RequirePermissions(Permission.CHANNEL_READWRITE)
  async deleteChannel(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.DeleteChannelInput,
  ) {
    const channel = await this.channelsService.delete(args.id)
    this.pubSub.publish(PUB_DELETE_CHANNEL, channel)
    return channel
  }

  //**************************************************//
  //  QUERY
  //**************************************************//

  @Query(() => Channel)
  @UseGuards(GqlAuthGuard)
  async findChannel(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.FindChannelInput,
  ) {
    const member = await this.channelMembersService.findOne(args.id, user.id)
    if (member === null || member.type === EChannelMemberType.Banned) {
      throw new BadRequestException(
        `Unable to load the channel, you may not be a member of this channel or you are banned`,
      )
    }
    return await this.channelsService.findOne(args.id, user.id)
  }

  @Query(() => [Channel])
  @UseGuards(GqlAuthGuard)
  async findAllChannels() {
    return await this.channelsService.findAll()
  }

  @Query(() => [Channel])
  @UseGuards(GqlAuthGuard)
  async findAllVisibleChannels(@CtxUser() user: User) {
    return await this.channelsService.findAllVisible()
  }

  @Query(() => [Channel])
  @UseGuards(GqlAuthGuard)
  async findAllChannelsForUser(@CtxUser() user: User) {
    return await this.channelsService.findAllForUser(user.id)
  }

  @Query(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async checkChannelName(@Args(`args`) args: DTO.CheckChannelInput) {
    return await this.channelsService.checkChannelName(args.channelName)
  }

  //**************************************************//
  //  SUBSCRIPTION
  //**************************************************//

  @Subscription(() => Channel, {
    filter(payload: Channel, variables: DTO.OnChannelInput) {
      return payload.channelType !== EChannelType.Private
    },
    resolve: (value) => value,
  })
  onCreateChannel() {
    return this.pubSub.asyncIterator(PUB_INSERT_CHANNEL)
  }

  @Subscription(() => Channel, {
    filter(payload: Channel, variables: any) {
      return payload.id === variables.args.id
    },
    resolve: (value) => value,
  })
  onUpdateChannel(@Args(`args`) args: DTO.OnChannelInput) {
    return this.pubSub.asyncIterator(PUB_UPDATE_CHANNEL)
  }

  @Subscription(() => Channel, {
    filter(payload: Channel, variables: any) {
      return payload.id === variables.args.id
    },
    resolve: (value) => value,
  })
  onDeleteChannel(@Args(`args`) args: DTO.OnChannelInput) {
    return this.pubSub.asyncIterator(PUB_DELETE_CHANNEL)
  }

  @Subscription(() => Channel, {
    resolve: (value) => value,
  })
  onNewVisibleChannel() {
    return this.pubSub.asyncIterator(PUB_NEW_VISIBLE_CHANNEL)
  }

  //**************************************************//
  //  OTHER
  //**************************************************//

  @Mutation(() => Channel)
  @UseGuards(GqlAuthGuard)
  async sendDirectMessage(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.SendDirectMessageInput,
  ) {
    const targetedRelation = await this.userRelationsService.findOne(
      args.otherUserId,
      user.id,
    )
    if (
      targetedRelation !== null &&
      targetedRelation.type === EUserRelationType.Blocked
    )
      throw new UnauthorizedException(`This user blocked you`)
    const ownedRelation = await this.userRelationsService.findOne(
      user.id,
      args.otherUserId,
    )
    if (
      ownedRelation !== null &&
      ownedRelation.type === EUserRelationType.Blocked
    )
      throw new UnauthorizedException(`You blocked this user`)
    const channel = await this.channelsService.findDirectChannelForUsers(
      user.id,
      args.otherUserId,
    )
    if (channel !== null) return channel
    else {
      const newChannel = await this.channelsService.create({
        name: ``,
        channelType: EChannelType.Direct,
      })
      const myMember = await this.channelMembersService.create({
        channelId: newChannel.id,
        userId: user.id,
      })
      const otherMember = await this.channelMembersService.create({
        channelId: newChannel.id,
        userId: args.otherUserId,
      })
      myMember.channel.name = otherMember.user.username
      myMember.channel.avatarUrl = otherMember.user.avatarUrl
      otherMember.channel.name = myMember.user.username
      otherMember.channel.avatarUrl = myMember.user.avatarUrl
      await this.pubSub.publish(PUB_INSERT_MY_CHANNEL_MEMBER, otherMember)
      await this.pubSub.publish(PUB_INSERT_MY_CHANNEL_MEMBER, myMember)
      return newChannel
    }
  }
}
