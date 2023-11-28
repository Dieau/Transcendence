import { Field, InputType } from '@nestjs/graphql'
import { EUserPresenceStatus } from '@prisma/client'

//**************************************************//
//  MUTATION
//**************************************************//

@InputType()
export class UpdateUserPresenceInput {
  @Field(() => EUserPresenceStatus)
  connected: EUserPresenceStatus
}

//**************************************************//
//  QUERY
//**************************************************//

@InputType()
export class FindUserPresencesInput {
  @Field(() => String)
  userId: string
}

//**************************************************//
//  SUBSCRIPTION
//**************************************************//

@InputType()
export class OnUpdateUserPresenceInput {
  @Field(() => String)
  userId: string
}
