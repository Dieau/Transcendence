import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class GameMatchmakingMember {
  @Field(() => String)
  userId: string
  @Field(() => String)
  message: string
  @Field(() => Boolean)
  isDeleted: boolean
  @Field(() => String, { nullable: true })
  targetUserId: string
  @Field(() => Boolean, { nullable: true })
  isLaunched: boolean
}
