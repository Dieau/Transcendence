import { ObjectType, Field, registerEnumType, ID } from '@nestjs/graphql'
import { ChannelMember, ChannelMessage, EChannelType } from '@prisma/client'
import { ChannelMember as ChannelMemberEntity } from 'src/channel-members/entities/channel-member.entity'
import { ChannelMessage as ChannelMessageEntity } from 'src/channel-messages/entities/channel-message.entity'

@ObjectType()
export class Channel {
  password?: string

  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String, { nullable: true })
  avatarUrl?: string

  @Field(() => EChannelType)
  channelType: EChannelType

  @Field(() => Date)
  createdAt: Date

  @Field(() => [ChannelMemberEntity], { nullable: true })
  channelMembers?: [ChannelMember]

  @Field(() => [ChannelMessageEntity], { nullable: true })
  channelMessages?: [ChannelMessage]
}

registerEnumType(EChannelType, {
  name: `EChannelType`,
})
