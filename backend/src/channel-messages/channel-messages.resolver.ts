import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql'
import { ChannelMessagesService } from './channel-messages.service'
import { ChannelMessage } from './entities/channel-message.entity'
import * as DTO from './dto/channel-message.input'
import { UnauthorizedException, UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from './../auth/guards/gql-auth.guard'
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator'
import { User, UserPublic } from 'src/users/entities/user.entity'
import { PubSub } from 'graphql-subscriptions'
import { ChannelMembersService } from 'src/channel-members/channel-members.service'

const PUB_UPSERT_CHANNEL_MESSAGE = `onUpsertChannelMessageForChannel`
const PUB_DELETE_CHANNEL_MESSAGE = `onDeleteChannelMessageForChannel`

@Resolver(() => ChannelMessage)
export class ChannelMessagesResolver {
  constructor(
    private readonly channelMembersService: ChannelMembersService,
    private readonly channelMessagesService: ChannelMessagesService,
    private readonly pubSub: PubSub,
  ) {}

  //**************************************************//
  //  MUTATION
  //**************************************************//

  @Mutation(() => ChannelMessage)
  @UseGuards(GqlAuthGuard)
  async createMessageForChannel(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.CreateMessageForChannelInput,
  ) {
    const member = await this.channelMembersService.findOne(
      args.channelId,
      user.id,
    )
    if (member.muted) throw new UnauthorizedException(`You are muted`)
    const res = await this.channelMessagesService.create({
      ...args,
      userId: user.id,
    })
    await this.pubSub.publish(PUB_UPSERT_CHANNEL_MESSAGE, res)
    return res
  }

  @Mutation(() => ChannelMessage)
  @UseGuards(GqlAuthGuard)
  async updateMyMessageForChannel(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.UpdateMyMessageForChannelInput,
  ) {
    return await this.channelMessagesService.update(args.id, user.id, args)
  }

  @Mutation(() => ChannelMessage)
  @UseGuards(GqlAuthGuard)
  async deleteMyMessageForChannel(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.DeleteMyMessageForChannelInput,
  ) {
    const res = await this.channelMessagesService.delete(args.id, user.id)
    this.pubSub.publish(PUB_DELETE_CHANNEL_MESSAGE, res)
    return res
  }

  //**************************************************//
  //  QUERY
  //**************************************************//

  @Query(() => [ChannelMessage])
  async findAllChannelMessagesForChannel(
    @Args(`args`) args: DTO.FindAllMessagesForChannelInput,
  ) {
    return await this.channelMessagesService.findAllForChannel(args.channelId)
  }

  @Query(() => UserPublic)
  async findUserForChannelMessage(
    @Args(`args`) args: DTO.FindUserForChannelMessageInput,
  ) {
    return (
      await this.channelMessagesService.findUserForChannelMessage(args.id)
    ).user
  }

  //**************************************************//
  //  SUBSCRIPTION
  //**************************************************//

  @Subscription(() => ChannelMessage, {
    filter: (payload: ChannelMessage, variables: any) =>
      payload.channelId === variables.args.channelId,
    resolve: (payload) => {
      return payload
    },
  })
  onNewChannelMessageForChannelId(
    @Args(`args`) args: DTO.OnNewChannelMessageForChannelIdInput,
  ) {
    return this.pubSub.asyncIterator(PUB_UPSERT_CHANNEL_MESSAGE)
  }

  @Subscription(() => ChannelMessage, {
    filter: (payload: ChannelMessage, variables: any) =>
      payload.channelId === variables.args.channelId,
    resolve: (payload) => {
      return payload
    },
  })
  onDeleteChannelMessageForChannel(
    @Args(`args`) args: DTO.OnDeleteChannelMessageForChannel,
  ) {
    return this.pubSub.asyncIterator(PUB_DELETE_CHANNEL_MESSAGE)
  }
}
