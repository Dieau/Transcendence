import { Field, InputType } from '@nestjs/graphql'
import { EChannelMemberType } from '@prisma/client'
//**************************************************//
//  MUTATION
//**************************************************//

@InputType()
export class CreateMyMemberForChannelInput {
  @Field(() => String)
  channelId: string

  @Field(() => String, { nullable: true })
  channelPassword?: string

  @Field(() => EChannelMemberType, { nullable: true })
  type?: EChannelMemberType
}

@InputType()
export class CreateMemberForChannelInput {
  @Field(() => String)
  channelId: string

  @Field(() => String)
  userId: string
}

@InputType()
export class UpdateMyMemberForChannelInput {
  @Field(() => String)
  channelId: string

  @Field(() => String)
  userId: string

  @Field(() => Boolean, { nullable: true })
  muted?: boolean

  @Field(() => EChannelMemberType, { nullable: true })
  type?: EChannelMemberType
}

@InputType()
export class DeleteMemberForChannelInput {
  @Field(() => String)
  channelId: string

  @Field(() => String)
  userId: string
}

@InputType()
export class DeleteMyMemberForChannelInput {
  @Field(() => String)
  channelId: string
}

//**************************************************//
//  QUERY
//**************************************************//

@InputType()
export class FindMyChannelMemberForChannelInput {
  @Field(() => String)
  channelId: string
}

@InputType()
export class FindAllChannelMembersForChannelInput {
  @Field(() => String)
  channelId: string
}

@InputType()
export class FindAllChannelMembersForUserInput {
  @Field(() => String)
  userId: string
}

//**************************************************//
//  SUBSCRIPTION
//**************************************************//

@InputType()
export class OnChannelMemberChannelInput {
  @Field(() => String)
  channelId: string
}

@InputType()
export class OnChannelMemberUserInput {
  @Field(() => String)
  userId: string
}
