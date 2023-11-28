import { Field, InputType } from '@nestjs/graphql'
import { EChannelType } from '@prisma/client'

//**************************************************//
//  MUTATION
//**************************************************//

@InputType()
export class CreateChannelInput {
  @Field(() => String)
  name: string

  @Field(() => String, { nullable: true })
  avatarUrl?: string

  @Field(() => String, { nullable: true })
  password?: string

  @Field(() => EChannelType)
  channelType: EChannelType
}

@InputType()
export class UpdateChannelInput {
  @Field(() => String)
  id: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  avatarUrl?: string

  @Field(() => EChannelType, { nullable: true })
  channelType?: EChannelType

  @Field(() => String, { nullable: true })
  password?: string
}

@InputType()
export class DeleteChannelInput {
  @Field(() => String)
  id: string
}

@InputType()
export class UpdateChannelPasswordInput {
  @Field(() => String)
  id: string

  @Field(() => String)
  password: string
}

//**************************************************//
//  QUERY
//**************************************************//

@InputType()
export class FindChannelInput {
  @Field(() => String)
  id: string
}

@InputType()
export class CheckChannelInput {
  @Field(() => String)
  channelName: string
}

//**************************************************//
//  SUBSCRIPTION
//**************************************************//

@InputType()
export class OnChannelInput {
  @Field(() => String)
  id: string
}

//**************************************************//
//  OTHER4
//**************************************************//

@InputType()
export class SendDirectMessageInput {
  @Field(() => String)
  otherUserId: string
}
