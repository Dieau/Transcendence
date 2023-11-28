import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql'
import { EUserPresenceStatus } from '@prisma/client'

@ObjectType()
export class UserPresence {
  @Field(() => ID)
  id: string

  @Field(() => String)
  userId: String

  @Field(() => EUserPresenceStatus)
  connected: EUserPresenceStatus

  @Field(() => Date)
  updatedAt: Date
}

registerEnumType(EUserPresenceStatus, {
  name: `EUserPresenceStatus`,
})
