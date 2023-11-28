import { ObjectType, Field, registerEnumType, ID } from '@nestjs/graphql'
import { Channel, EChannelMemberType, User } from '@prisma/client'
import { Channel as ChannelEntity } from 'src/channels/entities/channel.entity'
import { UserPublic } from 'src/users/entities/user.entity'

@ObjectType()
export class ChannelMember {
  @Field(() => ID)
  channelId: string

  @Field(() => String)
  userId: string

  @Field(() => EChannelMemberType)
  type: EChannelMemberType

  @Field(() => Boolean)
  muted: Boolean

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => ChannelEntity)
  channel: Channel

  @Field(() => UserPublic)
  user: User
}

registerEnumType(EChannelMemberType, {
  name: `EChannelMemberType`,
})
